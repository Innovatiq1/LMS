export interface SurveyBuilderQuestionsModel {
	_id: string;
	choices: [string];
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export class SurveyBuilderModel {

	_id: string;
	title: string;
  courseName!:string;
  studentFirstName!:string;
	questions: SurveyBuilderQuestionsModel[];
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
  docs:any;
  data:any

  constructor(classModel: SurveyBuilderModel) {
    {
      this._id = classModel._id || '';
      this.title = classModel.title || '';
      this.questions = classModel.questions;
      this.createdAt = classModel.createdAt || '';
      this.updatedAt = classModel.updatedAt || '';
      this.__v = classModel.__v ;
      this.id = classModel.id || '';
       this.docs = classModel.docs || [];
       this.data = classModel.data || [];

    }
  }
}