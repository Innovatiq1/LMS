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
        },
      });
  }
  addLeaveRequest(leaveRequest: LeaveRequest): void {
    this.dialogData = leaveRequest;
  }
  updateLeaveRequest(leaveRequest: LeaveRequest, id: any): void {
    const apiUrl = `${this.defaultUrl}admin/leave/${id}`;

    this.httpClient.put(apiUrl, leaveRequest)
      .subscribe({
        next: (data) => {
          this.dialogData = leaveRequest;
          const updatedData = this.data.map(item =>
            item.id === id ? leaveRequest : item
          );
          this.dataChange.next(updatedData);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating leave request', error);
        },
      });
  }
  
  deleteLeaveRequest(id: number): void {
  }
}
