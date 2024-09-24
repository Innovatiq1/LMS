import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CoursePaginationModel } from '@core/models/course.model';
import { BehaviorSubject, Observable, map } from "rxjs";
import { ApiResponse } from "@core/models/response";

@Injectable({
  providedIn: 'root'
})
export class EmailConfigService {
  private prefix: string = environment.apiUrl;
  private Companyprefix: string = environment.Url;


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

  sendEmail(mail: any) {
    const apiUrl = `${this.prefix}admin/internal-email/`;
    return this.http
      .post<ApiResponse>(apiUrl, mail)
      .pipe(map((response) => { }));
  }

  getMailsByToAddress(to:string,filterName:any): Observable<any[]> {
    const apiUrl = `${this.prefix}admin/internal-email/mail?filterName=${filterName}&to=${to}&toStatus=active&archive=false`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }   

  getMailsByFromAddress(from:string,filterName:any): Observable<any[]> {
    const apiUrl = `${this.prefix}admin/internal-email/mail?filterName=${filterName}&from=${from}&fromStatus=active&archive=false`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }   

  getImportantMailsByToAddress(to:string,filterName:any): Observable<any[]> {
    const apiUrl = `${this.prefix}admin/internal-email/mail?filterName=${filterName}&to=${to}&toStatus=active&toImportant=true&toArchive=false`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }   

  getStarredMails(to:string,filterName:any): Observable<any[]> {
    const apiUrl = `${this.prefix}admin/internal-email/mail?filterName=${filterName}&to=${to}&from=${to}&toStarred=true&fromStarred=true&toArchive=false`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }   

  getSpamMails(to:string): Observable<any[]> {
    const apiUrl = `${this.prefix}admin/internal-email/mail?to=${to}&from=${to}&toSpam=true&fromSpam=true&toArchive=false`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }   

  getDraftedMailsByFromAddress(from:string): Observable<any[]> {
    const apiUrl = `${this.prefix}admin/internal-email/mail?from=${from}&fromStatus=draft&archive=false`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }   


  getMailDetailsByMailId(id:string): Observable<any[]> {
    const apiUrl = `${this.prefix}admin/internal-email/mail-id/${id}`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response));
  }   

  getDeletedMailsByToAddress(to:string): Observable<any[]> {
    const apiUrl = `${this.prefix}admin/internal-email/mail?to=${to}&toStatus=inactive&archive=false`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }   


  deleteMail(mail:any) {
    const apiUrl = `${this.prefix}admin/internal-email`;
    return this.http.put<ApiResponse>(apiUrl, mail).pipe(map((response) => { }));
  }
  updateMail(mail:any) {
    const apiUrl = `${this.prefix}admin/internal-email`;
    return this.http.put<ApiResponse>(apiUrl, mail).pipe(map((response) => { }));
  }
  replyMail(id:any,mail:any) {
    const apiUrl = `${this.prefix}admin/internal-email/reply/${id}?read=false`;
    return this.http.put<ApiResponse>(apiUrl, mail).pipe(map((response) => { }));
  }


  deleteMailForever(mail: any){
    const apiUrl = `${this.prefix}admin/internal-email/delete`;
    return this.http.post<ApiResponse>(apiUrl,mail);
  }




  getForgetPasswordTemplate = (data?:any): Observable<any> => {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const endpoint = `${this.prefix}admin/emailConfiguration/getForgetPasswordTemplate?companyId=${userId}`;
    return this.http.get(endpoint).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

createEmailTemplate=(data:any): Observable<any> => {
  let endpoint = environment.apiUrl+`admin/emailConfiguration/createEmail`;

  // if (Id) {
  //   endpoint += `?id=${Id}`;
  // }
  return this.http.post(endpoint, data).pipe(
    catchError((err) => {
      return throwError(err);
    })
  );
};

createCompanyEmailTemplate=(data:any): Observable<any> => {
  let endpoint = `${this.Companyprefix}x-api/v1/public/createEmail`;

  // if (Id) {
  //   endpoint += `?id=${Id}`;
  // }
  return this.http.post(endpoint, data).pipe(
    catchError((err) => {
      return throwError(err);
    })
  );
};


  updateForgetPasswordTemplate = (data:any,Id?:any): Observable<any> => {
    let endpoint = environment.apiUrl+`admin/emailConfiguration/updateForgetPasswordTemplate?id=${Id}`;

    // if (Id) {
    //   endpoint += `?id=${Id}`;
    // }
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
}
