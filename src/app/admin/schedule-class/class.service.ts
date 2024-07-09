/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { ApiResponse } from "@core/models/response";
import { environment } from "environments/environment";
import { CoursePaginationModel } from "@core/models/course.model";
import { BehaviorSubject, Observable, map } from "rxjs";
import { ClassListingModel, ClassModel, CourseTitleModel, InstructorList, LabListModel, StudentApproval } from "./class.model";
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ApiResponse } from "@core/models/response";

@Injectable({
  providedIn: 'root'
})
export class ClassService extends UnsubscribeOnDestroyAdapter {
  private prefix: string = environment["apiUrl"];
  isTblLoading = true;
  dataChange: BehaviorSubject<ClassModel[]> = new BehaviorSubject<ClassModel[]>([]);

  constructor(private http: HttpClient) {
    super();
  }
  get data(): ClassModel[] {
    return this.dataChange.value;
  }
  private buildParams(filter?: Partial<CoursePaginationModel>): HttpParams {
    let params = new HttpParams();
    if (filter) {
      if (filter.sortBy)
        params = params.set("sortBy", `${filter.sortByDirection == "asc" ? "+" : "-"}${filter.sortBy}`);
      if (filter.limit) params = params.set("limit", filter.limit?.toString());
      if (filter.page) params = params.set("page", filter.page?.toString());
      if (filter.filterText) params = params.set("courseName", filter.filterText?.toString());
      if (filter.filterProgram) params = params.set("programName", filter.filterProgram?.toString());
      if (filter.filterRegisteredCourse) params = params.set("title", filter.filterRegisteredCourse?.toString());
      if (filter.filterApprovedCourse) params = params.set("title", filter.filterApprovedCourse?.toString());
      if (filter.filterCompletedCourse) params = params.set("title", filter.filterCompletedCourse?.toString());
      if (filter.studentId) params = params.set("studentId", filter.studentId);
      if (filter.status) params = params.set("status", filter.status);
      if (filter.department) params = params.set("department", filter.department);
      if (filter.userGroupId) params = params.set("userGroupId", filter.userGroupId);
      if (filter.isAll) params = params.set("isAll", filter.isAll);
      if (filter.role) params = params.set("role", filter.role);
      if (filter.datefilter) params = params.set("datefilter", filter.datefilter);
      if (filter.rescheduledDate) params = params.set("rescheduledDate", filter.rescheduledDate);

    }
    return params;
  }


  private buildRegisteredClassesParams(page: number, limit: number, filterText?: string): HttpParams {
    let params = new HttpParams();

    page = page ?? 1;
    limit = limit ?? 10;

    params = params.set("limit", limit.toString());
    params = params.set("page", page.toString());
    // params = params.set("status", "registered,withdraw");
    if (filterText) {
      params = params.set("title", filterText);
    }

    return params;
  }
  getStudentRegisteredProgramClasses(data:any) {
    return this.http.get(`${this.prefix}admin/studentClasses/studentApproveList`,{ params: this.buildParams(data) }).pipe(
      map((response:any) => {
        return response;
      })
    );
  }
  getClassesByCourseId(courseId: string): Observable<any> {
    const apiUrl = `${this.prefix}admin/class/class/${courseId}`;
    return this.http.get<any>(apiUrl);
  }

  getRegisteredClasses(id:any,page: number, limit: number, filterText? : string): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses?companyId=${id}&status=registered&verify=true&paid=true`;
    return this.http.get<any>(apiUrl, { params: this.buildRegisteredClassesParams(page, limit, filterText) });
  }
  getPendingVerificationList(id:any,page: number, limit: number, filterText? : string): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses?status=registered&verify=false&companyId=${id}`;
    return this.http.get<any>(apiUrl, { params: this.buildRegisteredClassesParams(page, limit, filterText) });
  }

  getApprovedClasses(id:any,page: number, limit: number, filterText? : string): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses?status=approved&companyId=${id}`;
    return this.http.get<any>(apiUrl, { params: this.buildRegisteredClassesParams(page, limit, filterText) });
  }
  getAttendedStudents(body:any): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses?status=approved&course=${body.course}`;
    return this.http.get<any>(apiUrl);
  }

  getProgramAttendedStudents(body:any): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses?status=approved&program=${body.program}`;
    return this.http.get<any>(apiUrl);
  }


  getStudentRegisteredClasses(data:any) {
    return this.http.get(`${this.prefix}admin/studentClasses/`,{ params: this.buildParams(data) }).pipe(
      map((response:any) => {
        return response;
      })
    );
  }

  saveApprovedClasses(id: any, item: any): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/studentClasses/${id}`;
    return this.http.put<ApiResponse>(apiUrl, item);
  }
    saveApprovedProgramClasses(id: string, item: any): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/studentClasses/studentApproveList/${id}`;
    return this.http.put<ApiResponse>(apiUrl, item);
  }
  completedProgramClasses(id: string, item: StudentApproval): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/studentClasses/students/Fellowship/completed`;
    return this.http.put<ApiResponse>(apiUrl, item);
  }
  getClassList(filter?:any): Observable<ClassListingModel> {
    const apiUrl = `${this.prefix}admin/class/`;
    return this.http.get<ApiResponse>(apiUrl, { params: this.buildParams(filter) }).pipe(
      map((response:any) => {
        return response.data;
      })
    );
  }
  getClassById(id: string) {
    const apiUrl = `${this.prefix}admin/class/${id}`;
    return this.http.get<any>(apiUrl).pipe(map((response) => response.data));
  }
  //delete
  deleteClass(id: any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.apiUrl}admin/class/${id}`).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
  //update
  updateClass(id: string, formData: any): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/class/${id}`;
    return this.http.put<ApiResponse>(apiUrl, formData).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
//getAllTitle
getAllCoursesTitle(status: string): Observable<CourseTitleModel[]> {
  let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = `${this.prefix}admin/courses-new/title?status=${status}&companyId=${userId}`;
  return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response.data));
}
getAllCourses(): Observable<CourseTitleModel[]> {
  const apiUrl = `${this.prefix}admin/courses-new/title`;
  return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response.data));
}

getAllProgramesTitle(status: string): Observable<CourseTitleModel[]> {
  const apiUrl = `${this.prefix}admin/courses-new/programes?status=${status}`;
  return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response.data));
}

// getAllInstructor
getAllInstructor(): Observable<InstructorList[]> {
  const apiUrl = `${this.prefix}admin/auth/instructorList`;
  return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response.data));
}
getInstructor(body:any): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}auth/instructorList/`;
  return this.http
    .post<ApiResponse>(apiUrl,body)
    .pipe(
      map((response:any) => {
        return response.data;
      })
    );
}
//getAllLab
getAllLaboratory(): Observable<LabListModel[]> {
  const apiUrl = `${this.prefix}admin/laboratory`;
  return this.http
    .get<ApiResponse>(apiUrl, { params: this.buildParams() })
    .pipe(map((response) => response.data?.docs));
}
validateLaboratory(
  id?: string,
  startdate?: string,
  enddate?: string,
  starttime?: string,
  endtime?: string
): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/class/lab/${id}/check-available?sessionStartDate=${startdate}&sessionStartTime=${starttime}&sessionEndDate=${enddate}&sessionEndTime=${endtime}`;
  return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
}

validateInstructor(
  id?: string,
  startdate?: string,
  enddate?: string,
  starttime?: string,
  endtime?: string
): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/class/instructor/${id}/check-available?sessionStartDate=${startdate}&sessionStartTime=${starttime}&sessionEndDate=${enddate}&sessionEndTime=${endtime}`;
  return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
}
saveClass(formData: any): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/class/`;
  return this.http.post<ApiResponse>(apiUrl, formData).pipe(
    map((response) => {
      return response.data;
    })
  );
}


getSessionCompletedStudent(id:any,page: number, limit: number): Observable<any> {
  const apiUrl = `${this.prefix}admin/studentClasses/students/completed?companyId=${id}`;
  return this.http.get<any>(apiUrl, { params: this.buildRegisteredClassesParams(page, limit) });
}
getProgramCompletedStudent(page: number, limit: number,id?:any): Observable<any> {
  const apiUrl = `${this.prefix}admin/studentClasses/students/Fellowship/completed?companyId=${id}`;
  return this.http.get<any>(apiUrl, { params: this.buildRegisteredClassesParams(page, limit) });
}

getProgramRegisteredClasses(page: number, limit: number, filterText? : string,id?:any): Observable<any> {
  const apiUrl = `${this.prefix}admin/studentClasses/studentApproveList?status=registered&companyId=${id}`;
  return this.http.get<any>(apiUrl, { params: this.buildRegisteredClassesParams(page, limit, filterText) });
}
getApprovedProgramClasses(page: number, limit: number,id:any, filterText? : string): Observable<any> {
  const apiUrl = `${this.prefix}admin/studentClasses/studentApproveList?status=approved&companyId=${id}`;
  return this.http.get<any>(apiUrl, { params: this.buildRegisteredClassesParams(page, limit, filterText) });
}
getStudentsApprovedClasses(): Observable<any> {
  const apiUrl = `${this.prefix}admin/studentClasses/studentApproveList`;
  let params = new HttpParams();
  let query = params.set("status", "approved");
  return this.http.get<any>(apiUrl, { params: query});
}

getClassListWithPagination(
  filter?:Partial<CoursePaginationModel>,id?:any): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/class?companyId=${id}`;
  return this.http.get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
}


getProgramClassListWithPagination(id:any,
  filter?:Partial<CoursePaginationModel>): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/program-class?companyId=${id}`;
  return this.http.get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
}

getProgramClassList(filter?:any,id?:any): Observable<ClassListingModel> {
  const apiUrl = `${this.prefix}admin/program-class?companyId=${id}`;
  return this.http.get<ApiResponse>(apiUrl, { params: this.buildParams(filter) }).pipe(
    map((response:any) => {
      return response.data;
    })
  );
}

getProgramClassById(id: string) {
  const apiUrl = `${this.prefix}admin/program-class/${id}`;
  return this.http.get<any>(apiUrl).pipe(map((response) => response.data));
}
saveProgramClass(formData: any): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/program-class/`;
  return this.http.post<ApiResponse>(apiUrl, formData).pipe(
    map((response) => {
      return response.data;
    })
  );
}
updateProgramClass(id: string, formData: any): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/program-class/${id}`;
  return this.http.put<ApiResponse>(apiUrl, formData).pipe(
    map((response) => {
      return response.data;
    })
  );
}
uploadFileApi(file:any) {
  let formData = new FormData();
formData.append('Files', file);
const apiUrl = `${this.prefix}admin/video/upload`;
return this.http.post<ApiResponse>(apiUrl, formData);


}
updateCertificateUser(data:any){
const apiUrl = `${this.prefix}admin/studentClasses/student/certificate`;
return this.http.put<ApiResponse>(apiUrl, data);
}

updateProgramCertificateUser(data:any){
  const apiUrl = `${this.prefix}admin/studentClasses/program/certificate`;
  return this.http.put<ApiResponse>(apiUrl, data);
}

}



