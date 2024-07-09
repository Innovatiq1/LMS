import { formatDate } from '@angular/common';
export class LeaveRequest {
  id: number;
  img: string;
  rNo: string;
  name: string;
  fromDate: string;
  applyDate:string;
  toDate: string;
  status: string;
  reason: string;
  rollNo:string;
  className:string;
  //studentId:any;
  data:any;
  docs:any;
  studentId: any;
  classId: any;
  constructor(leaveRequest: LeaveRequest) {
    {
      this.id = leaveRequest.id || this.getRandomID();
      this.img = leaveRequest.img || 'assets/images/user/user1.jpg';
      this.rNo = leaveRequest.rNo || '';
      this.name = leaveRequest.name || '';
      this.rollNo = leaveRequest.rollNo || '';
      this.className = leaveRequest.className || '';
      this.applyDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.fromDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.toDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.status = leaveRequest.status || '';
      this.reason = leaveRequest.reason || '';
      this.docs = leaveRequest.docs || [];
      this.data = leaveRequest.data || {};
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
