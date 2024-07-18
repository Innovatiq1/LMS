import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { VideoPlayerComponent } from 'app/admin/courses/course-kit/video-player/video-player.component';
import { AuthenService } from '@core/service/authen.service';


@Component({
  selector: 'app-view-program',
  templateUrl: './view-program.component.html',
  styleUrls: ['./view-program.component.scss'],
})
export class ViewProgramComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Program'],
      active: 'View Program',
    },
  ];
  private subscription: Subscription = new Subscription();
  programData: any;
  courseId: any;
  programDataById: any;
  background: boolean = false;
  response: any;
  image: any;
  status: string = '';
  button: boolean = false;
  edit = false;
  isDelete = false;
  constructor(private courseService: CourseService, private activatedRoute: ActivatedRoute,
    private router: Router, private classService: ClassService, 
    private modalServices: BsModalService, private authenService: AuthenService
  ) {
    // constructor

    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log("params.id", params)
      this.courseId = params?.id;
      this.status = params?.status;
      this.getProgramByID(this.courseId);
      // if(this.courseId){
      //   this.getProgramByID(this.courseId);
      // }

    });
    if(this.status === 'pending'){
      this.button = true;
      this.breadscrums = [
        {
          title: 'Blank',
          items: ['Pending Program'],
          active: 'View Pending Program',
        },
      ];
    }
    else if(this.status === 'approved'){
      this.breadscrums = [
        {
          title: 'Blank',
          items: ['Approved Programs'],
          active: 'View Approved Program',
        },
      ];
    }
  }

  getProgramLists() {
    this.courseService
      .getCourseProgram({ status: 'active' })
      .subscribe((response: any) => {
        this.programData = response.docs;

      });
  }

  getPendingProgramLists() {
    this.subscription.add(
      this.courseService.getCourseProgram({ status: 'inactive' })
        .subscribe({
          next: (response: any) => {
            this.programData = response.docs; 
          },
          error: (error) => {
            console.error("Error fetching inactive programs", error);
            // Handle errors appropriately
          }
        })
    );
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
    if(this.status === 'active') { 
      this.getProgramLists();
    } else if(this.status === 'pending') {
      this.getPendingProgramLists();
    
    }

  }

  getProgramByID(id: string) {
    this.courseService.getProgramById(id).subscribe((response: any) => {
     
      if (response && response?.data && response?.data?.id) {
        this.response = response?.data;
        this.programDataById = this.response?.id;
      } else {
      }
    });
  }

  
  getProgramKits(id: string): void { 
    this.getProgramByID(id);
  }

  delete(id: string) {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this program?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed){
       
        this.classService.getProgramClassList({ courseId: id }).subscribe((classList: any) => {
          const matchingClasses = classList.docs.filter((classItem: any) => {
            return classItem.courseId && classItem.courseId.id === id;
          });
          if (matchingClasses.length > 0) {
            Swal.fire({
              title: 'Error',
              text: 'Classes have been registered with this program. Cannot delete.',
              icon: 'error',
            });
            return;
          }
          this.courseService.deleteProgram(id).subscribe(() => {
            this.getProgramLists();
            Swal.fire({
              title: 'Success',
              text: 'Program deleted successfully.',
              icon: 'success',
            }).then(() => {
              this.router.navigate(['/admin/program/program-list/program'])
            });
          });
        });
      }
    });
    
  }
  back() {

    window.history.back();
  }
  approveProgram(id:any,program: any): void {
    program.status = 'active';

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this program!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.updateCourseProgram(id,program).subscribe(() => {
          Swal.fire({
            title: 'Success',
            text: 'Program approved successfully.',
            icon: 'success',
            // confirmButtonColor: '#d33',
          });
          this.getPendingProgramLists();
          this.router.navigate(['/admin/program/program-list/program'])
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve program. Please try again.',
            icon: 'error',
            // confirmButtonColor: '#d33',
          });
        });
      }
    });
 
  }
  ngOnDestroy() {
    this.subscription.unsubscribe(); // Prevent memory leaks
  }
  
  getCourseKits() {
    const rows = [];
    for (const course of this.response?.coreprogramCourse) {
      for (const kit of course.coreProgramName.course_kit) {
        rows.push(kit);
      }
    }
    return rows;
  }
  getElectiveCourseKits() {
    const rows = [];
    for (const course of this.response?.electiveprogramCourse) {
      for (const kit of course.electiveProgramName.course_kit) {
        rows.push(kit);
      }
    }
    return rows;
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
}
