/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Program } from './program.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CoursePaginationModel } from '@core/models/course.model';
import { ApiResponse } from '@core/models/general.response';
import { ClassListingModel } from '../schedule-class/class.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private prefix: string = environment["apiUrl"];
  private readonly API_URL = 'assets/data/students.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Program[]> = new BehaviorSubject<Program[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Program;

  constructor(private httpClient: HttpClient) { }


  private buildParams(filter?: Partial<CoursePaginationModel>): HttpParams {
    let params = new HttpParams();
    if (filter) {
      if (filter.sortBy)
        params = params.set("sortBy", `${filter.sortByDirection == "asc" ? "+" : "-"}${filter.sortBy}`);
      if (filter.limit) params = params.set("limit", filter.limit?.toString());
      if (filter.page) params = params.set("page", filter.page?.toString());
      if (filter.filterText) params = params.set("title", filter.filterText?.toString());
    }
    return params;
  }



  /** CRUD METHODS */
getProgramClassListWithPagination(id:any,
  filter?:Partial<CoursePaginationModel>): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/program-class?companyId=${id}`;
  return this.httpClient.get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
}


getCourseProgram(filter?: Partial<Program>): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/courseprogram`;
  return this.httpClient
    .get<ApiResponse>(apiUrl, { params: this.buildParams(filter)})
    .pipe(
      map((response: { data: any; }) => {
        return response.data;
      })
    );
}

saveProgramClass(formData: any): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/program-class/`;
  return this.httpClient.post<ApiResponse>(apiUrl, formData).pipe(
    map((response) => {
      return response.data;
    })
  );
}

updateProgramClass(id: string, formData: any): Observable<ApiResponse> {
  const apiUrl = `${this.prefix}admin/program-class/${id}`;
  return this.httpClient.put<ApiResponse>(apiUrl, formData).pipe(
    map((response) => {
      return response.data;
    })
  );
}

getProgramClassList(filter?:any): Observable<ClassListingModel> {
  const apiUrl = `${this.prefix}admin/program-class/`;
  return this.httpClient.get<ApiResponse>(apiUrl, { params: this.buildParams(filter) }).pipe(
    map((response:any) => {
      return response.data;
    })
  );
}
deleteProgramClass(id: any): Observable<ApiResponse> {
  return this.httpClient.delete<ApiResponse>(`${environment.apiUrl}admin/program-class/${id}`).pipe(
    map((response) => {
      return response.data;
    })
  );
}
getProgramClassById(id: string) {
  const apiUrl = `${this.prefix}admin/program-class/${id}`;
  return this.httpClient.get<any>(apiUrl).pipe(map((response) => response.data));
}
}
