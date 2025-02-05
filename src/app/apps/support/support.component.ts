import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SupportService } from './support.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CourseModel, CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'ticket', 'status', 'date'];
  count: any;
  dataSource: any;
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  currentFilter: string = 'all';

  // coursePaginationModel: Partial<CoursePaginationModel>;
  totalTicketsPagination: Partial<CoursePaginationModel> = {};
  resolvedPagination: Partial<CoursePaginationModel> = {};
  pendingPagination: Partial<CoursePaginationModel> = {};

  coursePaginationModel: Partial<CoursePaginationModel> = {};
  totalItems: any;
  totalTickets:any;
  pageSizeArr = [10, 20, 50, 100];
  @Input() dashboardCpm : any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  breadscrums = [
    {
      title: 'Support',
      items: ['Apps'],
      active: 'Support',
    },
  ];
  resolved: any;
  pending: any;
  openData: any;
  constructor(private ticketService: SupportService, public router: Router) {
    //constructor
    // this.coursePaginationModel = {};
    this.getCount();
  }
  ngOnInit() {
    // this.listOfTicket();
    this.getCount();
    this.getfilterd('all');
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page= $event?.pageIndex + 1;
    this.coursePaginationModel.limit= $event?.pageSize;
    this.listOfTicket();
   }
   getCount() {
    this.ticketService.getCount().subscribe(response => {
      this.count = response?.data;
      console.log(this.count);
      this.resolved=this.count?.resolved;
      this.pending=this.count?.pending;
    })
       
  }
  // listOfTicket() {
  //   this.ticketService.getAllTickets({ ...this.coursePaginationModel }).subscribe((res) => {
  //     this.dataSource = res.data.docs;
  //     this.totalTickets = res.data.totalDocs;
  //     this.totalItems = res.data.totalDocs;
  //     this.coursePaginationModel.docs = res.data.docs;
  //     this.coursePaginationModel.page = res.data.page;
  //     this.coursePaginationModel.limit = res.data.limit;
  //     this.coursePaginationModel.totalDocs = res.data.totalDocs;
  //   });
  // }
//new one
  // listOfTicket() {
  //   // this.coursePaginationModel.status = "closed";
  //   this.ticketService.getAllTickets({ ...this.coursePaginationModel }).subscribe((res) => {
  //     this.coursePaginationModel.docs = res.data.docs;
  //     this.totalTickets = res.data.totalDocs;
  //     this.totalItems = res.data.totalDocs;
  //     this.coursePaginationModel.page = res.data.page;
  //     this.coursePaginationModel.limit = res.data.limit;
  //     this.coursePaginationModel.totalDocs = res.data.totalDocs;
  //     this.dataSource = this.coursePaginationModel.docs;  
  //   });
  // }
  //updated code 

  listOfTicket() {
    this.ticketService.getAllTickets({ ...this.coursePaginationModel }).subscribe(res => {
      this.dataSource = res.data.docs;
      if(this.coursePaginationModel.status!='closed'&&this.coursePaginationModel.status!=='open')
      {
        this.totalTickets = res.data.totalDocs;
      }
      
      this.totalItems = res.data.totalDocs;

      // Update the pagination model
      this.coursePaginationModel.docs = res.data.docs;
      this.coursePaginationModel.page = res.data.page;
      this.coursePaginationModel.limit = res.data.limit;
      this.coursePaginationModel.totalDocs = res.data.totalDocs;
    });
  }

  // getfilterd(status: string) {
  //   if (status === 'all') {
  //     this.dataSource = this.coursePaginationModel.docs ?? [];
  //   } else {
  //     this.dataSource = this.coursePaginationModel.docs?.filter((data: { status: string }) => data.status === status) ?? [];
  //   }
  // }
  //newOne
  // getfilterd(status: string) {
  //   if(status==='open')
  //   {
  //     this.coursePaginationModel.status = "open";
  //     this.listOfTicket();

  //   }
  //   else if (status === 'all') {
  //     this.listOfTicket(); 
  //   } 
  //   else if(status==='closed'){
  //     this.coursePaginationModel.status = "closed";
  //     this.listOfTicket();
      
  //   }
  //   else{
  //     this.dataSource = this.coursePaginationModel.docs?.filter((data: { status: string }) => data.status === status) ?? [];
  //     this.totalItems = this.dataSource.length;
  //     this.paginator.pageIndex = 0;
  //   }
  // }
  getfilterd(status: string) {
    this.currentFilter = status;
    
    // Reset paginator on filter change
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    switch (status) {
      case 'all':
        this.coursePaginationModel = this.totalTicketsPagination;
        break;
      case 'closed':
        this.coursePaginationModel = this.resolvedPagination;
        this.coursePaginationModel.status = 'closed';
        break;
      case 'open':
        this.coursePaginationModel = this.pendingPagination;
        this.coursePaginationModel.status = 'open';
        break;
      default:
        this.coursePaginationModel = this.totalTicketsPagination;
    }

    this.listOfTicket();
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
