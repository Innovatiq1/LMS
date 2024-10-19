import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/general.response';
import { Logger } from './logger.service';
import { Announcement } from '../models/announcement.model';
import { environment } from 'environments/environment.development';
import { CoursePaginationModel } from '@core/models/course.model';

const Logging = new Logger('AnnouncementService');

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private defaultUrl: string = environment['apiUrl'];

  constructor(private http: HttpClient) { }
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
      if (filter.title) {
        params = params.set("title", filter.title?.toString());
      }
      if (filter.feeType) {
        params = params.set("feeType", filter.feeType);
      }
      if (filter.datefilter) {
        params = params.set("datefilter", filter.datefilter);
      }

      if (filter.status && filter.status === "active") {
        params = params.set("status", "active");
      } else if (filter.status && filter.status === "inactive") {
        params = params.set("status", "inactive");
      }
      if(filter.companyId) {
        params = params.set('companyId', filter.companyId)
      }
      if(filter.isAll) {
        params = params.set('isAll', filter.isAll)
      }
    }
    return params;
  }

  makeAnnouncement(formData: any): Observable<Announcement> {
    const apiUrl = this.defaultUrl + 'admin/announcement';
    return this.http.post<ApiResponse>(apiUrl, formData).pipe(
      map((response) => {
        Logging.debug(response.data);
        return response.data;
      })
    );
  }

  
  getAnnouncementList = (filter: any): Observable<any> => {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const endpoint = `${this.defaultUrl}admin/announcement?companyId=${userId}`;
    return this.http.get(endpoint, { params: this.buildParams(filter) }).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  };
  getAnnouncementsForStudents = (body: any): Observable<any> => {
    const endpoint = environment.apiUrl + 'admin/announcement/forStudent';
    return this.http.post(endpoint, body ).pipe(
      map((response) => {
        return response;
      })
    );
  };

  getAnnouncementById(id: any): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/announcement/${id}`;
    return this.http.get(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  };

  deleteAnnouncement(id: any): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/announcement/${id}`;
    return this.http.delete<ApiResponse>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  updateAnnouncement = (data: any, Id: any): Observable<any> => {
    const apiUrl = `${this.defaultUrl}admin/announcement/${Id}`;

    return this.http.patch(apiUrl, data).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  };

}
