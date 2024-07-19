import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  VERSION,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseTitleModel } from '@core/models/class.model';
import { CoursePaginationModel } from '@core/models/course.model';
import { AdminService } from '@core/service/admin.service';
import { CourseService } from '@core/service/course.service';
import { InstructorService } from '@core/service/instructor.service';
import { UtilsService } from '@core/service/utils.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import Swal from 'sweetalert2';
import { SurveyService } from '../survey.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-likert-chart',
  templateUrl: './likert-chart.component.html',
  styleUrls: ['./likert-chart.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class LikertChartComponent {
  // name = 'Angular ' + VERSION.major;
  // selectcourse: boolean = false;
  // programData: any = [];
  // userTypeNames: any;
  // data:any;
  // starRating = 0;
  // currentRate = 3.14;
  breadscrums = [
    {
      title: 'Survey List',
      items: ['Survey'],
      active: 'Survey List',
    },
  ];
  selected = false;
  displayedColumns: string[] = [
    'Name',
    'Count',
    'Created At',
   ];
  dataSource: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  selection = new SelectionModel<any>(true, []);
  create = false;
  isView = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  // instructorList: any = [];
  // courseList!: CourseTitleModel[];
  // countNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // selectedIndex: number | undefined;
  // favoriteSeason?: string;
  // course: string[] = [
  //   'Strongly Disagree',
  //   'Disagree',
  //   'Normal',
  //   'Agree',
  //   'Strongly Agree',
  // ];
  // levelofcourse: string[] = [
  //   'Strongly Disagree',
  //   'Disagree',
  //   'Normal',
  //   'Agree',
  //   'Strongly Agree',
  // ];
  // expectations: string[]=[
  //   'Strongly Disagree',
  //   'Disagree',
  //   'Normal',
  //   'Agree',
  //   'Strongly Agree',
  // ];
  // subject : string[]=[
  //   'Strongly Disagree',
  //   'Disagree',
  //   'Normal',
  //   'Agree',
  //   'Strongly Agree',
  // ];
  constructor(
    private instructorService: InstructorService,
    private _classService: ClassService,
    private courseService: CourseService,
    private adminService: AdminService,
    public utils: UtilsService,
    public surveyService: SurveyService,
    private router: Router,
    private authenService: AuthenService
  ) {
    this.coursePaginationModel = {};
    // constructor
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(createAction.length >0){
      this.create = true;
    }
    if(viewAction.length >0){
      this.isView = true;
    }
    this.getAllSurveys();
  }
  getAllSurveys() {
    this.surveyService.getSurvey({ ...this.coursePaginationModel})
      .subscribe(res => {
        this.dataSource = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.coursePaginationModel.docs = res.docs;
        this.coursePaginationModel.page = res.page;
        this.coursePaginationModel.limit = res.limit;
      })
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllSurveys();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

   /** Selects all rows if they are not all selected; otherwise clear selection. */
   masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: any) =>
          this.selection.select(row)
        );
  }

   // export table data in excel file
   exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.map((x:any) => ({
        'Name': x.name,
        'No.of Questions': x.questions.length,
        'Created At': formatDate(new Date( x.createdAt), 'yyyy-MM-dd', 'en') || '',
       
      }));

    TableExportUtil.exportToExcel(exportData, 'SurveyList');
  }


  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Name','No.of Questions','Created At' ]];
    ;
    const data = this.dataSource.map((user: any) => [
      user.name,
      user.questions.length,
      formatDate(new Date( user.createdAt), 'yyyy-MM-dd', 'en') || '',
    ]);
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });
    doc.save('SurveyList.pdf');
  }
}
  //   this.instructorService.getInstructor(payload).subscribe((res) => {
  //     this.instructorList = res;
  //     console.log('instructor', this.instructorList);
  //   });

  //   this._classService.getAllCoursesTitle('active').subscribe((course) => {
  //     this.courseList = course;
  //     console.log('course', this.courseList);
  //   });
  // }
  // public setRow(_index: number) {
  //   this.selectedIndex = _index;
  // }


  // selectcourseList(){
  //   this.selectcourse = true;
  // }

  // selectprogramList(){
  //   this.selectcourse = false;
  // }

  // getProgramList() {
  //   this.courseService.getCourseProgram({status:'active'}).subscribe(
  //     (response: any) => {
  //       // console.log("page",response)
  //       this.programData = response.docs;
  //     },
  //     (error) => {
  //     }
  //   );
  // }
//   getAllUserTypes(filters?: any) {
//     this.adminService.getUserTypeList({ 'allRows':true }).subscribe(
//       (response: any) => {
//         this.data = response.filter((item:any) =>item.typeName !== 'admin');
//       },
//       (error) => {
//       }
//     );
//   }
// }
