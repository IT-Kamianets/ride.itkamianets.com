import { Injectable, signal } from '@angular/core';
import { COMPANY_FALLBACK, EMPTY_COMPANY } from './company.const';
import { Company } from './company.interface';

@Injectable({
	providedIn: 'root',
})
export class CompanyService {
	readonly company = signal<Company>(COMPANY_FALLBACK);
	readonly loading = signal(true);

	reset() {
		this.company.set(EMPTY_COMPANY);
		this.loading.set(true);
	}
}
