import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'environments/environment';
import { Observable } from "rxjs";
import {
  AuditListingModel,
  AttendanceListingModel,
} from "../models/audit.model";
import { CoursePaginationModel } from "../models/course.model";
import { map } from "rxjs/operators";
import { ApiResponse } from "../models/general.response";

@Injectable({
  providedIn: "root",
})
export class AuditService {
  private prefix: string = environment["apiUrl"];
  constructor(private http: HttpClient) {}

  private buildParams(filter?: Partial<AuditListingModel>): HttpParams {
    let params = new HttpParams();
    if (filter) {
      if (filter.sortBy)
        params = params.set(
          "sortBy",
          `${filter.sortByDirection == "asc" ? "+" : "-"}${filter.sortBy}`
        );
      if (filter.limit) params = params.set("limit", filter.limit?.toString());
      if (filter.page) params = params.set("page", filter.page?.toString());
      if (filter.type) params = params.set("type", filter.type);
      if (filter.filter)
        params = params.set(filter.filter.key, filter.filter.value);
    }
    return params;
  }
  getAuditList(filter: Partial<AuditListingModel> | undefined): Observable<AuditListingModel> {
    let id = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = `${this.prefix}auth/userLogs?companyId=${id}`;
    return this.http
      .get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }
  
}
