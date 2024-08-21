import { Pagination } from './pagination.model';


export interface CertificateBuilderModel {

	_id: string;
	title: string;
	name: string;
	course: string;
	passStatus: string;
	image: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface CertificateBuilderQuestionsModel {
	_id: string;
	choices: [string];
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}


export interface CertificateBuilderPaginationModel extends Pagination {
	docs: CertificateBuilderModel[];
	filterText: string;
	sortBy: string;
	sortByDirection: string;
}
