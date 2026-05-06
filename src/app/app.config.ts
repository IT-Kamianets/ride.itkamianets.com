import {
	APP_INITIALIZER,
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideNgxCore } from '@wawjs/ngx-core';
import { provideTranslate } from '@wawjs/ngx-translate';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { BootstrapService } from './feature/bootstrap/bootstrap.service';
import { COMPANY_FALLBACK } from './feature/company/company.const';
import { LANGUAGES } from './feature/language/language.const';

const initializeBootstrapData = (bootstrapService: BootstrapService) => () =>
	bootstrapService.initialize();
const availableLanguages = LANGUAGES.map((language) => language.code);

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideNgxCore({
			meta: {
				applyFromRoutes: true,
				useTitleSuffix: true,
				defaults: {
					title: COMPANY_FALLBACK.title,
					titleSuffix: ` | ${COMPANY_FALLBACK.name}`,
					description: COMPANY_FALLBACK.description,
					image: COMPANY_FALLBACK.image,
					robots: 'index, follow',
				},
			},
		}),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		provideTranslate({
			defaultLanguage: environment.defaultLanguage,
			languages: availableLanguages,
			folder: '/i18n/',
		}),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeBootstrapData,
			deps: [BootstrapService],
			multi: true,
		},
	],
};
