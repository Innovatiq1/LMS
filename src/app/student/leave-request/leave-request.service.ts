import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LeaveRequest } from './leave-request.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { environment } from 'environments/environment.development';
import { ApiResponse } from '@core/models/response';
@Injectable()
export class LeaveRequestService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/stdLeaveReq.json';
  defaultUrl = environment['apiUrl'];

  isTblLoading = true;
  dataChange: BehaviorSubject<LeaveRequest[]> = new BehaviorSubject<
    LeaveRequest[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: LeaveRequest;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): LeaveRequest[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllLeavesByStudentId(id:any,learnerId:any): void {
    const apiUrl = `${this.defaultUrl}admin/leave/${id}/${learnerId}`;
    this.subs.sink = this.httpClient
      .get<any>(apiUrl)
      .subscribe({
        next: (response) => {
          this.isTblLoading = false;
          this.dataChange.next(response.data.docs);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
        },
      });
  }


  getLeavesById(id:any): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/leave/${id}`;
    return this.httpClient.get<ApiResponse>(apiUrl).pipe(
      map((response) => {
        return response;
      })
    );
  }

  addLeaveRequest(leaveRequest: any): void {
    this.dialogData = leaveRequest;
    const apiUrl = `${this.defaultUrl}admin/leave`;
    this.httpClient.post(apiUrl, leaveRequest)
      .subscribe({
        next: (data) => {
          this.dialogData = leaveRequest;
        },
        error: (error: HttpErrorResponse) => {
           // error code here
        },
      });
  }
  updateLeaveRequest(leaveRequest: any,id:any): void {
    this.dialogData = leaveRequest;
    const apiUrl = `${this.defaultUrl}admin/leave/${id}`;

    this.httpClient.put(apiUrl, leaveRequest)
        .subscribe({
          next: (data) => {
            this.dialogData = leaveRequest;
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        });
  }  
  
  deleteLeaveRequest(id: number) {
    const apiUrl = `${this.defaultUrl}admin/leave/${id}`;
    return this.httpClient
      .delete<any>(apiUrl)
      .pipe(map((response: any) => response));
  }
}
