import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/general.response';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LogoService {
  private dataSource = new BehaviorSubject<any>(null);
  currentData = this.dataSource.asObservable();
  private defaultUrl: string = environment['apiUrl'];
  constructor(private http: HttpClient) { }

  /* passing data to subscribed components */
  updateData(data: any) {
    this.dataSource.next(data);
  }

  /* Get logos */
  getLogo(id:any): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/logo?companyId=${id}`;
    return this.http.get(apiUrl).pipe(
      map(response => {
        this.updateData(response); // Pass the response to updateData
        return response; 
      })
    );
  }
/* get logo By Id  **/
      getLogoById(id: string){
        const apiUrl = `${this.defaultUrl}admin/logo/${id}`;
        return this.http.get<any>(apiUrl).pipe(map((response) => response));
      }

      /* Update logo  **/

      updateLogo(id: string, data: any) {
        const apiUrl = `${this.defaultUrl}admin/logo/${id}`;
        return this.http.put<any>(apiUrl, data).pipe(map((response) => response));
      }
    // get all sidemenu
      getSidemenu(id:any): Observable<any> {
        const apiUrl = `${this.defaultUrl}admin/sidemenu?companyId=${id}`;
        return this.http.get(apiUrl).pipe(
          map(response => {
             // Pass the response to updateData
            return response; 
          })
        );
      }
      getSettingsSidemenu(id:any): Observable<any> {
        const apiUrl = `${this.defaultUrl}admin/sidemenu/settings/sidemenu?companyId=${id}`;
        return this.http.get(apiUrl).pipe(
          map(response => {
             // Pass the response to updateData
            return response; 
          })
        );
      }
      getSuperAdminSidemenu(): Observable<any> {
        const apiUrl = `${this.defaultUrl}admin/sidemenu`;
        return this.http.get(apiUrl).pipe(
          map(response => {
             // Pass the response to updateData
            return response; 
          })
        );
      }

      getSidemenuById(id?: string){
        const apiUrl = `${this.defaultUrl}admin/sidemenu/${id}`;
        return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
      }

      getSettingSidemenuById(id?: string){
        const apiUrl = `${this.defaultUrl}admin/sidemenu/settings/sidemenu/${id}`;
        return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
      }
     
      updateSidemenu(sidemenu:any) {
        const apiUrl = `${this.defaultUrl}admin/sidemenu/${sidemenu.id}`;
        return this.http
          .put<any>(apiUrl, sidemenu)
          .pipe(map((response) => {response }));
      }

      updateSettingSidemenu(sidemenu:any) {
        const apiUrl = `${this.defaultUrl}admin/sidemenu/settings/sidemenu/${sidemenu.id}`;
        return this.http
          .put<any>(apiUrl, sidemenu)
          .pipe(map((response) => {response }));
      }
}
