import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lectures } from './lectures.model';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CoursePaginationModel } from '@core/models/course.model';
import { ApiResponse } from '@core/models/response';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
@Injectable()
export class LecturesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/lectures.json';
  private prefix: string = environment.apiUrl;
  isTblLoading = true;
  dataChange: BehaviorSubject<Lectures[]> = new BehaviorSubject<Lectures[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Lectures;
  constructor(private httpClient: HttpClient,
    private route :Router) {
    super();
  }
  get data(): Lectures[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  getClassListWithPagination(id: any,filterName:any,filter?:Partial<CoursePaginationModel>) {
    const apiUrl = `${this.prefix}admin/class/getSession/${id}?filterName=${filterName}`;
    return this.httpClient.get<ApiResponse>(apiUrl,{ params: this.buildParams(filter) })
    
    //return this.httpClient.get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
  }
  getClassListWithPagination1(id: any,filterName:any,filter?:Partial<CoursePaginationModel>) {
    
    const apiUrl = `${this.prefix}admin/class/getProgramSession/${id}?filterName=${filterName}`;
    return this.httpClient.get<ApiResponse>(apiUrl,{ params: this.buildParams(filter) })
    
    //return this.httpClient.get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
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
  /** CRUD METHODS */
  getAllLecturess(): void {
    this.subs.sink = this.httpClient.get<Lectures[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
      },
    });
  }
  addLectures(lectures: Lectures): void {
    this.dialogData = lectures;

    // this.httpClient.post(this.API_URL, lectures)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = lectures;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  updateProgramLectures(lectures: Lectures): void {
    this.dialogData = lectures;
    let apiUrl = `${this.prefix}admin/class/updateProgramSession`;

    this.httpClient.post(apiUrl, lectures)
        .subscribe({
          next: (data) => {
            this.dialogData = lectures;
            //this.getClassListWithPagination()
            //this.route.navigateByUrl("/instructor/lectures")

          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        });
  }
  updateLectures(lectures: Lectures): void {
    this.dialogData = lectures;
    let apiUrl = `${this.prefix}admin/class/updateSession`;

    this.httpClient.post(apiUrl, lectures)
        .subscribe({
          next: (data) => {
            this.dialogData = lectures;
            //this.getClassListWithPagination()
            //this.route.navigateByUrl("/instructor/lectures")

          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        });
  }
  deleteLectures(id: number): void {
    

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
}
