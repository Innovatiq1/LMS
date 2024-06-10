import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'environments/environment';
//import { ApiResponse } from '../models/response'
import {  ApiResponse } from '@core/models/response';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  

  forgotPassword(email: any): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(
        `${environment.apiUrl}common/forgot-password`,
        email
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
  logout1(data: any) {
    const apiUrl = `${environment.apiUrl}auth/userlogs/logout`
    return this.http.put<ApiResponse>(apiUrl, data).pipe(map((response) => response));
  }


}
