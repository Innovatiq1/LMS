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
    }
    return params;
  }

  saveSmtp(smtp: any) {
    const apiUrl = `${this.prefix}admin/smtp`;
    return this._Http
      .post<ApiResponse>(apiUrl, smtp)
      .pipe(map((response) => {}));
  }

  getSmtp(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
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
    const apiUrl = `${this.prefix}admin/smtp/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => {}));
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
}
