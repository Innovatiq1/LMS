import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

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
}
