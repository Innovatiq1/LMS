import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateSuperAdminComponent } from '../create-super-admin/create-super-admin.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '@core/service/utils.service';
import { UserService } from '@core/service/user.service';
import { CourseService } from '@core/service/course.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import {
  TableElement,
  TableExportUtil,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import jsPDF from 'jspdf';
import { Direction } from '@angular/cdk/bidi';
import { RoleDailogComponent } from 'app/student/settings/all-users/role-dailog/role-dailog.component';
import { Users } from '@core/models/user.model';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent  extends UnsubscribeOnDestroyAdapter{
  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Super Admin'],
      active: 'Companies List',
    },
  ];
  displayedColumns: string[] = [
    // 'select',
    // 'img',
    'Company',
    'Name',
    'Website',
    'User Type',
   // 'gender',
   // 'Qualification',
    'Mobile',
    'Email',
    'Status',
    // 'Actions'
  ];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  selection = new SelectionModel<CourseModel>(true, []);
  // coursePaginationModel!: Partial<CoursePaginationModel>;
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
  constructor(
    private dialog: MatDialog,
    public utils: UtilsService,
    private alluserService: UserService,
    private ref: ChangeDetectorRef,
    private courseService: CourseService,
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
    let filterText = this.searchTerm;
    this.alluserService
      .getAdminsList({
        filterText,
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
  // createAdmin() {
  //   this.dialog.open(CreateSuperAdminComponent);
  // }
  resetData() {
    this.dataSource = [];
    this.filteredData = [];
    this.totalItems = 0;
    this.coursePaginationModel.page = 1;
  }

  createAdmin() {
    this.router.navigate(['super-admin/create-admin']);
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;

    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete selected records?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.selection.selected.forEach((item) => {
          const index: number = this.dataSource.findIndex(
            (d: CourseModel) => d === item
          );

          this.courseService?.dataChange.value.splice(index, 1);
          this.refreshTable();
          this.selection = new SelectionModel<CourseModel>(true, []);
        });
        Swal.fire({
          title: 'Success',
          text: 'Record Deleted Successfully...!!!',
          icon: 'success',
          // confirmButtonColor: '#526D82',
        });
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  performSearch() {
    this.isLoading = true;
    this.coursePaginationModel.page = 1;
    this.searchResults = [];
    this.searchData(this.coursePaginationModel.page);
  }
  searchData(page: number = 1) {
    let filterText = this.searchTerm;
    this.alluserService
      .getUserList({
        filterText,
        page,
        limit: this.coursePaginationModel.limit,
      })
      .subscribe(
        (response: any) => {
          this.searchResults = [...this.searchResults, ...response.data.data];

          if (this.searchResults.length < response.data.total) {
            this.searchData(page + 1);
          } else {
            this.filteredData = this.searchResults.filter(
              (data) => data.type === 'admin'
            );
            this.updateDisplayedData();
            this.isLoading = false;
            this.ref.detectChanges();
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('Error fetching search results:', error);
        }
      );
  }
  exportExcel() {
    //k//ey name with space add in brackets
    const exportData: Partial<TableElement>[] = this.filteredData.map(
      (user: any) => ({
        Name: user.name,
        Role: user.type,
        Gender: user.gender,
        Qualification: user.qualification,
        Mobile: user.mobile,
        Email: user.email,
        Status: user.Active ? 'Active' : 'Inactive',
      })
    );
    TableExportUtil.exportToExcel(exportData, 'AllUsers-list');
  }
  addNew(type: any) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(RoleDailogComponent, {
      data: {
        typeName: type,
      },
      direction: tempDirection,
    });
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        'Name       ',
        'Role       ',
        'Gender',
        'Qualification',
        'Mobile',
        'Email',
        'Status',
      ],
    ];
    const data = this.filteredData.map((user: any) => [
      user.name,
      user.type,
      user.gender,
      user.qualification,
      user.mobile,
      user.email,
      user.Active ? 'Active' : 'Inactive',
    ]);
    //const columnWidths = [60, 80, 40];
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];

    // Add a page to the document (optional)
    //doc.addPage();

    // Generate the table using jspdf-autotable
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });

    // Save or open the PDF
    doc.save('AllUsers-list.pdf');
  }

  editAdmin(id:string){
    this.router.navigate(['super-admin/view-admin'],{queryParams: {id:id}});
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.fetchData(); // Call method to update displayed data
  }
}
