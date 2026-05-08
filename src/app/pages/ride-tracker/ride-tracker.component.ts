import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';

type RideStatus = 'idle' | 'active' | 'paused' | 'finished';

interface RidePoint {
	lat: number;
	lng: number;
	timestamp: number;
	speedKmh: number;
}

interface RideState {
	status: RideStatus;
	startedAt: number | null;
	pausedAt: number | null;
	totalPausedMs: number;
	distanceMeters: number;
	maxSpeedKmh: number;
	lastPoint: RidePoint | null;
	points: RidePoint[];
}

const STORAGE_KEY = 'ride.tracker.state.v1';
const SVG_SIZE = 240;

@Component({
	selector: 'app-ride-tracker',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './ride-tracker.component.html',
	styleUrl: './ride-tracker.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideTrackerComponent implements OnDestroy {
	protected readonly gpsStatus = signal('Ready');
	protected readonly state = signal<RideState>(this.getInitialState());
	protected readonly now = signal(Date.now());
	protected readonly hasGeolocation = signal(this.isGeolocationSupported());

	protected readonly distanceKm = computed(() => this.state().distanceMeters / 1000);
	protected readonly durationMs = computed(() => this.getDurationMs(this.state(), this.now()));
	protected readonly avgSpeedKmh = computed(() => {
		const hours = this.durationMs() / 3_600_000;
		return hours > 0 ? this.distanceKm() / hours : 0;
	});
	protected readonly currentSpeedKmh = computed(() => this.state().lastPoint?.speedKmh ?? 0);
	protected readonly routePath = computed(() => this.buildRoutePath(this.state().points));
	protected readonly latestPoint = computed(() => this.state().lastPoint);

	private watchId: number | null = null;
	private tickIntervalId: ReturnType<typeof setInterval> | null = null;

	constructor() {
		this.restoreState();
		this.ensureTicker();

		if (this.state().status === 'active') {
			this.startWatch();
		}
	}

	ngOnDestroy(): void {
		this.stopWatch();
		if (this.tickIntervalId !== null) {
			clearInterval(this.tickIntervalId);
		}
	}

	protected startRide(): void {
		if (!this.hasGeolocation()) {
			this.gpsStatus.set('GPS unavailable on this device');
			return;
		}

		const now = Date.now();
		this.state.set({
			status: 'active',
			startedAt: now,
			pausedAt: null,
			totalPausedMs: 0,
			distanceMeters: 0,
			maxSpeedKmh: 0,
			lastPoint: null,
			points: [],
		});
		this.persistState();
		this.startWatch();
	}

	protected pauseRide(): void {
		const current = this.state();
		if (current.status !== 'active') {
			return;
		}

		this.state.update((value) => ({
			...value,
			status: 'paused',
			pausedAt: Date.now(),
		}));
		this.gpsStatus.set('Paused');
		this.stopWatch();
		this.persistState();
	}

	protected resumeRide(): void {
		const current = this.state();
		if (current.status !== 'paused' || current.pausedAt === null) {
			return;
		}

		const pauseDuration = Date.now() - current.pausedAt;
		this.state.update((value) => ({
			...value,
			status: 'active',
			pausedAt: null,
			totalPausedMs: value.totalPausedMs + pauseDuration,
		}));
		this.persistState();
		this.startWatch();
	}

	protected finishRide(): void {
		const current = this.state();
		if (current.status === 'idle') {
			return;
		}

		if (!confirm('Finish this ride? Unsaved active tracking will be cleared.')) {
			return;
		}

		this.stopWatch();
		this.state.update((value) => ({ ...value, status: 'finished' }));
		this.persistState();
	}

	protected resetRide(): void {
		this.stopWatch();
		this.state.set(this.getInitialState());
		this.gpsStatus.set('Ready');
		localStorage.removeItem(STORAGE_KEY);
	}

	private startWatch(): void {
		if (!this.hasGeolocation()) {
			this.gpsStatus.set('GPS unavailable on this device');
			return;
		}

		if (this.watchId !== null) {
			return;
		}

		this.gpsStatus.set('Searching for GPS...');
		this.watchId = navigator.geolocation.watchPosition(
			(position) => {
				const speedMps = position.coords.speed ?? 0;
				const nextPoint: RidePoint = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					timestamp: position.timestamp,
					speedKmh: Math.max(speedMps, 0) * 3.6,
				};

				this.state.update((value) => {
					if (value.status !== 'active') {
						return value;
					}

					let nextDistance = value.distanceMeters;
					if (value.lastPoint) {
						nextDistance += this.getDistanceMeters(value.lastPoint, nextPoint);
					}

					return {
						...value,
						lastPoint: nextPoint,
						points: [...value.points, nextPoint],
						distanceMeters: nextDistance,
						maxSpeedKmh: Math.max(value.maxSpeedKmh, nextPoint.speedKmh),
					};
				});

				this.gpsStatus.set('GPS active');
				this.persistState();
			},
			(error) => {
				if (error.code === error.PERMISSION_DENIED) {
					this.gpsStatus.set('GPS permission denied');
				} else if (error.code === error.POSITION_UNAVAILABLE) {
					this.gpsStatus.set('GPS position unavailable');
				} else {
					this.gpsStatus.set('GPS error');
				}
			},
			{
				enableHighAccuracy: true,
				maximumAge: 0,
				timeout: 10_000,
			},
		);
	}

	private stopWatch(): void {
		if (this.watchId === null || !this.hasGeolocation()) {
			return;
		}

		navigator.geolocation.clearWatch(this.watchId);
		this.watchId = null;
	}

	private ensureTicker(): void {
		if (this.tickIntervalId !== null) {
			return;
		}

		this.tickIntervalId = setInterval(() => {
			this.now.set(Date.now());
		}, 1000);
	}

	private getInitialState(): RideState {
		return {
			status: 'idle',
			startedAt: null,
			pausedAt: null,
			totalPausedMs: 0,
			distanceMeters: 0,
			maxSpeedKmh: 0,
			lastPoint: null,
			points: [],
		};
	}

	private getDurationMs(state: RideState, now: number): number {
		if (!state.startedAt) {
			return 0;
		}

		const end = state.pausedAt ?? now;
		return Math.max(0, end - state.startedAt - state.totalPausedMs);
	}

	private formatNumber(value: number, fractionDigits = 2): number {
		return Number(value.toFixed(fractionDigits));
	}

	protected toKm(valueMeters: number): number {
		return this.formatNumber(valueMeters / 1000, 2);
	}

	protected toDurationText(valueMs: number): string {
		const totalSeconds = Math.floor(valueMs / 1000);
		const hours = Math.floor(totalSeconds / 3600)
			.toString()
			.padStart(2, '0');
		const minutes = Math.floor((totalSeconds % 3600) / 60)
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor(totalSeconds % 60)
			.toString()
			.padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	}

	protected toSpeed(value: number): number {
		return this.formatNumber(value, 1);
	}

	private getDistanceMeters(a: RidePoint, b: RidePoint): number {
		const earthRadius = 6_371_000;
		const lat1 = this.toRadians(a.lat);
		const lat2 = this.toRadians(b.lat);
		const deltaLat = this.toRadians(b.lat - a.lat);
		const deltaLng = this.toRadians(b.lng - a.lng);

		const sinLat = Math.sin(deltaLat / 2);
		const sinLng = Math.sin(deltaLng / 2);
		const h =
			sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
		const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
		return earthRadius * c;
	}

	private toRadians(value: number): number {
		return (value * Math.PI) / 180;
	}

	private isGeolocationSupported(): boolean {
		return typeof navigator !== 'undefined' && 'geolocation' in navigator;
	}

	private persistState(): void {
		if (typeof localStorage === 'undefined') {
			return;
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
	}

	private restoreState(): void {
		if (typeof localStorage === 'undefined') {
			return;
		}

		const payload = localStorage.getItem(STORAGE_KEY);
		if (!payload) {
			return;
		}

		try {
			const parsed = JSON.parse(payload) as RideState;
			this.state.set({
				...this.getInitialState(),
				...parsed,
				points: Array.isArray(parsed.points) ? parsed.points : [],
			});
		} catch {
			localStorage.removeItem(STORAGE_KEY);
		}
	}

	private buildRoutePath(points: RidePoint[]): string {
		if (points.length < 2) {
			return '';
		}

		const minLat = Math.min(...points.map((point) => point.lat));
		const maxLat = Math.max(...points.map((point) => point.lat));
		const minLng = Math.min(...points.map((point) => point.lng));
		const maxLng = Math.max(...points.map((point) => point.lng));

		const latRange = Math.max(maxLat - minLat, 0.00001);
		const lngRange = Math.max(maxLng - minLng, 0.00001);
		const padding = 16;
		const drawable = SVG_SIZE - padding * 2;

		return points
			.map((point, index) => {
				const x = padding + ((point.lng - minLng) / lngRange) * drawable;
				const y = padding + (1 - (point.lat - minLat) / latRange) * drawable;
				return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
			})
			.join(' ');
	}
}
