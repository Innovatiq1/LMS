import { Pagination } from "./pagination.model";

export interface CourseKit {
  companyId: string | null;
  adminId:string | null;
	_id: string;
	name: string;
	docs: CourseKit[];
	shortDescription: string;
	longDescription: string;
	videoLink:string[];
	documentLink: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface MainCategory {
	subCategories: any;
	_id: string;
	category_name: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;

}
export interface SubCategory {
	_id: string;
	main_category_id: string;
	category_name: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface CourseUploadData {
	title?: string;
   courseCode?: string;
   main_category?: string;
   sub_category?: string;
   course_duration_in_days?: number;
   training_hours?: number;
   fee?: number;
   currency_code: number;
   skill_connect_code?: string;
   course_description?: string;
   vendor?: string;
   course_detailed_description?: string;
   pdu_technical?: number;
   pdu_leadership?: number;
   pdu_strategic?: number;
   funding_grant?: string[];
//    survey?: string[];
   course_instructor?: string[];
   course_kit?: string[];
   assessment?: string[];
   exam_assessment?: string[];
   survey?: string[];
 }
 export interface MainCategory {
    subCategories: any;
    _id: string;
    category_name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}
export interface CourseModel {
  category_name: string ;
	status: string;
	slug: string;
	_id: string;
	title: string;
	courseCode: string;
	course_duration_in_days: number;
	training_hours: number;
	skill_connect_code: string;
	fee: number;
	currency_code: number;
	main_category: string;
	//   main_category_id: string;
	sub_category: string;
	mainCategory:string;
	main_category_text: string|undefined;
	sub_category_text: string|undefined;
	pdu_technical: number;
	pdu_leadership: number;
	pdu_strategic: number;
	website_link: string;
	image_link: string;
	funding_grant: string;
	survey: string;
	course_kit: CourseKit;
	certificates: number;
	course_description: string;
	course_detailed_description: string;
	banner_image_link: string;
	course_instructor: string;
	vendor: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface ProgramKit {
	_id: string;
	name: string;
	docs: ProgramKit[];
	shortDescription: string;
	longDescription: string;
	videoLink:string[];
	documentLink: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface FundingGrant {
	_id: string;
	grant_type: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}


export interface Vendor {
	_id: string;
	vendor: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface Discount {
	_id: string;
	discountTitle: string;
	discountType: string;
	value: number;
	description:string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface Assessment {
	_id: string;
	docs: Assessment[];
	name: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}

export interface ExamAssessment {
	_id: string;
	docs: ExamAssessment[];
	name: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}


export interface Feedback {
	_id: string;
	docs: Feedback[];
	name: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface Survey {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface Instructor {
	_id: string;
	user_id: User_id;
	linkedin: string;
	about: string;
	experience: string;
	website: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface User_id {
	gender: string;
	slug: string;
	active: boolean;
	password_Activation: string;
	type: string;
	user_roles: any[];
	attemptCalculation: number;
	attemptBlock: boolean;
	passwordChange: boolean;
	forgetPasswordChange: boolean;
	followcount: number;
	_id: string;
	last_name: string;
	email: string;
	password: string;
	phone_number: any[];
	studentType: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	reset_password_expires: string;
	reset_password_token: string;
	city: number;
	country: number;
	state: number;
	avatar: string;
	bannerImage: string;
	mentorFollow: any[];
	qualification: string;
	// allbannerImage: AllbannerImage[];
	// student_profile: Student_profile;
	name: string;
	status: number;
	// profile_completion: Profile_completion;
	id: string;
}
export interface CourseKit {
	companyId: string | null;
	adminId:string | null;
	_id: string;
	name: string;
	docs: CourseKit[];
	shortDescription: string;
	longDescription: string;
	videoLink:string[];
	documentLink: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
export interface Certificate {
	course: string;
	createdAt: string;
	id: string;
	image:string;
	isDeleted:boolean;
	name:string;
	passStatus: string;
	title: string;
	updatedAt: string;
	_id: string;
}
export interface CoursePaginationModel extends Pagination {
	docs: CourseModel[];
	main_category: string|undefined;
	sub_category: string|undefined;
	filterText: string;
	filterProgram: string;
	filterRegisteredCourse: string;
	filterApprovedCourse: string;
	filterCompletedCourse: string;
	sortBy: string;
	sortByDirection: string;
	status: string;
	studentId: any;
	department:string;
	feeType:string;
  	userGroupId:string;
  	isAll:boolean;
	filterName: string;
	adminId:string;
	companyId:string;
	role:string;
}

export interface ProgramCourse {
	courseId: any;
	courseType: string;
}
export interface Program {
	_id: string;
	title?: string;
	shortDescription: string;
	description: string;
	status:string;
	coreCourseCount: number;
	electiveCourseCount: number;
	programCourse: ProgramCourse[];
	image_link:string;
	createdAt?: Date;
	updatedAt?: Date;
	courseCode: string;
	coreprogramCourse:string;
	electiveprogramCourse:string;
	courseFee: string;
	deliveryMode: string;
	duration: string;
	compulsaryCourse: string;
	electiveCourse: string;
}

export interface DepartmentModel {
  description: any;
	category_name: string ;
	  status: string;
	  slug: string;
	  _id: string;
	  department: string;
	  hod: string;
	  mobile: number;
	  email: string;
	  departmentStartDate: any;
	  studentCapacity: string;
	  //   main_category_id: string;
	  details: string;
	  createdAt: string;
	  updatedAt: string;
	  __v: number;
	  id: string;
  }
  export interface LeaveModel {
	category_name: string ;
	  status: string;
	  slug: string;
	  _id: string;
	  instructorId: string;
	  studentId: string;
	  classId: number;
	  className: string;
	  applyDate: Date;
	  fromDate: Date;
	  //   main_category_id: string;
	  toDate: Date;
	  reason:string;
	  createdAt: string;
	  updatedAt: string;
	  __v: number;
	  id: string;
  }

  export interface CourseKitModel extends Pagination {
	   status: string;
	  
	  data: CourseKit[];
	  totalCount: number;
	  filterText: string;
	  limit: number;
	  sortBy: string;
	  sortByDirection: string
  }
