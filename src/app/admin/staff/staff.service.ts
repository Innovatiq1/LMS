import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, pipe } from 'rxjs';
import { Staff } from './staff.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { environment } from 'environments/environment';
import { ApiResponse } from '@core/models/response';
@Injectable()
export class StaffService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/staff.json';
  private apiUrl = 'http://localhost:3000/api/';
  private prefix: string = environment.apiUrl;
  isTblLoading = true;
  dataChange: BehaviorSubject<Staff[]> = new BehaviorSubject<Staff[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Staff;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Staff[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  // const apiUrl = this.defaultUrl + 'admin/adminUserListing';
  getAllStaffs(id:any): void {
   // let userId = localStorage.getItem('id');
    const apiUrl = `${this.prefix}admin/adminUserListing?companyId=${id}`;
    this.subs.sink = this.httpClient.get<Staff>(apiUrl).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
      },
    });
  }
  getAllStaff(){
    const apiUrl = `${this.prefix}admin/adminUserListing/`;
    return this.httpClient.get<Staff>(apiUrl).pipe(map(response => response))
  }

  // saveStaff(course: any) {
  //   const apiUrl = `${this.prefix}admin/staff/`;
  //   return this.httpClient
  //     .post<ApiResponse>(apiUrl, course)
  //     .pipe(map((response) => { }));
  // }

  // updateStaff(id:any,course: any) {
  //   const apiUrl = `${this.prefix}admin/staff/${id}`;
  //   return this.httpClient
  //     .put<ApiResponse>(apiUrl, course)
  //     .pipe(map((response) => { }));
  // }

  // deleteStaff(id:any){
  //   const apiUrl = `${this.prefix}admin/staff/${id}`;
  //   return this.httpClient.delete(apiUrl).pipe(map((response) => { }))
  // }

  deleteStaff(id: any): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(`${this.prefix}admin/adminUserListing/${id}`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  addStaff(staff: Staff): void {
    this.dialogData = staff;

    // this.httpClient.post(this.API_URL, staff)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = staff;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  // updateStaff(staff: Staff): void {
  //   this.dialogData = staff;

    // this.httpClient.put(this.API_URL + staff.id, staff)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = staff;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  // }
  // deleteStaff(id: number): void {
  //   


    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  // }
}
