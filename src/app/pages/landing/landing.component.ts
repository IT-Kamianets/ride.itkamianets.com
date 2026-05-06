import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CompanyService } from '../../feature/company/company.service';

@Component({
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
	protected readonly company = inject(CompanyService).company;
}
