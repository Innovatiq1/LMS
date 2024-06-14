import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilsService } from '@core/service/utils.service';
import { UserService } from '@core/service/user.service';
import { CourseService } from '@core/service/course.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CourseModel } from '@core/models/course.model';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import {
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { Users } from '@core/models/user.model';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss'],
})
export class SuperAdminComponent extends UnsubscribeOnDestroyAdapter {
  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Dashboard'],
      active: 'Super Admin Dashboard',
    },
  ];

 
  dataSource: any[] = [];
  filteredData: any[] = [];
  isLoading: boolean = true;
  searchResults: Users[] = [];
  totalItems: number = 0;
  pageSizeArr = this.utils.pageSizeArr;
  coursePaginationModel = {
    page: 1,
    limit: 100, // Adjust as necessary
    docs: [] as Users[], //
  };
  id: any;
  activeCount: number = 0;
  inactiveCount: number = 0;
  constructor(
    public utils: UtilsService,
    private alluserService: UserService,
    private ref: ChangeDetectorRef,
    public router: Router
  ) {
    super();
  }
  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe((params: any) => {
    //   this.getBlogsList(params);
    // });

    this.getAllData();
  }

  getAllData() {
    this.isLoading = true;
    this.fetchData(this.coursePaginationModel.page);
  }

  fetchData(page?: number) {
    this.resetData()
    this.alluserService
      .getUserList({
        page,
        limit: this.coursePaginationModel.limit,
      })
      .subscribe(
        (response: any) => {
          this.dataSource = [...this.dataSource, ...response.data.data];
          this.totalItems = this.dataSource.length;

          if (this.dataSource.length < this.totalItems) {
            this.coursePaginationModel.page += 1;
            this.fetchData(this.coursePaginationModel.page);
          } else {
            this.applyFilter();
            this.isLoading = false;
            this.ref.detectChanges();
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('Error fetching data:', error);
        }
      );
  }
  updateDisplayedData() {
    const startIndex =
      (this.coursePaginationModel.page - 1) * this.coursePaginationModel.limit;
    const endIndex = startIndex + this.coursePaginationModel.limit;
    this.coursePaginationModel.docs = this.filteredData.slice(
      startIndex,
      endIndex
    );
    this.ref.detectChanges();
  }
  applyFilter() {
    this.filteredData = this.dataSource.filter(
      (data) => data.type === 'Admin' || data.type === 'admin'
    );
    let active = this.filteredData.filter(data => data.Active === true);
    this.activeCount = active.length;
    let in_active = this.filteredData.filter(data => data.Active === false);
    this.inactiveCount = in_active.length;
    this.totalItems = this.filteredData.length;
    console.log('Filtered Data', this.filteredData);
    this.updateDisplayedData();
  }
  resetData() {
    this.dataSource = [];
    this.filteredData = [];
    this.totalItems = 0;
    this.coursePaginationModel.page = 1;
  }



 
  


}
