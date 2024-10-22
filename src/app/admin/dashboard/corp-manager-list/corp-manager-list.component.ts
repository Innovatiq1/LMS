import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { UtilsService } from '@core/service/utils.service';

@Component({
  selector: 'app-corp-manager-list',
  templateUrl: './corp-manager-list.component.html',
  styleUrls: ['./corp-manager-list.component.scss']
})
export class CorpManagerListComponent {
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
      items: ['User Profile'],
      active: 'Managers',
    },
  ];
  create = true;
  status = true;
  dataSource: any;
  response: any;
  isLoading = true;
  selection = new SelectionModel<CourseModel>(true, []);
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  searchTerm:string = '';
  pageSizeArr = this.utils.pageSizeArr;
  typeName?: any;
  headId: any;

  constructor(
    public utils: UtilsService,
   
  ) {

    this.coursePaginationModel = {};
}

@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
@ViewChild('filter', { static: true }) filter!: ElementRef;


managers: any = [];
 
  ngOnInit() {
    this.managers = history.state.managersList; 
    if(this.managers.length !== 0) {
      this.isLoading = false;
    }
  }



pageSizeChange($event: any) {
  this.coursePaginationModel.page = $event?.pageIndex + 1;
  this.coursePaginationModel.limit = $event?.pageSize;


}

}
