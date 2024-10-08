import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SupportService } from 'app/apps/support/support.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CourseModel, CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-listofticket',
  templateUrl: './listofticket.component.html',
  styleUrls: ['./listofticket.component.scss']
})
export class ListofticketComponent {
  displayedColumns: string[] = ['name', 'ticket', 'status', 'date'];
  count: any;
  dataSource: any;
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  coursePaginationModel: Partial<CoursePaginationModel>;
  totalItems: any;
  totalTickets:any;
  pageSizeArr = [10, 2, 50, 100];
  @Input() dashboardCpm : any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  breadscrums = [
    {
      title: 'Support',
      items: ['Apps'],
      active: 'Tickets List',
    },
  ];
  resolved: any;
  pending: any;
  openData: any;
  data: any;
  constructor(private ticketService: SupportService, public Acrouter: ActivatedRoute, public router: Router) {
    //constructor
    this.coursePaginationModel = {};
  }
  ngOnInit() {
    this.Acrouter.queryParams.subscribe(param =>{
      const dataStr = param['data'];
      this.data = JSON.parse(dataStr);
      console.log("dtable JSON string:", this.data);
     })
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page= $event?.pageIndex + 1;
    this.coursePaginationModel.limit= $event?.pageSize;
   }
   


  view(id: any) {
    this.router.navigate(['apps/inbox'],{queryParams:{id:id}});
  }


}
