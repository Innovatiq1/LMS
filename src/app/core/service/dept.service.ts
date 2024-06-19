import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ApiResponse } from '@core/models/response';
import { environment } from 'environments/environment';
import {
  CoursePaginationModel,
  DepartmentModel,
} from '@core/models/course.model';
import {
  FundingGrant,
  Instructor,
  MainCategory,
  SubCategory,
  Survey,
} from '@core/models/course.model';

@Injectable({
  providedIn: 'root',
})
export class DeptService {
  private apiUrl = 'http://localhost:3000/api/';
  private prefix: string = environment.apiUrl;
  defaultUrl = environment['apiUrl'];
  dataChange: BehaviorSubject<DepartmentModel[]> = new BehaviorSubject<
    DepartmentModel[]
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
      if (filter.main_category && +filter.main_category !== 0) {
        params = params.set('main_category', filter.main_category);
      }
      if (filter.sub_category && +filter.sub_category !== 0) {
        params = params.set('sub_category', filter.sub_category);
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

  getAllDepartments(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    let userId = localStorage.getItem('id');
    //const apiUrl = this.defaultUrl + 'admin/department';
    const apiUrl = this.defaultUrl + `admin/department?adminId=${userId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  saveDepartment(course: any) {
    const apiUrl = `${this.prefix}admin/department/`;
    return this._Http
      .post<ApiResponse>(apiUrl, course)
      .pipe(map((response) => {}));
  }
  getDepartmentById(id: string) {
    const apiUrl = `${this.prefix}admin/department/${id}`;
    return this._Http
      .get<DepartmentModel>(apiUrl)
      .pipe(map((response) => response));
  }
  updateDepartment(id: any, department: any) {
    const apiUrl = `${this.prefix}admin/department/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, department)
      .pipe(map((response) => {}));
  }
  deleteDepartment(id: string) {
    const apiUrl = `${this.prefix}admin/department/${id}`;
    return this._Http
      .delete<DepartmentModel>(apiUrl)
      .pipe(map((response) => response));
  }
}
