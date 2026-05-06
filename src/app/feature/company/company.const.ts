import companyJson from '../../../data/company.json';
import { Company } from './company.interface';

export const EMPTY_COMPANY: Company = {
	_id: '',
	name: '',
	title: '',
	description: '',
	image: '',
};

export const COMPANY_FALLBACK: Company = companyJson;
