import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { VideoPlayerComponent } from '../../course-kit/video-player/video-player.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthenService } from '@core/service/authen.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.scss'],
})
export class CourseViewComponent {
  @ViewChild('courseScenariosDialog') courseScenariosDialog!: TemplateRef<any>;
  breadcrumbs: any[] = [];
  displayedColumns1: string[] = ['video'];
  coursePaginationModel: Partial<CoursePaginationModel>;
  courseData: any;
  totalItems: any;
  courseId: any;
  sourceData: any;
  checkId = '';
  status: any;
  button: boolean = false;
  coursekitData: any;
  edit = false;
  isDelete = false;
  storedItems: string | null;
  selectedScenario: string = '';
  selectedOptionValue:any;
  constructor(
    public _courseService: CourseService,
    private classService: ClassService,
    private activatedRoute: ActivatedRoute,
    private modalServices: BsModalService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private authenService: AuthenService,
    public dialog: MatDialog,
  ) {
    // constructor
     this.storedItems = localStorage.getItem('activeBreadcrumb');
     if (this.storedItems) {
      this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
      this.breadcrumbs = [
        {
          title: '', 
          items: [this.storedItems],  
          active: 'View Course',  
        },
      ];
    }
    this.coursePaginationModel = {};
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.courseId = params.id;
      this.status = params.status;
        this.getCourseByCourseId(this.courseId);
    });
    if(this.status === 'in-active'){
      this.button = true;
      this.breadcrumbs = [
        {
          title: 'Blank',
          items: ['Pending'],
          active: 'View Pending Course',
        },
      ];
    }else   if(this.status === 'approved'){
      this.breadcrumbs = [
        {
          title: 'Blank',
          items: ['Rejected'],
          active: 'View Rejected Course',
        },
      ];
    }
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 3];
    const subChildId =  urlPath[urlPath.length - 2];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions
    let editAction = actions.filter((item:any) => item.title == 'Edit')
    let deleteAction = actions.filter((item:any) => item.title == 'Delete')

    if(editAction.length >0){
      this.edit = true;
    }
    if(deleteAction.length >0){
      this.isDelete = true;
    }
    if (this.courseId &&  this.status === 'active') {
      this.getAllCourse();
    }
    else if (this.courseId &&  this.status === 'in-active') {
      this.getAllInActiveCourse();
    }

  }
  openCourseDialog(){
    // this.selectedOptionValue='';
    if(this.selectedOptionValue){
      this.router.navigate([`/admin/courses/edit-course/${this.sourceData.id}`])

    }
    else{
    this.openDialog(this.courseScenariosDialog)
    }

  }
  selectScenario(scenario:string){
    this.selectedScenario = scenario;

  }
  openDialog(templateRef: any): void {
    const dialogRef = this.dialog.open(templateRef, {
      width: '1000px',
      height:'300px',
      data: {     },
    }); 

}
navigateToCreate(dialogRef:any) {
  if (this.selectedScenario) {
    dialogRef.close()
    // [routerLink]="[
    //   '/admin/courses/edit-course/',
    //   sourceData.id
    // ]"
    this.router.navigate([`/admin/courses/edit-course/${this.sourceData.id}`], { queryParams: { option: this.selectedScenario } });
  }
}
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  getAllCourse() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this._courseService
      .getAllCourses(userId,{ ...this.coursePaginationModel, status: 'active' })
      .subscribe((response) => {
        if (response) {
          this.courseData = response.data.docs;
        }
      });
  }
getAllInActiveCourse() {
  let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this._courseService
    .getAllCourses(userId,{ ...this.coursePaginationModel, status: 'inactive' })
    .subscribe((response) => {
      if (response) {
        this.courseData = response.data.docs;
      }
    });
}
back() {

  window.history.back();
}
  getDataByClick(row_id: string) {
    this.getCourseByCourseId(row_id);
  }

  getCourseByCourseId(id: string) {
    this._courseService.getCourseById(id).subscribe((data) => {
      // console.log("response",data)
      if (data) {
        this.sourceData = data;
        this.coursekitData = data.course_kit;
        this.checkId = this.sourceData.id;
        this.selectedOptionValue=data.selectedOptionValue;
      }
    });
  }

  delete(id: string) {
    this.classService
      .getClassList({ courseId: id })
      .subscribe((classList: any) => {
        const matchingClasses = classList.docs.filter((classItem: any) => {
          return classItem.courseId && classItem.courseId.id === id;
        });
        if (matchingClasses.length > 0) {
          Swal.fire({
            title: 'Error',
            text: 'Classes have been registered with this course. Cannot delete.',
            icon: 'error',
          });
          return;
        }
        Swal.fire({
          title: 'Confirm Deletion',
          text: 'Are you sure you want to delete this  Course?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this._courseService.deleteCourse(id).subscribe(() => {
              this.getAllCourse();
              window.history.back();
              Swal.fire({
                title: 'Success',
                text: 'Course deleted successfully.',
                icon: 'success',
              });
            });
          }
        });
      });
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
    }
  }
  approveCourse(course: CourseModel): void {
    course.status = 'active';
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this._courseService.updateCourse(course).subscribe(() => {
          Swal.fire({
            title: 'Success',
            text: 'Course approved successfully.',
            icon: 'success',
          });
          this.getAllCourse();
          // window.history.back();
          this.router.navigate([
            '/admin/courses/course-name',
          ]);
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
          });
        });
      }
    });
  
  }
}
