import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Teachers } from './teachers.model';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Users,UsersPaginationModel } from '@core/models/user.model';
import { ApiResponse } from '@core/models/general.response';
import { environment } from 'environments/environment';
@Injectable()
export class TeachersService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/teachers.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Teachers[]> = new BehaviorSubject<Teachers[]>([]);
  private prefix: string = environment.apiUrl;
  // Temporarily stores data from dialogs
  dialogData!: Teachers;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Teachers[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllTeacherss(payload:any): void {
    const apiUrl = `${this.prefix}auth/instructorList/`;
    this.subs.sink = this.httpClient.post<Teachers>(apiUrl,payload).subscribe({
      next: (response) => {
        this.isTblLoading = false;
        this.dataChange.next(response.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
 
  private buildParams(filter?: Partial<UsersPaginationModel>): HttpParams {
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
      
      if (filter.title) {
        params = params.set("title", filter.title?.toString());
      }
      if (filter.status && filter.status === "active") {
        params = params.set("status", "active");
      } else if (filter.status && filter.status === "inactive") {
        params = params.set("status", "inactive");
      }
    }
    return params;
  }


  getUserById(id: string) {
    const apiUrl = `${this.prefix}auth/instructorListByID/${id}`;
    return this.httpClient.get<Users>(apiUrl).pipe(map((response) => response));
  }
  updateUser(
    id: string,
    users: Users
  ): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}auth/instructorUpdate/${id}`;
    return this.httpClient.put<ApiResponse>(apiUrl, users);
  }
  deleteUser(userId: string): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}auth/instructorDelete/${userId}`;
    return this.httpClient.delete<ApiResponse>(apiUrl);
  }

  getInstructor(filter?: Partial<UsersPaginationModel>,type?:string): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = `${this.prefix}auth/instructorList?companyId=${userId}&type=${type}`;
    return this.httpClient
      .get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
      .pipe(
        map((response:any) => {
          return response;
          //this.isTblLoading = false;
        })
      );
  }

  confrim(userId: string, type?: string): Observable<ApiResponse> {
    let user = {
      isLogin: true,
      type: type,
    };
    const apiUrl = `${this.prefix}auth/instructorConfirm/${userId}`;
    return this.httpClient.put<ApiResponse>(apiUrl, user);
  }
  deActiveconfrim(userId: string, type?: string): Observable<ApiResponse> {
    let user = {
      isLogin: false,
      type: type,
    };
    const apiUrl = `${this.prefix}auth/instructorConfirm/${userId}`;
    return this.httpClient.put<ApiResponse>(apiUrl, user);
  }
}

