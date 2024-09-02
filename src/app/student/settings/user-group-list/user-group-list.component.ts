import { ChangeDetectorRef, Component, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';


@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent {

  displayedColumns: string[] = [
    'Group Name',
    'User Type',
  ];

  breadscrums = [
    {
      title: 'All Groups',
      items: ['Groups'],
      active: 'All Groups',
    },
  ];
  searchTerm:string = '';
  dataSource: any;
  selection = new SelectionModel<CourseModel>(true, []);
  coursePaginationModel!: Partial<CoursePaginationModel>;
  isLoading = true;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;




  constructor(private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    public utils: UtilsService,


  ) {

    this.coursePaginationModel = {};
}

@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
@ViewChild('filter', { static: true }) filter!: ElementRef;

getUserGroups(filters?:any) {
  this.userService.getUserGroups({...this.coursePaginationModel}).subscribe((response: any) => {
    this.dataSource = response.data.docs;
    this.isLoading = false;
    this.ref.detectChanges();
    this.totalItems = response.totalRecords
    this.coursePaginationModel.docs = response.docs;
    this.coursePaginationModel.page = response.page;
    this.coursePaginationModel.limit = response.limit;

  }, error => {
  });
}

ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe((params: any) => {
    this.getUserGroups(params);
  });
}

pageSizeChange($event: any) {
  this.coursePaginationModel.page = $event?.pageIndex + 1;
  this.coursePaginationModel.limit = $event?.pageSize;
  this.getUserGroups()

}

private refreshTable() {
  this.paginator._changePageSize(this.paginator.pageSize);
}

performSearch() {
  if(this.searchTerm){
  this.dataSource = this.dataSource?.filter((item: any) =>{
    const searchList = (item.type + item.qualification + item.name).toLowerCase()
    return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1
  }
  );
  } else {
    this.getUserGroups();

  }
}

}
