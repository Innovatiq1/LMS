import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ApiResponse } from '@core/models/response';
import { environment } from 'environments/environment';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = 'http://localhost:3000/api/';
  private prefix: string = environment.apiUrl;
  defaultUrl = environment['apiUrl'];
  publicUrl = environment['publicApiUrl'];

  dataChange: BehaviorSubject<CourseModel[]> = new BehaviorSubject<
    CourseModel[]
  >([]);

  constructor(private _Http: HttpClient) {}
  private buildParams(filter?: Partial<CoursePaginationModel>): HttpParams {
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
        params = params.set("title", filter.title?.toString());
      }

      if (filter.companyId) {
        params = params.set('companyId', filter.companyId);
      }
    }
    return params;
  }

  saveRetakeRequest(data: any) {
    const apiUrl = `${this.prefix}admin/retakeRequest`;
    return this._Http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => response));
  }


  getRetakeRequest(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    // console.log("retakeRequest",filter)

    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = `${this.defaultUrl}admin/retakeRequest?companyId=${userId}`;
  
    return this._Http.get<ApiResponse>(apiUrl,{params:this.buildParams(filter)});
  }
  
  putRetakeRequestByStudentIdCourseId(studentId:any,courseId:any,data: any){
    const apiUrl = `${this.prefix}admin/retakeRequest/update?studentId=${studentId}&courseId=${courseId}&`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));

  }

  getRetakeRequestByStudentIdAndCourseId(studentId:any,courseId:any){
    const apiUrl = `${this.prefix}admin/retakeRequest/search?studentId=${studentId}&courseId=${courseId}`;
    return this._Http.get<ApiResponse>(apiUrl);
  }

  saveNotifications(data: any) {
    const apiUrl = `${this.prefix}admin/notifications`;
    return this._Http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }
  getNotifications(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    // console.log('companyId',filter)
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = this.defaultUrl + `admin/notifications?companyId=${userId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }
  saveAttendance(data: any) {
    const apiUrl = `${this.prefix}admin/attendance`;
    return this._Http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }
  getAllAttendance(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    // console.log('getAttandance',data)
    const apiUrl = this.defaultUrl + 'admin/attendance';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }
  getAttendanceByCourseId(id: string) {
    const apiUrl = `${this.prefix}admin/attendance/course/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  saveSmtp(smtp: any) {
    const apiUrl = `${this.prefix}admin/smtp`;
    return this._Http
      .post<ApiResponse>(apiUrl, smtp)
      .pipe(map((response) => {}));
  }

  getSmtp(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    // console.log('companyId',filter)
    const apiUrl = this.defaultUrl + 'admin/smtp';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getSmtpById(id: string) {
    const apiUrl = `${this.prefix}admin/smtp/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  
  updateSmtp(id: string, data: any) {
    const apiUrl = `${this.prefix}admin/smtp`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }
  saveTimeAlgorithm(time: any) {
    const apiUrl = `${this.prefix}admin/time`;
    return this._Http
      .post<ApiResponse>(apiUrl, time)
      .pipe(map((response) => {}));
  }

  getTimeAlgorithm(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    //let userId = localStorage.getItem('id');
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = this.defaultUrl + `admin/time?companyId=${userId}`;
   // const apiUrl = this.defaultUrl + 'admin/passingCriteria';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getTimeAlgorithmById(id: string) {
    const apiUrl = `${this.prefix}admin/time/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  updateTimeAlgorithm(id: string, data: any) {
    const apiUrl = `${this.prefix}admin/time/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }
  deleteTimeAlgorithm(id: string) {
    const apiUrl = `${this.prefix}admin/time/${id}`;
    return this._Http
      .delete<CourseModel>(apiUrl)
      .pipe(map((response) => response));
  }
  saveFileSizeAlgorithm(data: any) {
    const apiUrl = `${this.prefix}admin/fileSize`;
    return this._Http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }
  getFileSizeAlgorithm(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    //let userId = localStorage.getItem('id');
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = this.defaultUrl + `admin/fileSize?companyId=${userId}`;
   // const apiUrl = this.defaultUrl + 'admin/passingCriteria';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }
  getFileSizeAlgorithmById(id: string) {
    const apiUrl = `${this.prefix}admin/fileSize/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  updateFileSizeAlgorithm(id: string, data: any) {
    // console.log("id",id,"data",data)
    const apiUrl = `${this.prefix}admin/fileSize/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }
  deleteFileSizeAlgorithm(id: string) {
    const apiUrl = `${this.prefix}admin/fileSize/${id}`;
    return this._Http
      .delete<CourseModel>(apiUrl)
      .pipe(map((response) => response));
  }
  saveScoreAlgorithm(score: any) {
    const apiUrl = `${this.prefix}admin/score`;
    return this._Http
      .post<ApiResponse>(apiUrl, score)
      .pipe(map((response) => {}));
  }
  getScoreAlgorithm(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    //let userId = localStorage.getItem('id');
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = this.defaultUrl + `admin/score?companyId=${userId}`;
   // const apiUrl = this.defaultUrl + 'admin/passingCriteria';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getScoreAlgorithmById(id: string) {
    const apiUrl = `${this.prefix}admin/score/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  updateScoreAlgorithm(id: string, data: any) {
    const apiUrl = `${this.prefix}admin/score/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }
  deleteScoreAlgorithm(id: string) {
    const apiUrl = `${this.prefix}admin/score/${id}`;
    return this._Http
      .delete<CourseModel>(apiUrl)
      .pipe(map((response) => response));
  }

  savePassingCriteriya(passingCriteria: any) {
    const apiUrl = `${this.prefix}admin/passingCriteria`;
    return this._Http
      .post<ApiResponse>(apiUrl, passingCriteria)
      .pipe(map((response) => {}));
  }
  getPassingCriteria(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    //let userId = localStorage.getItem('id');
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = this.defaultUrl + `admin/passingCriteria?companyId=${userId}`;
   // const apiUrl = this.defaultUrl + 'admin/passingCriteria';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }
  getPassingCriteriaById(id: string) {
    const apiUrl = `${this.prefix}admin/passingCriteria/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  updatePassingCriteria(id: string, data: any) {
    const apiUrl = `${this.prefix}admin/passingCriteria/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }
  deletePassingCriteria(id: string) {
    const apiUrl = `${this.prefix}admin/passingCriteria/${id}`;
    return this._Http
      .delete<CourseModel>(apiUrl)
      .pipe(map((response) => response));
  }

  
  saveStudentDashboard(data: any) {
    const apiUrl = `${this.prefix}admin/dashboard`;
    return this._Http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }

  getStudentDashboard(id?:any,filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    let apiUrl
    if(id){
    apiUrl = `${this.prefix}admin/dashboard?companyId=${id}`;
    } else {
      apiUrl = `${this.prefix}admin/dashboard`;

    }
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getStudentDashboardById(id: string) {
    const apiUrl = `${this.prefix}admin/dashboard/${id}`;
    return this._Http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }
  
  updateStudentDashboard(data: any) {
    const apiUrl = `${this.prefix}admin/dashboard/${data.id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {response}));
  }

  saveApprovalFlow(data: any) {
    const apiUrl = `${this.prefix}admin/approvalFlow`;
    return this._Http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {response}));
  }

  getApprovalFlow(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl + 'admin/approvalFlow';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getApprovalFlowById(id: string) {
    const apiUrl = `${this.prefix}admin/approvalFlow/${id}`;
    return this._Http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }
  
  updateApprovalFlow(data: any) {
    const apiUrl = `${this.prefix}admin/approvalFlow/${data.id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {response}));
  }
  deleteApprovalFlow(id: string) {
    const apiUrl = `${this.prefix}admin/approvalFlow/${id}`;
    return this._Http
      .delete<CourseModel>(apiUrl)
      .pipe(map((response) => response));
  }
  savePayment(data: any) {
    const apiUrl = `${this.prefix}admin/payment`;
    return this._Http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {response}));
  }

  getPayment(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl + 'admin/payment';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getPaymentById(id: string) {
    const apiUrl = `${this.prefix}admin/payment/${id}`;
    return this._Http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }
  
  updatePayment(id: string, data: any) {
    const apiUrl = `${this.prefix}admin/payment/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {response}));
  }
  deletePayment(id: string) {
    const apiUrl = `${this.prefix}admin/payment/${id}`;
    return this._Http
      .delete<CourseModel>(apiUrl)
      .pipe(map((response) => response));
  }

  saveTwoFA(twoFA: any) {
    const apiUrl = `${this.prefix}admin/twoFA`;
    return this._Http
      .post<ApiResponse>(apiUrl, twoFA)
      .pipe(map((response) => {}));
  }


  getTwoFAById(id: string) {
    const apiUrl = `${this.prefix}admin/twoFA/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }

  
  getKeysByCompanyId(companyId: string): Observable<ApiResponse> {
    const apiUrl = `${this.publicUrl}getKeys?companyId=${companyId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
    });
  }

  getZoomKeysByCompanyId(companyId: string): Observable<ApiResponse> {
    const apiUrl = `${this.publicUrl}getZoomKeys?companyId=${companyId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
    });
  }

  getTeamsKeysByCompanyId(companyId: string): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/teams/getkeys?companyId=${companyId}`;
    return this._Http.get<ApiResponse>(apiUrl);
  }
  saveKey(data: any) {
    const apiUrl = `${this.prefix}admin/social-keys`;
    return this._Http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
  }
  updateKey(data: any) {
    const apiUrl = `${this.prefix}admin/social-keys`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {response}));
  }

  updateZoomKey(data: any) {
    const apiUrl = `${this.prefix}admin/zoom-keys`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {response}));
  }

  
 createTeamsKey(data: any) {
    const apiUrl = `${this.prefix}admin/teams/storeCredentials`;
    return this._Http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {response}));
  }
  createZoomKey(data:any) {
    const apiUrl = `${this.prefix}admin/zoom-keys`;
    return this._Http
    .post<ApiResponse>(apiUrl, data)
    .pipe(map((response)=>{response}));
  }

  getLatestZoomKey() {
    const apiUrl = `${this.prefix}admin/zoom-keys`;
    return this._Http
    .get<ApiResponse>(apiUrl)
    .pipe(map((response)=>{response}));
  }

  cloneZoneKey(data:any) {
    const apiUrl = `${this.prefix}admin/zoom-keys/clone`;
    return this._Http
    .post<ApiResponse>(apiUrl, data)
    .pipe(map((response)=>{response}));
  }

  getDropDowns(params:any):Observable<any> {
    const apiUrl = `${this.prefix}admin/drop-down`;
    return this._Http.get<ApiResponse>(apiUrl, {params})
  }

  addDropDownOption(data:any):Observable<any> {
    const apiUrl = `${this.prefix}admin/drop-down/option`;
    return this._Http.post<ApiResponse>(apiUrl, data);
  }

  getDropDownOptionById(params:any):Observable<any> {
    const apiUrl = `${this.prefix}admin/drop-down/option`;
    return this._Http.get<ApiResponse>(apiUrl, {params});
  }

  updateDropDownOption(data:any):Observable<any> {
    const apiUrl = `${this.prefix}admin/drop-down/option`;
    return this._Http.put<ApiResponse>(apiUrl, data);
  }

  deleteOption(data:any):Observable<any> {
    const apiUrl = `${this.prefix}admin/drop-down/option/delete`;
    return this._Http.post<ApiResponse>(apiUrl,data);
  }

  createDropDown(data:any):Observable<any> {
    const apiUrl = `${this.prefix}admin/drop-down`;
    return this._Http.post<ApiResponse>(apiUrl, data);
  } 
    gradeFetch(data:any):Observable<any> {
    const apiUrl = `${this.prefix}admin/grade/fetchGrade/${data}`;
    return this._Http.get<ApiResponse>(apiUrl);
  } 

   gradeSave(data:any):Observable<any> {
    const apiUrl = `${this.prefix}admin/grade/saveGrade`;
    return this._Http.post<ApiResponse>(apiUrl,data);
  } 

   gradeUpdate(data:any):Observable<any> {
    const apiUrl = `${this.prefix}admin/grade/updateGrade`;
    return this._Http.post<ApiResponse>(apiUrl,data);
  }
}
