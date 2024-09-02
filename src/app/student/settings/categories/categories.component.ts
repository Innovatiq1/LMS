import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  CourseModel,
  CoursePaginationModel,
  SubCategory,
} from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthenService } from '@core/service/authen.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  displayedColumns: string[] = [
    // 'select',
    'Main Category',
    'Sub Category',
    // 'status',
  ];
  breadscrums = [
    {
      title: 'Categories',
      items: ['Configuration'],
      active: 'Categories',
    },
  ];

  
  subCategoryForm!: FormGroup;
  mainCategoryForm!: FormGroup;
  mainCategoryId: string = '';
  isSubmitted = false;
  validations = false;
  subCategoryData: SubCategory[] = [];
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  list: boolean = true;
  create: boolean = true;
  dataSource: any;
  isLoading = true;
  selection = new SelectionModel<CourseModel>(true, []);
  subCategory = [];
  data: any;
  searchTerm: string = '';
  isCreate = false;
  isView = false;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private formBuilder: FormBuilder,
    public utils: UtilsService,
    private snackBar: MatSnackBar,
    private authenService: AuthenService
  ) {
    this.coursePaginationModel = {};
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  ngOnInit(): void {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath[3]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let viewAction = actions.filter((item:any) => item.title == 'View')
  
    if(createAction.length >0){
      this.isCreate = true;
    }
    if(viewAction.length >0){
      this.isView = true;
    }
    this.fetchSubCategories();
  }
  fetchSubCategories(): void {
    this.courseService
      .getMainCategoriesWithPagination({ ...this.coursePaginationModel })
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.dataSource = response.data.docs;
          this.totalItems = response.data.totalDocs;
          this.coursePaginationModel.docs = response.data.docs;
          this.coursePaginationModel.page = response.data.page;
          this.coursePaginationModel.limit = response.data.limit;
        },
        (error) => {
          console.error('Failed to fetch categories:', error);
        }
      );
  }

  deleteItem(item: any) {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCategory(item._id).subscribe(
          () => {
            Swal.fire({
              title: "Deleted",
              text: "Category deleted successfully",
              icon: "success",
            });
            this.fetchSubCategories();
          },
          (error: { message: any; error: any; }) => {
            Swal.fire(
              "Failed to delete course kit",
              error.message || error.error,
              "error"
            );
          }
        );
      }
    });
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.fetchSubCategories();
  }
 

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: CourseModel) =>
          this.selection.select(row)
        );
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;

    
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed){
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
        });
      }
    });

  }
edit(id:any){
  this.router.navigate(['/student/settings/edit-categories/'+ id]);
}

performSearch() {
  if(this.searchTerm){
  this.dataSource = this.dataSource?.filter((item: any) =>{  
    const search = (item.category_name + item?.subCategories[0]?.category_name).toLowerCase()
    return search.indexOf(this.searchTerm.toLowerCase())!== -1;
    
  }
  );
  } else {
     this.fetchSubCategories();

  }
}
exportExcel() {
  const exportData: any[] = [];
  this.dataSource.forEach((user: any) => {
    if (user?.subCategories?.length > 0) {
      user.subCategories.forEach((category: any) => {
        exportData.push({
          'Main Category': user.category_name,
          'Sub Category': category.category_name
        });
      });
    } else {
      exportData.push({
        'Main Category': user.category_name,
        'Sub Category': ''
      });
    }
  });

  TableExportUtil.exportToExcel(exportData, 'Categories-list');
}

generatePdf() {
  const doc = new jsPDF();
  const headers = [['Main Category','Sub Category']];
  
  const data = this.dataSource.map((user:any) =>
    [user.category_name,
      user?.subCategories.map((category: any) => category.category_name),
  ] );
  const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
  (doc as any).autoTable({
    head: headers,
    body: data,
    startY: 20,



  });

  doc.save('Categories-list.pdf');
}

}
