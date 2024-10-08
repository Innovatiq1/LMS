/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { CourseModel } from '@core/models/course.model';
import { Pagination } from '@core/models/pagination.model';

export interface SessionClassModel {
  _id: string;
  sessionNumber: string;
  sessionStartDate: string;
  sessionEndDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  instructorId: string;
  students: StudentRegisteredClass[];
}
export class ClassModel {
  name: string;
  status: string;
  _id: string;
  courseId: any;
  courseName: string;
  classAccessType: string;
  classDeliveryType: string;
  instructorCost: string;
  instructorCostCurrency: string;
  isGuaranteedToRun: boolean;
  externalRoom: boolean;
  minimumEnrollment: string;
  maximumEnrollment: string;
  classStartDate: string;
  classEndDate: string;
  sessions: SessionClassModel[];
  docs: any;
  data:any;
  id: number | undefined;
  title:string

  constructor(classModel: ClassModel) {
    {
      this._id = classModel._id || '';
      this.name = classModel.name || '';
      this.courseId = classModel.courseId;
      this.status = classModel.status || '';
      this.courseName = classModel.courseName || '';
      this.classAccessType = classModel.classAccessType || '';
      this.classDeliveryType = classModel.classDeliveryType || '';
      this.instructorCost = classModel.instructorCost || '';
      this.instructorCostCurrency = classModel.instructorCostCurrency || '';
      this.isGuaranteedToRun = classModel.isGuaranteedToRun || false;
      this.externalRoom = classModel.externalRoom || false;
      this.minimumEnrollment = classModel.minimumEnrollment || '';
      this.maximumEnrollment = classModel.maximumEnrollment || '';
      this.classStartDate = classModel.classStartDate || '';
      this.classEndDate = classModel.classEndDate || '';
      this.sessions = classModel.sessions || '';
      this.docs = classModel.docs;
      this.data = classModel.data;
      this.title = classModel.title
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
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

export interface StudentPaginationModel extends Pagination {
  docs: Student[];
  filterText: string;
  userGroupId:string;
}

export interface Student extends Pagination {
  __v: number;
  _id: string;
  classId: ClassModel;
  courseId: CourseModel;
  createdAt: string;
  id: string;
  registeredOn: string;
  session: any[];
  status: string;
  studentId: StudentId;
  updatedAt: string;
  classStartDate: string;
  classEndDate: string;
}

export interface Session {
  sessionNumber: number;
  sessionStatus: string;
}

export interface StudentApproval {
  studentId: string;
  classId: String;
  status: string;
  approvedOn: string;
  approvedBy: string;
  session: Session[];
}

export interface Session {
  _id: string;
  instructorId: string;
  laboratoryId: string;
  sessionEndDate: string;
  sessionEndTime: string;
  sessionNumber: number;
  sessionStartDate: string;
  sessionStartTime: string;
}

export interface ClassListingModel extends Pagination {
  data: any;
  docs: ClassModel[];
  totalDocs: number;
  limit: number;
  sortBy: string;
  sortByDirection: string;
}

export interface DataSourceModel {
  start: string;
  end: string;
  instructor: string;
  // lab: string;
}

export interface CourseTitleModel extends Pagination {
  _id: string;
  id: string;
  title: string;
}
export interface InstructorList {
  user_id: InstructorDetail[];
  instructor_id: string;
}

export interface InstructorDetail {
  name: string;
  last_name: string;
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

// export interface StudentApproval {
//   studentId: string;
//   classId: string;
//   status: string;
//   approvedOn: string;
//   approvedBy: string;
//   session: Session[];
// }
