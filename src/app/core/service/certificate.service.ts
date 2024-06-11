import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import {  map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/general.response';
import { Logger } from './logger.service';
import { CertificateBuilderPaginationModel } from '@core/models/certificatebuilder.model';
import { CourseKit, CourseModel, CoursePaginationModel, Program, Vendor } from "@core/models/course.model";

const Logging = new Logger('certificateService');

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private defaultUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {

  }
  private buildParams(filter?: Partial<CoursePaginationModel>): HttpParams {
    let params = new HttpParams();
    if (filter) {
      if (filter.sortBy) {
        params = params.set(
          "sortBy",
          `${filter.sortByDirection === "asc" ? "+" : "-"}${filter.sortBy}`
        );
      }
      if (filter.limit) {
        params = params.set("limit", filter.limit?.toString());
      }
      if (filter.page) {
        params = params.set("page", filter.page?.toString());
      }
      if (filter.main_category && +filter.main_category !== 0) {
        params = params.set("main_category", filter.main_category);
      }
      if (filter.sub_category && +filter.sub_category !== 0) {
        params = params.set("sub_category", filter.sub_category);
      }
      if (filter.filterText) {
        params = params.set("title", filter.filterText?.toString());
      }
      if (filter.feeType) {
        params = params.set("feeType", filter.feeType);
      }
      if (filter.status && filter.status === "active") {
        params = params.set("status", "active");
      } else if (filter.status && filter.status === "inactive") {
        params = params.set("status", "inactive");
      }
    }
    return params;
  }

  addcertificateBuilder(formData:any): Observable<any> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}admin/certificate-builder`, formData).pipe(map((response) => {
      return response.data;
    }));
  }

 
  uploadImage(file:any) {
    const apiUrl = `${this.defaultUrl}admin/video/uploadImage`;
    return this.http.post<any>(apiUrl, file).pipe(
      map((response) => {
        return response
      })
    );
  }
  uploadCourseThumbnail(file:any) {
    const apiUrl = `${this.defaultUrl}admin/video/uploadCourseThumbnail`;
    return this.http.post<any>(apiUrl, file).pipe(
      map((response) => {
        return response
      })
    );
  }
  getAllCertificate(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl+'admin/certificate-builder';
    return this.http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getcertificateDesigns(): Observable<any> {
    const apiUrl = this.defaultUrl + `admin/certificate-builder/certificatesList`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: {}
      })
      .pipe(map((response) => response));
  }
  getcertificateBuilders(filter?: Partial<CertificateBuilderPaginationModel>): Observable<any> {
    const apiUrl = this.defaultUrl + `admin/certificate-builder`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: {}
      })
      .pipe(map((response) => response));
  }
  createCertificate(payload:any) {
    const apiUrl = this.defaultUrl + `admin/certificate-builder`;
    return this.http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }
  getCertificateById(id: any) {
    const apiUrl = this.defaultUrl + `admin/certificate-builder/${id}`
   // const apiUrl = `${this.prefix}admin/program-class/${id}`;
    return this.http.get<any>(apiUrl).pipe(map((response) => response.data));
  }
  updateCertificate(id:string,payload:any) {
    const apiUrl = this.defaultUrl + `admin/certificate-builder/${id}`
   // const apiUrl = `${this.prefix}admin/funding-grant/${id}`;
    return this.http.put<any>(apiUrl, payload).pipe(map((response) => response));
  }

}
