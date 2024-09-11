import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from './logger.service';
import { Users } from '../models/user.model';
import { CoursePaginationModel } from '../models/course.model';
import { AppConstants } from '@shared/constants/app.constants';
import { ApiResponse } from '@core/models/general.response';
import { environment } from 'environments/environment';

const Logging = new Logger('AuthenticationService');

@Injectable({
  providedIn: 'root',
})
export class AuthenService {
    private currentUserSubject!: BehaviorSubject<any>;
    public currentUser!: Observable<any>;
    profileUpdated = new EventEmitter<any>();
  
  defaultUrl = environment['apiUrl'];
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
        JSON.parse(localStorage.getItem('currentUser') || '{}')
      );
      this.currentUser = this.currentUserSubject.asObservable();
  
  }
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  loginUser(email: any, password: any,companyId:any): Observable<Users> {
    const body = {
      email,
      password,
      companyId
    };

    const loginUrl =this.defaultUrl + 'auth/login';
    let headers = new HttpHeaders();
    headers = headers.set('no-auth' , 'true');
    return this.http.post<ApiResponse>(loginUrl, body, { headers }).pipe(
      map((response) => {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        localStorage.setItem('userLogs', JSON.stringify(response.userLogs));
        localStorage.setItem('id', response.data.user.id);
        this.currentUserSubject.next(response.data);
      return response.data;
      },
      (error: any) =>{
      })
    );


  }
  socialLogin(socialUser:any): Observable<Users> {
    const loginUrl =this.defaultUrl + 'auth/social-login';
    return this.http.post<ApiResponse>(loginUrl, socialUser).pipe(
      map((response) => {
        console.log('socialres',response)
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        localStorage.setItem('userLogs', JSON.stringify(response.userLogs));
        localStorage.setItem('id', response.data.user.id);
        this.currentUserSubject.next(response.data);
      return response.data;
      },
      (error: any) =>{
      })
    );
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

  getAllCourses(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    const apiUrl =this.defaultUrl+'admin/courses-new';
    return this.http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getAccessToken() {
    //let user =JSON.parse();
    const user = this.getUserInfo();
    localStorage.getItem(AppConstants.KEY_USER_DATA)
   return user ? user.token : null;
  }

  getUserInfo() {
    //let consta =localStorage.getItem(AppConstants.KEY_USER_DATA)
    return JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA)||'{}');
  }

  saveUserInfo(info:any) {
    localStorage.setItem(AppConstants.KEY_USER_DATA, JSON.stringify(info));
    localStorage.setItem('user_type',info.user.type);

}

getRoleDetails() {
  return JSON.parse(localStorage.getItem('roleDetails')||'{}');
}

saveRoleDetails(data:any) {
  localStorage.setItem('roleDetails', JSON.stringify(data));

}

private userProfile: any = {

  // Initialize with default user data
};

getUserProfile() {
  return this.userProfile;
}

updateUserProfile(updatedProfile: any) {
  this.profileUpdated.emit(updatedProfile); 
}
private linkedInCredentials = {
  response_type: "code",
  clientId: "77r1poks3r9jfo",
  redirect_uri: 'http://localhost:4200/innovatiq-uat/authentication/auth/linkedin/redirect',
  clientSecret: 'ZgFGOi8fXTy9zjoS',
  state: 'randomstring',
  scope: "openid email profile",
};


loginWithLinkedIn(companyName:string): void {
  const params = new HttpParams()
    .set('response_type', this.linkedInCredentials.response_type)
    .set('client_id', this.linkedInCredentials.clientId)
    .set('redirect_uri',`http://localhost:4200/${companyName}/authentication/auth/linkedin/redirect` )
    .set('state', this.linkedInCredentials.state)
    .set('scope', this.linkedInCredentials.scope);

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  window.location.href = authUrl;
}


getProfileData(accessToken: string): Observable<any> {
  const loginUrl =this.defaultUrl + 'auth/linkedinauthorize';
  return this.http.get(`${loginUrl}?accessToken=${accessToken}`);
}

getUsersByEmail(email: string): Observable<any> {
  const loginUrl =this.defaultUrl + 'auth/usersByEmail';
  return this.http.get(`${loginUrl}?email=${email}`);
}

AccessToken(data: any): Observable<any> {
  const body = new HttpParams()
    .set('grant_type', 'authorization_code')
    .set('code', data.code)
    .set('redirect_uri', this.linkedInCredentials.redirect_uri)
    .set('client_id', this.linkedInCredentials.clientId)
    .set('client_secret', this.linkedInCredentials.clientSecret);
    const loginUrl =this.defaultUrl + 'auth/linkedinlogin';
    return this.http.post<ApiResponse>(loginUrl, data).pipe(
      map((response) => {
        return response;
      }))
  
}


}
