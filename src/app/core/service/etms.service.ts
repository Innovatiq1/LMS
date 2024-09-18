/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'environments/environment';
import { ApiResponse } from '@core/models/general.response';
import { CoursePaginationModel } from '@core/models/course.model';
import { EmpRequest } from '@core/models/emp-request.model';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Users } from '@core/models/user.model';
import { CourseTitleModel } from '@core/models/class.model';
// import { CourseKit, CourseModel, CoursePaginationModel, Program } from "@core/models/course.model";

@Injectable({
  providedIn: 'root',
})
export class EtmsService extends UnsubscribeOnDestroyAdapter {
  private prefix: string = environment.apiUrl;
  defaultUrl = environment['apiUrl'];
  dataChange: BehaviorSubject<EmpRequest[]> = new BehaviorSubject<EmpRequest[]>(
    []
  );

  constructor(private _Http: HttpClient) {
    super();
  }
  dialogData!: EmpRequest;

  getDialogData() {
    return this.dialogData;
  }
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
      if (filter.filterText) {
        params = params.set('title', filter.filterText?.toString());
      }
      if (filter.status && filter.status === 'active') {
        params = params.set('status', 'active');
      } else if (filter.status && filter.status === 'inactive') {
        params = params.set('status', 'inactive');
      }
    }
    return params;
  }

  createRequest(request: any) {
    const apiUrl = `${this.prefix}admin/courseRequest`;
    return this._Http
      .post<ApiResponse>(apiUrl, request)
      .pipe(map((response) => response));
  }

  getAllRequestsByEmployeeId(employee: any): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseRequest/req/employee?employeeId=${employee.employeeId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(employee),
    });
  }
  getUserId(id: any) {
    const apiUrl = `${this.prefix}auth/instructorListByID/${id}`;
    return this._Http.get<Users>(apiUrl).pipe(map((response) => response));
  }

  getAllRequestsByRo(ro: any): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseRequest/req/employee?ro=${ro.roId}&roApproval=${ro.roApproval}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(ro),
    });
  }

  getAllRequestsByDirector(director: any): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseRequest/req/employee?director=${director.directorId}&directorApproval=${director.directorApproval}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(director),
    });
  }

  getAllRequestsByTrainingAdmin(trainingAdmin: any): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseRequest/req/employee?trainingAdmin=${trainingAdmin.trainingAdminId}&trainingAdminApproval=${trainingAdmin.trainingAdminApproval}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(trainingAdmin),
    });
  }

  updateStatus(data: any, id: any) {
    const apiUrl = `${this.prefix}admin/courseRequest/${id}`;
    return this._Http.put<ApiResponse>(apiUrl, data).pipe(map(() => {}));
  }

  getAllRequests(
    searchValue: any,
    searchType: any,
    data: any
  ): Observable<any> {
    const apiUrl = `${this.prefix}admin/courseRequest?searchValue=${searchValue}&searchType=${searchType}`;
    return this._Http.get<any>(apiUrl, {
      params: this.buildParams(data),
    });
  }

  /**get request details by id */
  getRequestById(id: any) {
    const apiUrl = `${this.prefix}admin/courseRequest/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }

  getRequestDirectorCount(id: any) {
    const apiUrl = `${this.prefix}admin/courseRequest/req/count?director=${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  getRequestRoCount(id: any) {
    const apiUrl = `${this.prefix}admin/courseRequest/req/count?ro=${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  getRequestTrainingAdminCount(id: any) {
    const apiUrl = `${this.prefix}admin/courseRequest/req/count?trainingAdmin=${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }

  /**get all courses list */
  getAllCoursesTitle(status: string): Observable<CourseTitleModel[]> {
    const apiUrl = `${this.prefix}admin/courses-new/title?status=${status}`;
    return this._Http
      .get<ApiResponse>(apiUrl)
      .pipe(map((response) => response.data));
  }

  getAllDepartmentBudgets(data: any): Observable<any> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId
    let employeeId = JSON.parse(localStorage.getItem('user_data')!).user.id
    const apiUrl = `${this.prefix}admin/budget/department-budget/budget?companyId=${userId}&employeeId=${employeeId}`;
    return this._Http
      .get<any>(apiUrl, {
        params: this.buildParams(data),
      })
      .pipe(map((response) => response.data));
  }
  createBudget(request: any) {
    const apiUrl = `${this.prefix}admin/budget`;
    return this._Http
      .post<ApiResponse>(apiUrl, request)
      .pipe(map((response) => response));
  }

  getAllBudgets(data: any): Observable<any> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId
    let employeeId = JSON.parse(localStorage.getItem('user_data')!).user.id
    const apiUrl = `${this.prefix}admin/budget?companyId=${userId}&employeeId=${employeeId}`;
    return this._Http.get<any>(apiUrl, {
      params: this.buildParams(data),
    })
    // .pipe(map((response) => response.data));
  }

  getBudgetRequestsByDirector(head: any): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId
    const apiUrl = `${this.prefix}admin/budget/budg/head?head=${head.headId}&approval=${head.headApproval}&companyId=${userId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(head),
    });
  }
  getBudgetRequestDirectorCount(id: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId
    const apiUrl = `${this.prefix}admin/budget/budg/count?head=${id}&companyId=${userId}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  updateBudgetStatus(data: any, id: any) {
    const apiUrl = `${this.prefix}admin/budget/${id}`;
    return this._Http.put<ApiResponse>(apiUrl, data).pipe(map(() => {}));
  }

  getDeptBudgetRequestsByDirector(head: any): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId
    const apiUrl = `${this.prefix}admin/budget/department-budget/budg/head?head=${head.headId}&approval=${head.headApproval}&companyId=${userId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(head),
    });
  }
  getDeptBudgetRequestDirectorCount(id: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId
    const apiUrl = `${this.prefix}admin/budget/department-budget/budg/count?head=${id}&companyId=${userId}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  updateDeptBudgetStatus(data: any, id: any) {
    const apiUrl = `${this.prefix}admin/budget/department-budget/budget/${id}`;
    return this._Http.put<ApiResponse>(apiUrl, data).pipe(map(() => {}));
  }
  createDept(request: any) {
    const apiUrl = `${this.prefix}admin/budget/department-budget/budget`;
    return this._Http
      .post<ApiResponse>(apiUrl, request)
      .pipe(map((response) => response));
  }
  getNewRequestsByEmployeeId(employee: any): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courses-new?status=${employee.employeeStatus}&employee=${employee.employeeId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(employee),
    });
  }
  getCourseRequestsByTrainingAdmin(
    trainingAdmin: any
  ): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courses-new?status=${trainingAdmin.trainingAdminStatus}&trainingAdmin=${trainingAdmin.trainingAdminId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(trainingAdmin),
    });
  }

  updateCourseStatus(data: any, id: any) {
    const apiUrl = `${this.prefix}admin/courses-new/${id}`;
    return this._Http.put<ApiResponse>(apiUrl, data).pipe(map(() => {}));
  }

  getBudgetById(id: any) {
    const apiUrl = `${this.prefix}admin/budget/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }

  updateTrainingBudget(id: any, data: any) {
    const apiUrl = `${this.prefix}admin/budget/${id}`;
    return this._Http.put<ApiResponse>(apiUrl, data).pipe(map(() => {}));
  }

  deleteTrainingBudget(id: any) {
    const apiUrl = `${this.prefix}admin/budget/${id}`;
    return this._Http.delete<any>(apiUrl).pipe(map((response) => response));
  }
  /** Budget Allocation*/

  getDeptBudgetById(id: any) {
    const apiUrl = `${this.prefix}admin/budget/department-budget/budget/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  updateBudget(id: any, payload: any) {
    const apiUrl = `${this.prefix}admin/budget/department-budget/budget/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, payload)
      .pipe(map((response) => response));
  }
  deleteBudget(id: any) {
    const apiUrl = `${this.prefix}admin/budget/department-budget/budget/${id}`;
    return this._Http.delete<any>(apiUrl).pipe(map((response) => response));
  }
}
