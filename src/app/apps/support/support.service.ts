import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Support } from './support.model';
import { map,Observable } from 'rxjs';
import { ApiResponse } from '@core/models/response';
import { CoursePaginationModel } from '@core/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private http: HttpClient) { }

  defaultUrl = environment['apiUrl'];
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

    }
    return params;
  }

  getAllTickets(filter?:Partial<CoursePaginationModel>) {
    const apiUrl = `${this.defaultUrl}admin/chatbot`;
    return this.http.get<Support>(apiUrl, { params: this.buildParams(filter) }).pipe(map((response) => response));
  }
  getCount(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl+'admin/chatbot/count';
    return this.http.get<ApiResponse>(apiUrl);
  }
  getTicketById(id:string) {
    const apiUrl = `${this.defaultUrl}admin/chatbot/${id}`;
    return this.http.get<Support>(apiUrl).pipe(map((response) => response));
  }

  deleteTicket(id: string) {
    const apiUrl = `${this.defaultUrl}admin/chatbot/${id}`;
    return this.http
      .delete<Support>(apiUrl)
      .pipe(map((response) => response));
  }
  updateChat(id:string,dataDetails: Support) {
    console.log("=====",dataDetails)
   // const apiUrl = `${this.defaultUrl}admin/chatbot/${dataDetails.id}`;
   const apiUrl = `${this.defaultUrl}admin/chatbot/${id}`;
    return this.http.put<ApiResponse>(apiUrl, dataDetails).pipe(
      map((response) => {
        return response.data
      })
    );
  }
}
