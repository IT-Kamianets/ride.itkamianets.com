import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		data: {
			meta: {
				titleSuffix: '',
			},
		},
		loadComponent: () =>
			import('./pages/landing/landing.component').then((m) => m.LandingComponent),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
