import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/general.response';
import { Logger } from './logger.service';
import { Announcement } from '../models/announcement.model';
import { environment } from 'environments/environment.development';

const Logging = new Logger('AnnouncementService');

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private defaultUrl: string = environment['apiUrl'];

  constructor(private http: HttpClient) { }

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
    let userId = localStorage.getItem('id');    
    const endpoint = `${this.defaultUrl}admin/announcement?adminId=${userId}`;
    return this.http.get(endpoint, { params: filter }).pipe(
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
