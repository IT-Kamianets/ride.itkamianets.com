import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@wawjs/ngx-translate';
import { ThemeService } from '@wawjs/ngx-ui';
import { CompanyService } from '../../feature/company/company.service';
import { LanguageOption } from '../../feature/language/language.interface';
import { LanguageService } from '../../feature/language/language.service';

@Component({
	selector: 'app-topbar',
	imports: [NgOptimizedImage, RouterLink, TranslatePipe],
	templateUrl: './topbar.component.html',
	styleUrl: './topbar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
	private readonly _translateService = inject(TranslateService);
	private readonly _themeService = inject(ThemeService);
	private readonly _languageService = inject(LanguageService);
	private readonly _companyService = inject(CompanyService);

	protected readonly mode = computed(() => this._themeService.mode() ?? 'light');
	protected readonly languageMenuOpen = signal(false);
	protected readonly languages = this._languageService.languages;
	protected readonly company = this._companyService.company;
	protected readonly currentLanguage = computed(() =>
		this._languageService.getLanguage(this._languageService.language()),
	);
	protected readonly toggleIcon = computed(() =>
		this.mode() === 'dark' ? 'light_mode' : 'dark_mode',
	);
	protected readonly toggleLabel = computed(() =>
		this.mode() === 'dark'
			? this._translateService.translate('Switch to light mode')()
			: this._translateService.translate('Switch to dark mode')(),
	);
	protected readonly languageMenuLabel = computed(() =>
		this._translateService.translate('Open language menu')(),
	);
	protected readonly languageCycleLabel = computed(
		() =>
			`${this._translateService.translate('Switch language to')()} ${this.getNextLanguage().label}`,
	);

	constructor() {
		this._themeService.init();
	}

	protected toggleMode() {
		const nextMode = this.mode() === 'dark' ? 'light' : 'dark';
		this._themeService.setMode(nextMode);
	}

	protected nextLanguage() {
		void this._languageService.nextLanguage();
		this.languageMenuOpen.set(false);
	}

	protected toggleLanguageMenu() {
		this.languageMenuOpen.update((open) => !open);
	}

	protected setLanguage(language: LanguageOption) {
		void this._languageService.setLanguage(language.code);
		this.languageMenuOpen.set(false);
	}

	protected getNextLanguage() {
		const languages = this.languages();
		const currentCode = this.currentLanguage().code;
		const currentIndex = languages.findIndex((language) => language.code === currentCode);

		return languages[(currentIndex + 1) % languages.length] ?? languages[0]!;
	}
}
