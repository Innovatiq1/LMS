import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SupportService } from './support.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CourseModel, CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
// export interface PeriodicElement {
//   checked: boolean;
//   name: string;
//   subject: string;
//   status: string;
//   assignTo: string;
//   date: string;
//   action: string;
// }
// const ELEMENT_DATA: PeriodicElement[] = [
//   {
//     checked: false,
//     name: 'Tim Hank',
//     subject: 'Image not Proper',
//     status: 'closed',
//     assignTo: 'John Deo',
//     date: '27/05/2016',
//     action: '',
//   }

// ];
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'ticket', 'status', 'date'];
  count: any;
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource: any;
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  coursePaginationModel: Partial<CoursePaginationModel>;
  totalItems: any;
  // coursePaginationModel: Partial<CoursePaginationModel>;
  // dataSource: any;
  totalTickets:any;
  pageSizeArr = [10, 2, 50, 100];
  @Input() dashboardCpm : any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // 'status',
  // 'assignTo',
  // 'date',
  breadscrums = [
    {
      title: 'Support',
      items: ['Apps'],
      active: 'Support',
    },
  ];
  resolved: any;
  pending: any;
  constructor(private ticketService: SupportService, public router: Router) {
    //constructor
    this.coursePaginationModel = {};
    this.getCount();
    // this.coursePaginationModel.main_category = '0';
    // this.coursePaginationModel.sub_category = '0';
  }
  ngOnInit() {
    this.listOfTicket();
    this.getCount();
    // this.dataSource.paginator = this.paginator;
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page= $event?.pageIndex + 1;
    this.coursePaginationModel.limit= $event?.pageSize;
    this.listOfTicket();
   }
   getCount() {
    this.ticketService.getCount().subscribe(response => {
      this.count = response?.data;
      this.resolved=this.count?.resolved;
      this.pending=this.count?.pending;
      // this.studentCount=this.count?.students
      // this.chart4();
  
    })
       
  }
  listOfTicket() {
    this.ticketService.getAllTickets({ ...this.coursePaginationModel }).subscribe((res) => {
      this.dataSource = res.data.docs;
      this.totalTickets = this.dataSource.length;
      this.totalItems = res.data.totalDocs;
      this.coursePaginationModel.docs = res.data.docs;
      this.coursePaginationModel.page = res.data.page;
      this.coursePaginationModel.limit = res.data.limit;
      this.coursePaginationModel.totalDocs = res.data.totalDocs;
    });
  }

  view(id: any) {
    this.router.navigate(['apps/inbox'],{queryParams:{id:id}});
  }

  delete(id:string){

    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this ticket?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
    this.ticketService.deleteTicket(id).subscribe(res =>{
      this.listOfTicket();
    })
  }
  });
  }


}
