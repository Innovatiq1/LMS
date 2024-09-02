import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseKitModel, CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AdminService } from '@core/service/admin.service';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-view-course-kit',
  templateUrl: './view-course-kit.component.html',
  styleUrls: ['./view-course-kit.component.scss']
})
export class ViewCourseKitComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Course Kit'],
      active: 'View CourseKit',
    },
  ];
  classDataById: any;
  courseKitData: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  courseId: any;
  response: any;
  currentDate: Date;
  courseKitModel!: Partial<CourseKitModel>;
  templates: any[] = [];
  course: any;
  actionItems: any[] = [];
  edit = false;
  delete =false;

  constructor(
    private _router: Router,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
    private modalServices: BsModalService,
    private adminService: AdminService,
    private authenService: AuthenService
  ) {
    this.currentDate = new Date();
    this.courseKitModel = {};
    this.activatedRoute.params.subscribe((params: any) => {

      this.courseId = params.id;
    });

    this.adminService.filterAndReturnValue("course-kit").subscribe(value=>{
      this.actionItems = value?.map((action:any)=>action.id.split("__")[1]) || []
     });
  }

  ngOnInit(){
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this._router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let editAction = actions.filter((item:any) => item.title == 'Edit')
    let deleteAction = actions.filter((item:any) => item.title == 'Delete')
    
    if(editAction.length > 0){
      this.edit = true;
    }
    if(deleteAction.length >0){
      this.delete = true;
    }

    this.fetchCourseKits();
    this.getJobTemplates();
    if (this.courseId) {
      this.activatedRoute.params.subscribe((params: any) => {

        this.courseId = params.id;
        this.getCategoryByID(this.courseId);
      });
    }
  }

  checkActionAccess(action:string):boolean{
    return this.actionItems?.length ? this.actionItems.includes(action): true
  }

  fetchCourseKits() {
    this.courseService.getCourseKit({ ...this.courseKitModel })
      .subscribe(response => {
        this.courseKitData = response.docs;
        this.getJobTemplates();
      }, (error) => {

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

  getCategories(id: string): void {

    this.getCategoryByID(id);
  }
  getCategoryByID(id: string) {
   course: this.courseService.getCourseKitById(id).subscribe((response: any) => {
      this.classDataById = response?._id;
      this.response = response;
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
            this._router.navigateByUrl(`/admin/courses/course-kit`);
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
}
