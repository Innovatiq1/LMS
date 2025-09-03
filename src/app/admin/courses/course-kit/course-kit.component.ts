import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CourseKitModel, CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import {  BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import { VideoPlayerComponent } from './video-player/video-player.component';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AdminService } from '@core/service/admin.service';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-course-kit',
  templateUrl: './course-kit.component.html',
  styleUrls: ['./course-kit.component.scss']
})
export class CourseKitComponent implements OnInit{
  displayedColumns: string[] = [
    'Course',
    'Short Description',
    'Long Description',
    'Media Link',
    'Document Link'
  ];

  // breadscrums = [
  //   {
  //     title: 'Course Kit',
  //     items: ['Course'],
  //     active: 'Course Kit',
  //   },
  // ];

  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  selection = new SelectionModel<CourseModel>(true, []);
  dataSource: any;
  isLoading = true;
  courseKitModel!: Partial<CourseKitModel>;
  templates: any[] = [];
  currentDate: Date;
  searchTerm: string = '';
  actionItems: any[] = [];
  create = false;
  view = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public utils: UtilsService,
    private snackBar: MatSnackBar,
    private courseService: CourseService,
    private modalServices: BsModalService,
    private adminService: AdminService,
    private authenService: AuthenService
  ) {
    this.currentDate = new Date();
    this.courseKitModel = {};
     this.adminService.filterAndReturnValue("course-kit").subscribe(value=>{
      this.actionItems = value?.map((action:any)=>action.id.split("__")[1]) || []
     });
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  ngOnInit(){
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails?.filter((item: any) => item.id == parentId);
    let childData = parentData[0]?.children?.filter((item: any) => item.id == childId);
    let actions = childData[0]?.actions
    let createAction = actions?.filter((item:any) => item.title == 'Create')
    let viewAction = actions?.filter((item:any) => item.title == 'View')

    if(createAction?.length > 0){
      this.create = true
    }
    
    if(viewAction?.length >0){
      this.view = true;
    }

    this.fetchCourseKits();
    this.getJobTemplates();
  }

  checkActionAccess(action:string):boolean{
    return this.actionItems?.length ? this.actionItems.includes(action): true
  }

  // fetchCourseKits() {
  //   this.courseService.getCourseKit({ ...this.courseKitModel })
  //     .subscribe(response => {
  //       console.log("courseKit response",response)
  //       this.isLoading = false;
  //       this.totalItems = response.totalDocs

  //       this.dataSource = response.docs;
  //       this.courseKitModel.docs = response.docs;
  //       this.courseKitModel.page = response.page;
  //       this.courseKitModel.limit = response.limit;
  //       this.courseKitModel.totalDocs = response.totalDocs;

  //       this.getJobTemplates();

  //     }, (error) => {

  //     });
  // }
  fetchCourseKits() {
    const filter = { 
      ...this.courseKitModel,
      title: this.searchTerm 
    };
  
    this.courseService.getCourseKit(filter)
      .subscribe(response => {
        console.log("courseKit response", response);
        this.isLoading = false;
        this.totalItems = response.totalDocs;
        this.dataSource = response.docs;
        this.courseKitModel.docs = response.docs;
        this.courseKitModel.page = response.page;
        this.courseKitModel.limit = response.limit;
        this.courseKitModel.totalDocs = response.totalDocs;
  
        this.getJobTemplates();
      }, (error) => {
        // Handle error
      });
  }
  

  getJobTemplates() {
    this.courseService.getJobTempletes().subscribe(
      (data: any) => {
        this.templates = data.templates;
      },
      (error) => {
        console.error('Error fetching job templates:', error);
      }
    );
  }

  playVideo(video: { video_url: any; }): void {
    if (video?.video_url) {
      this.openVidePlayer(video);
    } else {
      console.error("Invalid video URL");
    }
  }

  openVidePlayer(videoLink: { video_url?: any; id?: any; }): void {
    if (videoLink?.id) {
      const videoURL = videoLink.video_url;
        if (!videoURL) {
          Swal.fire({
            icon: "error",
            title: "Video Convert is Pending",
            text: "Please start convert this video",
          });
          return

        }
        if (videoURL) {
          const initialState: ModalOptions = {
            initialState: {
              videoURL,
            },
            class: "videoPlayer-modal",
          };
          this.modalServices.show(VideoPlayerComponent, initialState);
        }
      // });
    }
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  deleteItem(item: any) {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this course kit?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourseKit(item._id).subscribe(
          () => {
            Swal.fire({
              title: "Deleted",
              text: "Course Kit deleted successfully",
              icon: "success",
            });
            this.fetchCourseKits();
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
    this.courseKitModel.page = $event?.pageIndex + 1;
    this.courseKitModel.limit = $event?.pageSize;
    this.fetchCourseKits();
    // this.getJobTemplates();
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
      title: 'Are you sure?',
      text: 'Do you want to update this user!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
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
  performSearch() {
    this.courseKitModel.page = 1;
    this.paginator.pageIndex = 0;
    this.fetchCourseKits();
  }
  
  // performSearch() {
  //   if(this.searchTerm){
  //   this.dataSource = this.dataSource?.filter((item: any) =>{
  //     const search = (item.name + item.shortDescription + item.longDescription).toLowerCase()
  //     console.log("search",search);
  //     return search.indexOf(this.searchTerm.toLowerCase())!== -1;

  //   }
  //   );
  //   } else {
  //      this.fetchCourseKits();

  //   }
  // }
  exportExcel() {
   const exportData: Partial<TableElement>[] = this.dataSource.map(
     (user: any) => ({
       'Course Kit': user.name,
       'Short Description': user.shortDescription,
       'Long Description': user.longDescription,
       'Media Link': user.videoLink[0].video_filename,
       'Document Link': user.videoLink[0].doc_filename,
     })
   );
    TableExportUtil.exportToExcel(exportData, 'courseKit-list');
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Course Kit','Short Description','Long Description','Media Link','Document Link']];
    const data = this.dataSource.map((user:any) =>
      [user.name,
        user.shortDescription,
       user.longDescription,
       user.videoLink[0].video_filename,
       user.videoLink[0].doc_filename
    ] );
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },



    });
    doc.save('CourseKit-list.pdf');
  }

}
