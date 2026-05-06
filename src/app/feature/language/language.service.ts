import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
	LanguageService as NgxLanguageService,
	TranslateService,
} from '@wawjs/ngx-translate';

import { LANGUAGES } from './language.const';
import { LanguageOption } from './language.interface';
import { LanguageCode } from './language.type';

@Injectable({ providedIn: 'root' })
export class LanguageService {
	private readonly _doc = inject(DOCUMENT);
	private readonly _ngxLanguageService = inject(NgxLanguageService);
	private readonly _translateService = inject(TranslateService);

	readonly languages = signal<LanguageOption[]>(LANGUAGES);
	readonly language = computed(
		() => (this._ngxLanguageService.language() || 'en') as LanguageCode,
	);

	constructor() {
		effect(() => {
			this._doc.documentElement.lang = this.getLanguage(this.language()).htmlLang;
		});
	}

	async setLanguage(language: LanguageCode) {
		await this._translateService.setLanguage(language);
	}

	async nextLanguage() {
		const languages = this.languages();
		const currentIndex = languages.findIndex((language) => language.code === this.language());
		const nextIndex = (currentIndex + 1) % languages.length;

		await this.setLanguage(languages[nextIndex]?.code ?? 'en');
	}

	getLanguage(code: LanguageCode) {
		return this.languages().find((language) => language.code === code) ?? this.languages()[0]!;
	}
}
