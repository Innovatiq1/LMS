import { CourseModel, Program } from "./course.model";
import { Pagination } from "./pagination.model";

export interface InstructorList {
  user_id: InstructorDetail[];
  instructor_id: any;
}
export interface InstructorDetail {
  name: String;
  last_name: String;
}

export interface LabDetail {
  name: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface LabListModel {
  docs: LabDetail[];
}

export interface CourseTitleModel extends Pagination {
  _id: string;
  id: string;
  title: string;
  
}

export interface CourseListModel extends Pagination {
  docs: CourseTitleModel[];
}

export interface ClassListingModel extends Pagination {
  data: any;
  docs: ClassModel[];
  totalDocs: number;
  limit: number;
  sortBy: string;
  sortByDirection: string;
}
export interface SessionClassModel {
  _id: string;
  sessionNumber: string;
  sessionStartDate: string;
  sessionEndDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  instructorId: any;
  students: StudentRegisteredClass[];
}
export interface ClassModel {
  status: String;
  _id: String;
  courseId: any;
  courseName: String;
  classAccessType: String;
  classDeliveryType: String;
  instructorCost: String;
  instructorCostCurrency: String;
  isGuaranteedToRun : boolean;
  externalRoom:boolean;
  minimumEnrollment: String;
  maximumEnrollment: String;
  classStartDate: String;
  classEndDate: String;
  sessions: SessionClassModel[];
}

export interface CourseTitleModel extends Pagination {
  _id: string;
  id: string;
  title: string;
}

export interface CourseListModel extends Pagination {
  docs: CourseTitleModel[];
}

export interface ClassListingModel extends Pagination {
  docs: ClassModel[];
  totalDocs: number;
  limit: number;
  sortBy: string;
  sortByDirection: string;
}

export interface ClassModel {
  status: String;
  _id: String;
  courseId: any;
  courseName: String;
  classAccessType: String;
  classDeliveryType: String;
  instructorCost: String;
  instructorCostCurrency: String;
  isGuaranteedToRun : boolean
  externalRoom:boolean;
  minimumEnrollment: String;
  maximumEnrollment: String;
  classStartDate: String;
  classEndDate: String;
  sessions: SessionClassModel[];
}

export interface CourseTitleModel extends Pagination {
  _id: string;
  id: string;
  title: string;
}

export interface CourseListModel extends Pagination {
  docs: CourseTitleModel[];
}

export interface DataSourceModel {
  start: string;
  end: string;
  instructor: any;
  lab: string;
  sessionStartDate:string;
}
export interface SessionModel {
  sessionNumber: number;
  sessionStartDate: string;
  sessionEndDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  instructorId: any;
  laboratoryId: string;
  courseName:string;
  courseCode:string;
  status:string;
  duration:string

}

export interface CourseId {
  __v: number;
  _id: string;
  banner_image_link: string;
  certificates: number;
  course_description: string;
  course_detailed_description:string;
  course_duration_in_days: number;
  course_instructor: string;
  course_kit: string[];
  courseCode: string;
  createdAt: string;
  currency_code: number;
  exam: string;
  fee: number;
  funding_grant: string;
  id: string;
  image_link: string;
  main_category: string;
  pdu_leadership: number;
  pdu_strategic: number;
  pdu_technical: number;
  skill_connect_code: string;
  slug: string;
  status: string;
  sub_category: string;
  survey: string;
  title: string;
  training_hours: number;
  updatedAt: string;
  website_link: string;
}

export interface Session {
  _id: string;
  instructorId: any;
  laboratoryId: string;
  sessionEndDate: string;
  sessionEndTime: string;
  sessionNumber: number;
  sessionStartDate: string;
  sessionStartTime: string;
}

export interface ClassId {
  __v: number;
  _id: string;
  classAccessType: string;
  classDeliveryType: string;
  courseId: CourseModel;
  createdAt: string;
  id: string;
  instructorCost: number;
  instructorCostCurrency: string;
  isGuaranteedToRun : boolean;
  externalRoom:boolean;
  maximumEnrollment: number;
  minimumEnrollment: number;
  sessions: Session[];
  status: string;
  updatedAt: string;
}

export interface Student extends Pagination {
  __v: number;
  _id: string;
  classId: ClassModel;
  courseId: CourseModel;
  programId: Program;
  createdAt: string;
  id: string;
  registeredOn: string;
  session: any[];
  status: string;
  studentId: StudenId;
  updatedAt: string;
  classStartDate: string;
  classEndDate: string;
  programTitle: string;
}

export interface StudenId {
  _id: string;
  name: string;
  email: string;
  last_name: string;
  id: string;
}

export interface StudentPaginationModel extends Pagination {
  students: any;
  docs: Student[];
  filterText: string;
}

export interface Session {
  sessionNumber: number;
  sessionStatus:string;
}

export interface StudentApproval {
  studentId: string;
  classId: String;
  status: string;
  courseId?: string;
  approvedOn: string;
  approvedBy: string;
  session: Session[];
}

export interface StudentId {
	_id: string;
	name: string;
	last_name: string;
	email: string;
	id: string;
}

export interface StudentRegisteredClass {
	status: string;
	_id: string;
	studentId: StudentId;
	classId: string;
	courseId: string;
	registeredOn: string;
	session: any[];
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface AttendancaModel{
  students: StudentRegisteredClass[];
  classObj : ClassModel;
}