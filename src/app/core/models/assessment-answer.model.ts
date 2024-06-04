import { Pagination } from "./pagination.model";

export interface AssessmentQuestionModel {
    _id: string;
    name: string;
    questions: AssessmentQuestion[];
    timer: number;
    collectionName: string;
    modifiedBy: string;
    status: 'approved' | 'open';
}

export interface AssessmentQuestion {
    questionText: string;
    options: AssessmentOption[];
}

export interface AssessmentOption {
    text: string;
    correct: boolean;
}

export interface AssessmentQuestionsPaginationModel extends Pagination {
    docs: AssessmentQuestionModel[];
    filterText: string;
    studentId: string;
    studentName: string;
    sortBy: string;
    sortByDirection: string;
}
