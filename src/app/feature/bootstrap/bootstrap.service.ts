import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, TransferState } from '@angular/core';
import { environment } from '../../../environments/environment';
import { COMPANY_FALLBACK, EMPTY_COMPANY } from '../company/company.const';
import { Company } from '../company/company.interface';
import { CompanyService } from '../company/company.service';
import { BOOTSTRAP_STATE_KEY } from './bootstrap.const';
import { BootstrapData } from './bootstrap.interface';

@Injectable({
	providedIn: 'root',
})
export class BootstrapService {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _transferState = inject(TransferState);
	private readonly _companyService = inject(CompanyService);

	async initialize() {
		this._companyService.loading.set(true);

		const transferData = this._transferState.get<BootstrapData | null>(
			BOOTSTRAP_STATE_KEY,
			null,
		);

		if (transferData) {
			this._apply(transferData);

			if (isPlatformBrowser(this._platformId)) {
				this._transferState.remove(BOOTSTRAP_STATE_KEY);
				void this._refreshInBrowser();
			}

			return;
		}

		if (isPlatformServer(this._platformId)) {
			const data = this._resolveBootstrapData(await this._load());

			this._transferState.set(BOOTSTRAP_STATE_KEY, data);
			this._apply(data);

			return;
		}

		void this._refreshInBrowser();
	}

	private _apply(data: BootstrapData) {
		this._companyService.company.set(data.company ?? EMPTY_COMPANY);
		this._companyService.loading.set(false);
	}

	private async _refreshInBrowser() {
		const bootstrapData = await this._load();
		const data = this._resolveBootstrapData(bootstrapData);

		this._apply(data);
	}

	private async _load() {
		try {
			const response = await fetch(
				`${environment.apiUrl}/api/regionit/bootstrap/${environment.companyId}`,
			);

			if (!response.ok) {
				return null;
			}

			return (await response.json()) as BootstrapData;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	private _resolveBootstrapData(data: BootstrapData | null): BootstrapData {
		return {
			company: this._resolveFeatureValue<Company>(
				data?.company,
				COMPANY_FALLBACK,
				EMPTY_COMPANY,
			),
		};
	}

	private _resolveFeatureValue<T>(
		apiValue: T | null | undefined,
		fallbackValue: T,
		emptyValue: T,
	): T {
		if (this._hasContent(apiValue)) {
			return apiValue as T;
		}

		if (this._hasContent(fallbackValue)) {
			return fallbackValue;
		}

		return emptyValue;
	}

	private _hasContent(value: unknown): boolean {
		if (value == null) {
			return false;
		}

		if (typeof value === 'string') {
			return value.trim().length > 0;
		}

		if (Array.isArray(value)) {
			return value.length > 0;
		}

		if (typeof value === 'object') {
			return Object.values(value).some((entry) => this._hasContent(entry));
		}

		return true;
	}

}
