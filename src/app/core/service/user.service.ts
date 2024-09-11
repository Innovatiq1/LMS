import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {  map } from 'rxjs/operators';
import { BehaviorSubject, Observable,throwError} from 'rxjs';
import { ApiResponse } from '../models/general.response';
import { Logger } from './logger.service';
import { catchError } from 'rxjs/operators';
import {UserType} from "../models/user.model"
import { Mentor } from '../models/mentor';
import { environment } from 'environments/environment';
import { CoursePaginationModel } from '@core/models/course.model';
import { AppConstants } from '@shared/constants/app.constants';

const Logging = new Logger('UserService');

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private defaultUrl: string = environment['apiUrl'];
  private Url: string = environment['Url'];

    prefix: any;
    dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
      []
    );
  constructor(private http: HttpClient) {}

  dialogData!: any;
  getDialogData() {
    return this.dialogData;
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
      if (filter.status && filter.status === "active") {
        params = params.set("status", "active");
      } else if (filter.status && filter.status === "inactive") {
        params = params.set("status", "inactive");
      }
    }
    return params;
  }
  getUserList(filter?: Partial<CoursePaginationModel>,id?:any): Observable<any> {
   
   // const apiUrl = this.defaultUrl + 'admin/adminUserListing';
   const apiUrl = this.defaultUrl + `admin/adminUserListing?companyId=${id}`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }
  getAdminsList(filter?: Partial<CoursePaginationModel>,id?:any): Observable<any> {
   
    // const apiUrl = this.defaultUrl + 'admin/adminUserListing';
    const apiUrl = this.defaultUrl + `admin/adminUserListing`;
     return this.http
       .get<ApiResponse>(apiUrl, {
         params: this.buildParams(filter),
       })
       .pipe(map((response) => response));
   }
 
  getAllStudents(filter?: Partial<CoursePaginationModel>): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/adminUserListing?learner=${AppConstants.STUDENT_ROLE}`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }

  getAllUsers(filter?: Partial<CoursePaginationModel>): Observable<any> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const apiUrl = `${this.defaultUrl}admin/adminUserListing?isAllUsers=true&companyId=${userId}`;

    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }


  
  getUsersListByRole(type:any,userId:any,filter?: Partial<any>): Observable<any> {
   
    const apiUrl = `${this.defaultUrl}admin/adminUserListing/user/role?type=${type}&companyId=${userId}`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }

  getUsersByDepartment(type:any,userId:any,filter?: Partial<any>): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/adminUserListing/user/department?department=${type}&companyId=${userId}`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }

  getUserRole(typeName:string,filter?: Partial<any>) {
    const apiUrl = `${this.defaultUrl}userType?typeName=${typeName}`;
    return this.http
    .get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    })
    .pipe(map((response) => response));
  }
  getUserById(id: string) {
    const apiUrl = `${this.defaultUrl}admin/adminUserListing/${id}`;
    return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }

  getCompanyById(id: string) {
    const apiUrl = `${this.defaultUrl}admin/company/${id}`;
    return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }
  getUserList1(): Observable<any> {
    const apiUrl = this.defaultUrl + 'auth/usersList';
    return this.http
      .post<ApiResponse>(apiUrl, {
       
      })
      .pipe(map((response) => response));
  }
  deleteUser(id: string) {
    const apiUrl = `${this.defaultUrl}admin/adminUserListing/${id}`;
    return this.http
      .delete<ApiResponse>(apiUrl)
      .pipe(map((response) => response));
  }
  getAllUserList(filter?:any): Observable<any> {
    const apiUrl = this.defaultUrl + 'admin/adminUserListing/instructors    ';
    return this.http
      .get<ApiResponse>(apiUrl)
      .pipe(map((response) => response));
  }
  
  
  getUserRewards = (filters:any,userID?:any): Observable<any> => {
    const endpoint = environment.apiUrl+'admin/mentor/fetchUserRewards/'+userID;
    return this.http.get(endpoint,{params: filters}).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getRewardRedeemSetting = (filter:any): Observable<any> => {
    const endpoint = environment.apiUrl+'admin/mentor/fetchRewardRedeemSetting';
    return this.http.get(endpoint,{params: filter}).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  createRedeemSettingData = (data:any): Observable<any> => {
    const endpoint = environment.apiUrl+'admin/mentor/addRedeemSettingData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };

  updateRedeemSettingData = (data:any,Id:any): Observable<any> => {
    let endpoint = environment.apiUrl+'admin/mentor/updateRedeemSettingData';
    if (Id) {
      endpoint += `?id=${Id}`;
    }
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  


  saveUsers(formData:any): Observable<Mentor> {
    const apiUrl = this.defaultUrl + 'admin/adminUserListing';
    return this.http.post<ApiResponse>(apiUrl, formData).pipe(
      map((response) => {
        Logging.debug(response.data);
        return response.data;
      })
    );
  }

  createCompany(formData:any): Observable<Mentor> {
    const apiUrl = this.defaultUrl + 'admin/company';
    return this.http.post<ApiResponse>(apiUrl, formData).pipe(
      map((response) => {
        Logging.debug(response.data);
        return response.data;
      })
    );
  }

  updateUsers(formData:any, id:any): Observable<Mentor> {
    const apiUrl = `${this.defaultUrl}admin/adminUserListing/${id}`;
    return this.http.put<ApiResponse>(apiUrl, formData).pipe(
      map((response) => {
        Logging.debug(response.data);
        return response.data;
      })
    );
  }

  updateCompany(formData:any, id:any): Observable<Mentor> {
    const apiUrl = `${this.defaultUrl}admin/company/${id}`;
    return this.http.put<ApiResponse>(apiUrl, formData).pipe(
      map((response) => {
        Logging.debug(response.data);
        return response.data;
      })
    );
  }

  getCompanyByIdentifier(id: string) {
    const apiUrl = `${this.defaultUrl}admin/company/${id}`;
    return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }

  getCompanyByIdentifierWithoutToken(id: string) {
    const apiUrl = `${this.Url}getCompanyByIdentifier/${id}`;
    return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }
  updateUserType(dataDetails: UserType) {
    const apiUrl = `${this.defaultUrl}userType/${dataDetails._id}`;
    return this.http.put<ApiResponse>(apiUrl, dataDetails).pipe(
      map((response) => {
        return response.data
      })
    );
  }

  deleteUserType(id: string,typeName:string,companyId:string) {
    const apiUrl = `${this.defaultUrl}userType/${id}?typeName=${typeName}&companyId=${companyId}`;
    return this.http.delete<ApiResponse>(apiUrl).pipe(
      map((response) => {
        return response
      })
    );
  }

  saveGroups(users: any) {
    const apiUrl = `${this.defaultUrl}admin/user-group/`;
    return this.http
      .post<ApiResponse>(apiUrl, users)
      .pipe(map((response) => { }));
  }

  getUserGroups(filter?: Partial<CoursePaginationModel>): Observable<any> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
       // const apiUrl = this.defaultUrl + 'admin/user-group';
   const apiUrl = this.defaultUrl + `admin/user-group?companyId=${userId}`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }

  getUserGroupById(id: string) {
    const apiUrl = `${this.defaultUrl}admin/user-group/${id}`;
    return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }


  updateUserGroup(id:string, data:any){
    const apiUrl = `${this.defaultUrl}admin/user-group/${id}`;
    return this.http.put<ApiResponse>(apiUrl, data).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  deleteUserGroup(id: string) {
    const apiUrl = `${this.defaultUrl}admin/user-group/${id}`;
    return this.http.delete<ApiResponse>(apiUrl).pipe(
      map((response) => {
        return response
      })
    );
  }
  // getAllUsersByRole(type:any,companyId: string,filter?: Partial<any>): Observable<any> {
  //   const apiUrl = `${this.defaultUrl}admin/adminUserListing/user/role?type=${type}&isAll=true`;
  //   return this.http
  //     .get<ApiResponse>(apiUrl, {
  //       params: this.buildParams(filter),
  //     })
  //     .pipe(map((response) => response));
  // }
  getAllUsersByRole(type: any, companyId?: string, filter?: Partial<any>): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/adminUserListing/user/role?type=${type}&companyId=${companyId}&isAll=true`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }


  saveCustomzDashboard(data: any) {
    const apiUrl = `${this.defaultUrl}/customzDashboard/`;
    return this.http
      .post<ApiResponse>(apiUrl, data)
      .pipe(map((response) => { }));
  }
  
  updateCustomzDashboard(data: any) {
    const apiUrl = `${this.defaultUrl}/customzDashboard/`;
    return this.http
      .put<ApiResponse>(apiUrl, data)
      .pipe(map((response) => { }));
  }
  getAllDashboard(typeName: string) {
    const apiUrl = `${this.defaultUrl}customzDashboard/`;
    let params = new HttpParams().set('typeName', typeName);
    return this.http.get<ApiResponse>(apiUrl,{ params }).pipe(map((response) => response));
  }

  getDashboardsByCompanyId(companyId: string, typeName?:any): Observable<ApiResponse> {
    let apiUrl
    if(typeName){
      apiUrl = `${this.defaultUrl}customzDashboard/${companyId}/${typeName}`;
    }else{
      apiUrl = `${this.defaultUrl}customzDashboard/${companyId}`;
    }
    return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }
  getUsersById(head: any){
    const apiUrl = `${this.defaultUrl}admin/user/headId?head=${head.headId}`;
      return this.http
        .get<ApiResponse>(apiUrl, {
          params: this.buildParams(head),
        })
        .pipe(map((response) => response));
   }
  
   getCoursesById(id: string) {
    const apiUrl = `${this.defaultUrl}admin/studentClasses/course/${id}`;
    return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }
  
  
  getTutorialAnswers(studentId: string, courseId: string, filter?: Partial<any>): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/tutorial-answers/retakes?studentId=${studentId}&courseId=${courseId}`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }

  getExamAnswers(studentId: string, courseId: string, filter?: Partial<any>): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/exam-assesment-answers/retakes?studentId=${studentId}&courseId=${courseId}`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }

  getAssesmentAnswers(studentId: string, courseId: string, filter?: Partial<any>): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/assesment-answers/retakes?studentId=${studentId}&courseId=${courseId}`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      })
      .pipe(map((response) => response));
  }
}




