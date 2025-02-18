import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '@core/service/dataservice.service';


@Component({
  selector: 'app-assesment',
  templateUrl: './assesment.component.html',
  styleUrls: ['./assesment.component.scss']
})
export class AssesmentComponent {
  displayedColumns: string[] = [
    // 'select',
    'Submitted Date',
    'Total Score',
    'User scored',
  ];
  breadscrums = [
    {
      title: 'All User',
      items: ['All Users'],
      active: 'Tutorials List',
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
  courseName!: string ;

  constructor(private router: Router,
    public utils: UtilsService,
    private alluserService: UserService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,private dataService: DataService

  ) {

    this.coursePaginationModel = {};
}

@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
@ViewChild('filter', { static: true }) filter!: ElementRef;



ngOnInit(): void {
  const tutorialData = this.dataService.getData('assesmentData');
  if (tutorialData) {
    const { studentId, courseId, courseName } = tutorialData;
    this.getAssesmentAnswers(studentId, courseId.id);
    this.courseName = courseName;
  } else {
    console.log('No tutorial data found.');
  }
}

pageSizeChange($event: any) {
  this.coursePaginationModel.page = $event?.pageIndex + 1;
  this.coursePaginationModel.limit = $event?.pageSize;

}
getAssesmentAnswers(studenId: string, courseId: string){
  this.alluserService.getAssesmentAnswers(studenId, courseId).subscribe(answers =>{
    this.dataSource = answers.details;
    this.isLoading = false;
    this.ref.detectChanges();
  })
}
private refreshTable() {
  this.paginator._changePageSize(this.paginator.pageSize);
}
/** Whether the number of selected elements matches the total number of rows. */
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
    text: "Are you sure you want to delete selected records?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
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
performSearch() {
}
edit(row:any){
this.router.navigate(['/admin/users/edit-all-users'], {queryParams:{row:row}})
}
exportExcel() {
  //k//ey name with space add in brackets
 const exportData: Partial<TableElement>[] = this.dataSource.map(
   (user: any) => ({
     'Name': user.name,
     'Role': user.type,
     'Gender':  user.gender,
     'Qualification': user.qualification,
     'Mobile': user.mobile,
     'Email': user.email,
     'Status' : user.Active ?  'Active': 'Inactive' 
   })
 );
  TableExportUtil.exportToExcel(exportData, 'AllUsers-list');
}

generatePdf() {
  const doc = new jsPDF();
  const headers = [['Name       ','Role       ','Gender','Qualification','Mobile','Email','Status']];
  const data = this.dataSource.map((user:any) =>
    [user.name,
      user.type,
      user.gender,
     user.qualification,
     user.mobile,
     user.email,
     user.Active ? 'Active': 'Inactive'
  ] );
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
}
