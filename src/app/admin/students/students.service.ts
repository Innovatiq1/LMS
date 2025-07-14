import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Students } from './students.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { environment } from 'environments/environment.development';
import { Student, UsersPaginationModel } from '@core/models/user.model';
import { ApiResponse } from '@core/models/general.response';
import { CoursePaginationModel } from '@core/models/course.model';
@Injectable()
export class StudentsService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/students.json';
  defaultUrl = environment['apiUrl'];
  isTblLoading = true;
  private configuration: any;
  dataChange: BehaviorSubject<Students[]> = new BehaviorSubject<Students[]>([]);
  private configurationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  public configuration$: Observable<any> =
    this.configurationSubject.asObservable();

  // Temporarily stores data from dialogs
  dialogData!: Students;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Students[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }

  private buildParams(filter?: Partial<UsersPaginationModel>): HttpParams {
    let params = new HttpParams();
    if (filter) {
      if (filter.sortBy) {
        params = params.set(
          'sortBy',
          `${filter.sortByDirection === 'asc' ? '+' : '-'}${filter.sortBy}`
        );
      }
      if (filter.limit) {
        params = params.set('limit', filter.limit?.toString());
      }
      if (filter.page) {
        params = params.set('page', filter.page?.toString());
      }

      if (filter.title) {
        params = params.set('title', filter.title?.toString());
      }
      if (filter.status && filter.status === 'active') {
        params = params.set('status', 'active');
      } else if (filter.status && filter.status === 'inactive') {
        params = params.set('status', 'inactive');
      }
    }
    return params;
  }

  // getStudent(filter?: Partial<UsersPaginationModel>): Observable<ApiResponse> {
  //   const apiUrl = `${this.defaultUrl}auth/instructorList/`;
  //   return this.http
  //     .post<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
  //     .pipe(
  //       map((response:any) => {
  //         return response.data;
  //         //this.isTblLoading = false;
  //       })
  //     );
  // }

  /** CRUD METHODS */
  // getAllStudentss(body:any): void {

  //   const apiUrl = `${this.defaultUrl}auth/instructorList/`;
  //   this.subs.sink = this.httpClient.post<Students>(apiUrl,body).subscribe({
  //     next: (response) => {
  //       this.isTblLoading = false;
  //       this.dataChange.next(response.data);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.isTblLoading = false;
  //       console.log(error.name + ' ' + error.message);
  //     },
  //   });
  // }

  getAllStudentss(
    filter?: Partial<UsersPaginationModel>,
    type?: string
  ): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = `${this.defaultUrl}auth/instructorList?companyId=${userId}&type=${type}`;

    return this.httpClient.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getStudent(data: any) {
    const apiUrl = `${this.defaultUrl}auth/instructorList`;
    return this.httpClient
      .post<Student>(apiUrl, data)
      .pipe(map((response) => response));
  }

  getStudentById(id: string): Observable<any> {
    const apiUrl = `${this.defaultUrl}auth/instructorListByID/${id}`;
    return this.httpClient.get<any>(apiUrl).pipe(
      map((response) => {
        const configuration = response.configuration;
        this.updateConfigurationState(configuration);
        return response;
      })
    );
  }

  private updateConfigurationState(configuration: any): void {
    this.configurationSubject.next(configuration);
  }
  // getStudent(body:any): Observable<Students> {
  //   const apiUrl = `${this.defaultUrl}auth/instructorList/`;
  //   return this.httpClient
  //     .post<Students>(apiUrl,body)
  //     .pipe(
  //       map((response:any) => {
  //         console.log("return",response)
  //         return response.data;
  //         //this.isTblLoading = false;

  //       })
  //     );
  // }

  addStudents(students: Students): void {
    this.dialogData = students;

    // this.httpClient.post(this.API_URL, students)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = students;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  updateStudents(students: Students): void {
    this.dialogData = students;

    this.httpClient.put(this.API_URL + students.id, students).subscribe({
      next: (data) => {
        this.dialogData = students;
      },
      error: (error: HttpErrorResponse) => {
        // error code here
      },
    });
  }
  deleteStudents(id: number): void {
    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }

  CreateStudent(user: Student): Observable<ApiResponse> {
    //const apiUrl = `${this.prefix}admin/course-kit/`;
    const loginUrl = this.defaultUrl + 'auth/instructorCreate';
    return this.httpClient.post<ApiResponse>(loginUrl, user);
  }
  uploadVideo(files: File): Observable<any> {
    const formData = new FormData();
    //for (let file of files) {
    formData.append('Files', files, files.name);
    //}
    const apiUrl = `${this.defaultUrl}admin/video/upload`;
    return this.httpClient.post(apiUrl, formData);
  }
  updateStudent(id: string, users: Student): Observable<ApiResponse> {
    const apiUrl = `${this.defaultUrl}auth/instructorUpdate/${id}`;
    return this.httpClient.put<ApiResponse>(apiUrl, users);
  }
  deleteUser(userId: string): Observable<ApiResponse> {
    const apiUrl = `${this.defaultUrl}auth/instructorDelete/${userId}`;
    return this.httpClient.delete<ApiResponse>(apiUrl);
  }

  confrim(userId: string, type?: string): Observable<ApiResponse> {
    let user = {
      isLogin: true,
      type: type,
    };
    const apiUrl = `${this.defaultUrl}auth/instructorConfirm/${userId}`;
    return this.httpClient.put<ApiResponse>(apiUrl, user);
  }
  deActiveconfrim(userId: string, type?: string): Observable<ApiResponse> {
    let user = {
      isLogin: false,
      type: type,
    };
    const apiUrl = `${this.defaultUrl}auth/instructorConfirm/${userId}`;
    return this.httpClient.put<ApiResponse>(apiUrl, user);
  }

  getAllDepartments(): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = `${this.defaultUrl}admin/department?companyId=${userId}`;
    return this.httpClient.get<ApiResponse>(apiUrl);
  }
  getDepartmentsForSuperAdmin(): Observable<ApiResponse> {
    const apiUrl = `${this.defaultUrl}admin/department`;
    return this.httpClient.get<ApiResponse>(apiUrl);
  }

  submitManualAssessmentAnswer(data: any): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    data.companyId = userId;
    const apiUrl = `${this.defaultUrl}admin/manualEvaluation`;

    return this.httpClient
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => response));
  }

  getManualAssessmentAnswerById(id: string): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/manualEvaluation/assessmentAnswer/${id}`;
    return this.httpClient.get<any>(apiUrl).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getManualExamAssessmentAnswerById(id: string): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/manualEvaluation/examAssessmentAnswer/${id}`;
    return this.httpClient.get<any>(apiUrl).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateManualAssessmentAnswerById(id: string, payload: any): Observable<ApiResponse> {
    const apiUrl = `${this.defaultUrl}admin/manualEvaluation/${id}`;
    return this.httpClient.put<ApiResponse>(apiUrl, payload);
  }

  submitAssessment(data: any): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    data.companyId = userId;
    const apiUrl = `${this.defaultUrl}admin/assesment-answers`;

    return this.httpClient
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => response));
  }
  submitTutorial(data: any): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    data.companyId = userId;
    const apiUrl = `${this.defaultUrl}admin/tutorial-answers`;

    return this.httpClient
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => response));
  }

  getAnswerById(id: string): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/assesment-answers/${id}`;
    return this.httpClient.get<any>(apiUrl).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateSubmittedAssessment(id: string, payload: any): Observable<ApiResponse> {
    const apiUrl = `${this.defaultUrl}admin/assesment-answers/update-submission/${id}`;
    return this.httpClient.put<ApiResponse>(apiUrl, payload);
  }
  

  getTutorialAnswerById(id: string): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/tutorial-answers/${id}`;
    return this.httpClient.get<any>(apiUrl).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getDepartmentById(companyId: string, department: string): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/courses-new/course/${companyId}/${department}`;
    return this.httpClient.get<any>(apiUrl).pipe(
      map((response) => {
        const configuration = response.configuration;
        this.updateConfigurationState(configuration);
        return response;
      })
    );
  }
  getManagerandStaffCount(
    companyId: string,
    department: string,
    headId: string
  ): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/user/${companyId}/${department}/${headId}`;
    return this.httpClient.get<any>(apiUrl).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getCourseStatus(companyId: string, department: string): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/studentClasses/${companyId}/${department}`;
    return this.httpClient.get<any>(apiUrl).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getStudentClassById(id: string): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/studentClasses/${id}`;
    return this.httpClient.get<any>(apiUrl).pipe(
      map((response) => {
        return response;
      })
    );
  }
}

// updateUser(
//   id: string,
//   users: Users
// ): Observable<ApiResponse> {
//   const apiUrl = `${this.prefix}auth/instructorUpdate/${id}`;
//   return this.httpClient.put<ApiResponse>(apiUrl, users);
// }
// deleteUser(userId: string): Observable<ApiResponse> {
//   const apiUrl = `${this.prefix}auth/instructorDelete/${userId}`;
//   return this.httpClient.delete<ApiResponse>(apiUrl);
// }
