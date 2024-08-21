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

