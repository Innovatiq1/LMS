import { ChangeDetectorRef, Component } from '@angular/core';
import { Users } from '@core/models/user.model';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CourseModel } from '@core/models/course.model';
import { SuperAdminService } from '../super-admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-customize',
  templateUrl: './role-customize.component.html',
  styleUrls: ['./role-customize.component.scss'],
})
export class RoleCustomizeComponent {
  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Super Admin'],
      active: 'Role Customization',
    },
  ];
  selection = new SelectionModel<CourseModel>(true, []);
  searchTerm: string = '';
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
  displayedColumns: string[] = [
    'Company',
    'learner',
    'trainer',
  ];
  constructor(
    public utils: UtilsService,
    private alluserService: UserService,
    private ref: ChangeDetectorRef,
    private superadminservice: SuperAdminService, public router: Router
  ) {}


  ngOnInit() {
    this.getAllCustomRoles();
  }

  performSearch() {
    this.isLoading = true;
    this.coursePaginationModel.page = 1;
    this.searchResults = [];
    // this.searchData(this.coursePaginationModel.page);
  }

  // searchData(page: number = 1) {
  //   let filterText = this.searchTerm;
  //   this.alluserService
  //     .getUserList({
  //       filterText,
  //       page,
  //       limit: this.coursePaginationModel.limit,
  //     })
  //     .subscribe(
  //       (response: any) => {
  //         this.searchResults = [...this.searchResults, ...response.data.data];

  //         if (this.searchResults.length < response.data.total) {
  //           this.searchData(page + 1);
  //         } else {
  //           this.filteredData = this.searchResults.filter(
  //             (data) => data.type === 'admin'
  //           );
  //           this.updateDisplayedData();
  //           this.isLoading = false;
  //           this.ref.detectChanges();
  //         }
  //       },
  //       (error) => {
  //         this.isLoading = false;
  //         console.error('Error fetching search results:', error);
  //       }
  //     );
  // }

  viewPackage(id:string){
console.log('viewPackage', id);
this.router.navigate(['super-admin/edit-customization'],{queryParams: {id:id}});
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    // this.fetchData(); 
  }
getAllCustomRoles(){
  this.superadminservice.getAllCustomRole().subscribe((response: any) => {

    console.log(response);
    this.filteredData = response.data.docs;
    // this.coursePaginationModel.docs = response.data;
    // this.filteredData = this.coursePaginationModel.docs;
    this.isLoading = false;
    this.ref.detectChanges();
  }, (error: any) => {
    this.isLoading = false;
    console.error('Error fetching search results:', error);
  });
}
}
