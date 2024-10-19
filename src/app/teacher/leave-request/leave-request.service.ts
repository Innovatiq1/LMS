import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { LeaveRequest } from './leave-request.model';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { environment } from 'environments/environment';
import { Logger } from '@core/service/logger.service';
import { CoursePaginationModel } from '@core/models/course.model';
const Logging = new Logger('AnnouncementService');

@Injectable()
export class InstructorLeaveRequestService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/leaveRequest.json';
  defaultUrl = environment['apiUrl'];
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
      if (filter.title) {
        params = params.set("title", filter.title?.toString());
      }
      if (filter.feeType) {
        params = params.set("feeType", filter.feeType);
      }
      if (filter.datefilter) {
        params = params.set("datefilter", filter.datefilter);
      }

      if (filter.status && filter.status === "active") {
        params = params.set("status", "active");
      } else if (filter.status && filter.status === "inactive") {
        params = params.set("status", "inactive");
      }
      if(filter.companyId) {
        params = params.set('companyId', filter.companyId)
      }
      if(filter.isAll) {
        params = params.set('isAll', filter.isAll)
      }
      if(filter.announcementFor) {
        params = params.set('announcementFor', filter.announcementFor)
      }
    }
    return params;
  }

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
  getLeaveRequestList = (filter: any,id:string): Observable<any> => {
    const apiUrl = `${this.defaultUrl}admin/leave/instructorList/${id}`;
    return this.httpClient.get(apiUrl, { params: this.buildParams(filter) }).pipe(
      map((response: any) => {
        this.isTblLoading = false;
        Logging.debug(response);
        return response.data;
      }),
      catchError((error: HttpErrorResponse) => {
        this.isTblLoading = false;
        return throwError(() => new Error('Error fetching leave requests'));
      })
    );
  };
  
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
