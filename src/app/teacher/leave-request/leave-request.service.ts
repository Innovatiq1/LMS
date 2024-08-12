import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LeaveRequest } from './leave-request.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { environment } from 'environments/environment';
@Injectable()
export class InstructorLeaveRequestService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/leaveRequest.json';
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
  getAllLeaveRequest(id:any): void {
    const apiUrl = `${this.defaultUrl}admin/leave/instructorList/${id}`;
    this.subs.sink = this.httpClient
      .get<any>(apiUrl)
      .subscribe({
        next: (response) => {
          this.isTblLoading = false;
          this.dataChange.next(response.data.docs);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + ' ' + error.message);
        },
      });
  }
  addLeaveRequest(leaveRequest: LeaveRequest): void {
    this.dialogData = leaveRequest;

    // this.httpClient.post(this.API_URL, leaveRequest)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = leaveRequest;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  // updateLeaveRequest(leaveRequest: LeaveRequest,id:any): void {
  //   this.dialogData = leaveRequest;
  //   const apiUrl = `${this.defaultUrl}admin/leave/${id}`;

  //   this.httpClient.put(apiUrl, leaveRequest)
  //       .subscribe({
  //         next: (data) => {
  //           this.dialogData = leaveRequest;
  //         },
  //         error: (error: HttpErrorResponse) => {
  //            // error code here
  //         },
  //       });
  // }  
  updateLeaveRequest(leaveRequest: LeaveRequest, id: any): void {
    const apiUrl = `${this.defaultUrl}admin/leave/${id}`;

    this.httpClient.put(apiUrl, leaveRequest)
      .subscribe({
        next: (data) => {
          // Update dialog data
          this.dialogData = leaveRequest;

          // Find and update the item in the current data
          const updatedData = this.data.map(item =>
            item.id === id ? leaveRequest : item
          );

          // Emit the new data
          this.dataChange.next(updatedData);
        },
        error: (error: HttpErrorResponse) => {
          // Handle error
          console.error('Error updating leave request', error);
        },
      });
  }
  
  deleteLeaveRequest(id: number): void {
    

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
