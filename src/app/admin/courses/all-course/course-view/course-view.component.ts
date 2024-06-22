import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { VideoPlayerComponent } from '../../course-kit/video-player/video-player.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.scss'],
})
export class CourseViewComponent {

  breadscrums = [
    {
      title: 'Blank',
      items: ['Course'],
      active: 'View Course',
    },
  ];
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

  constructor(
    public _courseService: CourseService,
    private classService: ClassService,
    private activatedRoute: ActivatedRoute,
    private modalServices: BsModalService,
  ) {
    // constructor
    this.coursePaginationModel = {};
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.courseId = params.id;
      this.status = params.status;
        this.getCourseByCourseId(this.courseId);
    });
    if(this.status === 'in-active'){
      this.button = true;
      this.breadscrums = [
        {
          title: 'Blank',
          items: ['Pending Course'],
          active: 'View Pending Course',
        },
      ];
    }else   if(this.status === 'approved'){
      this.breadscrums = [
        {
          title: 'Blank',
          items: ['Approved Course'],
          active: 'View Approved Course',
        },
      ];
    }
  }

  ngOnInit() {
    if (this.courseId &&  this.status === 'active') {
      this.getAllCourse();
    }
    else if (this.courseId &&  this.status === 'in-active') {
      this.getAllInActiveCourse();
    }

  }
/*Get active courses */
  getAllCourse() {
    let userId = localStorage.getItem('id')
    this._courseService
      .getAllCourses(userId,{ ...this.coursePaginationModel, status: 'active' })
      .subscribe((response) => {
        if (response) {
          this.courseData = response.data.docs;
        }
      });
  }
/*Get in-active courses */
getAllInActiveCourse() {
  let userId = localStorage.getItem('id')
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
      if (data) {
        this.sourceData = data;
        this.coursekitData = data.course_kit;
        this.checkId = this.sourceData.id;
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
    // const { videoLink } = videoLink;
    if (videoLink?.id) {
      const videoURL = videoLink.video_url;
      // this.courseService.getVideoById(videoId).subscribe((res) => {
      //   const videoURL = res.data.videoUrl;
        if (!videoURL) {
          Swal.fire({
            icon: "error",
            title: "Video Convert is Pending",
            text: "Please start convert this video",
          });
          return

        }
        // const videoType = "application/x-mpegURL";
        if (videoURL) {
          const initialState: ModalOptions = {
            initialState: {
              videoURL,
              // videoType,
            },
            class: "videoPlayer-modal",
          };
          this.modalServices.show(VideoPlayerComponent, initialState);
        }
      // });
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
            // confirmButtonColor: '#526D82',
          });
          this.getAllCourse();
          window.history.back();
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
            // confirmButtonColor: '#526D82',
          });
        });
      }
    });
  
  }
}
