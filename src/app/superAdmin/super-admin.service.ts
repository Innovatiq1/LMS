import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/response';
import { environment } from 'environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AppConstants } from '../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  private defaultUrl: string = environment['apiUrl'];
  constructor(private http: HttpClient) { }



  createAdminBySuperAdmin = (data:any): Observable<any> => {
    const endpoint = environment.apiUrl+'admin/superAdmin';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  getAllCustomRole() {
    const apiUrl = `${this.defaultUrl}admin/customizRole/`;
    return this.http.get<any>(apiUrl).pipe(map((response: any) => response));
  }
  // getAllCustomRoleById(companyId:any) {
  //   const apiUrl = `${this.defaultUrl}admin/customizRole/${companyId}`;
  //   return this.http.get<any>(apiUrl).pipe(map((response: any) => response));
  // }

  getAllCustomRoleById(companyId: any) {
    const apiUrl = `${this.defaultUrl}admin/customizRole/${companyId}`;
    return this.http.get<any>(apiUrl).pipe(
      map((response: any) => {
        console.log('API response:', response); // Log the complete response
        if (response && response.data) {
          return response.data;
        } else {
          console.error('Unexpected response structure:', response);
          return {};
        }
      })
    );
  }


  updateCustomzRole(companyId: any,data: any) {
    const apiUrl = `${this.defaultUrl}admin/customizRole/${companyId}`;
    return this.http
      .put<any>(apiUrl, data)
      .pipe(map((response) => { response}));
  }
}
