import { Component } from '@angular/core';
import { CoursePaginationModel } from '@core/models/course.model';
import { UtilsService } from '@core/service/utils.service';

@Component({
  selector: 'app-corp-staff-list',
  templateUrl: './corp-staff-list.component.html',
  styleUrls: ['./corp-staff-list.component.scss'],
})
export class CorpStaffListComponent {
  displayedColumns: string[] = [
    // 'select',
    'img',
    'Name',
    'User Type',
    'gender',
    'department',
    'Status',
    // 'Actions'
  ];
  breadscrums = [
    {
      title: 'All User',
      items: ['Dashboard'],
      active: 'Staff',
    },
  ];

  isLoading = true;

  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  typeName?: any;
  headId: any;
  staff: any = [];
  constructor(public utils: UtilsService) {
    this.coursePaginationModel = {};
  }

  ngOnInit(): void {
    this.staff = history.state.staff;
    console.log('stafdfff', this.staff);
    if (this.staff.length !== 0) {
      this.isLoading = false;
    }
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
  }
}
