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
			import('./pages/ride-tracker/ride-tracker.component').then((m) => m.RideTrackerComponent),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
