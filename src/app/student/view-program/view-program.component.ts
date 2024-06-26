import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseKitModel } from '@core/models/course.model';
import { CommonService } from '@core/service/common.service';
import { CourseService } from '@core/service/course.service';
import { VideoPlayerComponent } from 'app/admin/courses/course-kit/video-player/video-player.component';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";

import Swal from 'sweetalert2';
// import { VideoPlayerComponent } from '../settings/course-kit/video-player/video-player.component';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },

];
@Component({
  selector: 'app-view-program',
  templateUrl: './view-program.component.html',
  styleUrls: ['./view-program.component.scss']
})
export class ViewProgramComponent {
  displayedColumns: string[] = ['position', ' Class Start Date ', ' Class End Date ', 'action'];
  displayedColumns1: string[] = [
    'title',
  ];
  dataSource: any;
  courseKitModel!: Partial<CourseKitModel>;
  templates: any[] = [];
  currentDate!: Date;
  breadscrums = [
    {
      title: 'Programs',
      items: ['Program'],
      active: 'View Details',
    },
  ];
  isRegistered = false;
  subscribeParams: any;
  classId: any;
  classDetails: any;
  courseId: any;
  courseKitDetails: any;
  studentClassDetails: any;
  isStatus = false;
  isApproved = false
  isCancelled = false
  courseName: any;
  documentLink: any;
  uploadedDoc: any;
  title!: string;
  programDetails: any;
  isCompleted = false;
  courseCompletedDetails: { title: string, playbackTime: number }[] = [];
  electivecourseCompletedDetails: { electivetitle: string, electiveplaybackTime: number }[] = [];
  completedProgramPercentage!: number;
  coreCompleted = false;
  electiveCompleted = false;
  certificateIssued = false;


  constructor(private classService: ClassService, private activatedRoute: ActivatedRoute, private modalServices: BsModalService, private courseService: CourseService,
    @Inject(DOCUMENT) private document: any) {
    this.subscribeParams = this.activatedRoute.params.subscribe((params) => {
      this.classId = params["id"];
    });
    this.getRegisteredClassDetails();
    this.getClassDetails();


  }
  getClassDetails() {
    this.classService.getProgramClassById(this.classId).subscribe((response) => {
      this.classDetails = response;
      this.courseId = this.classDetails.courseId.id
      this.dataSource = this.classDetails.sessions;
      this.getCourseKitDetails();
    })
  }

  registerProgram(classId: string) {
    let userdata = JSON.parse(localStorage.getItem('currentUser')!)
    let studentId = localStorage.getItem('id')
    let payload = {
      email: userdata.user.email,
      name: userdata.user.name,
      programTitle: this.classDetails?.courseId?.title,
      programFee: this.classDetails?.courseId?.courseFee,
      studentId: studentId,
      classId: this.classId,
      title: this.title,
      companyId:userdata.user.companyId
    }
    // console.log('data',data)
    // let studentId=localStorage.getItem('id')
    // let programName=this.courseName;
    this.courseService.registerProgramClass(payload).subscribe((response) => {
      this.document.location.href = response.data.session.url;
      this.getClassDetails();
    });

  }
  getCourseKitDetails() {
    let studentId = localStorage.getItem('id')
    this.courseService.getProgramById(this.courseId).subscribe((response) => {
      this.programDetails = response.data
      if (this.programDetails.coreprogramCourse && this.programDetails.coreprogramCourse.length > 0) {
        const courseIds = this.programDetails.coreprogramCourse.map((course: { coreProgramName: { id: any; }; }) => course.coreProgramName.id);
        courseIds.forEach((courseId: any) => {
          this.courseService.getStudentRegisteredByCourseId(studentId, courseId).subscribe((courseResponse) => {
            const title = courseResponse?.courseId?.title;
            const playbackTime = courseResponse?.playbackTime;
            this.courseCompletedDetails.push({ title, playbackTime });
            const totalPlaybackTime = this.courseCompletedDetails.reduce((total, course) => total + (course.playbackTime || 0), 0);
            const averagePlaybackTime = this.courseCompletedDetails.length > 0 ? totalPlaybackTime / this.courseCompletedDetails.length : 0;
            this.completedProgramPercentage = averagePlaybackTime
            if (this.completedProgramPercentage === 100) {
              this.coreCompleted = true;
                        } 

          });
        });
        if (this.programDetails.electiveprogramCourse && this.programDetails.electiveprogramCourse.length > 0) {
          const electivecourseIds = this.programDetails.electiveprogramCourse.map((course: { electiveProgramName: { id: any; }; }) => course.electiveProgramName.id);
          electivecourseIds.forEach((courseId: any) => {
            this.courseService.getStudentRegisteredByCourseId(studentId, courseId).subscribe((res) => {
              const electivetitle = res?.courseId?.title;
              const electiveplaybackTime = res?.playbackTime;
              this.electivecourseCompletedDetails.push({ electivetitle, electiveplaybackTime });
              if (electiveplaybackTime === 100) {
                this.electiveCompleted = true;
                          }
                          this.courseService.getProgramRegisteredClasses(studentId, this.classId).subscribe((response) => {
                            this.studentClassDetails = response.data;
                            if (this.studentClassDetails.status == 'approved') {
                      
                          if(this.coreCompleted && this.electiveCompleted){
                            let payload = {
                              status: 'completed',
                              studentId: studentId,
                              playbackTime: 100
                            }
                            this.classService.saveApprovedProgramClasses(this.classId, payload).subscribe((response) => {
                            })
      
                          }
                        }
                      })
            });
          });
  
        } else {
          this.courseService.getProgramRegisteredClasses(studentId, this.classId).subscribe((response) => {
            this.studentClassDetails = response.data;
            if (this.studentClassDetails.status == 'approved') {
      
          if(this.coreCompleted){
            let payload = {
              status: 'completed',
              studentId: studentId,
              playbackTime: 100
            }
            this.classService.saveApprovedProgramClasses(this.classId, payload).subscribe((response) => {
            })

          }
        }
      })

        }
  

      }
      this.courseKitDetails = response?.data?.programKit;
      this.courseName = response?.data?.title;
      this.documentLink = this.courseKitDetails[0].documentLink;
      let uploadedDocument = this.documentLink?.split('/')
      this.uploadedDoc = uploadedDocument?.pop();
    });
  }
  getRegisteredClassDetails() {
    let studentId = localStorage.getItem('id')
    this.courseService.getProgramRegisteredClasses(studentId, this.classId).subscribe((response) => {
      this.studentClassDetails = response.data;
      if (this.studentClassDetails.status == 'registered') {
        this.isRegistered == true;
        this.isStatus = true;
      }
      if (this.studentClassDetails.status == 'approved') {
        this.isRegistered == true;
        this.isApproved = true;
      }
      if (!this.studentClassDetails.certificateUrl && this.studentClassDetails.status == 'completed') {
        this.isRegistered == true;
        this.isCompleted = true;
      }
      if (this.studentClassDetails.certificateUrl && this.studentClassDetails.status == 'completed') {
        this.isRegistered == true;
        this.isCompleted = true;
        this.certificateIssued = true;
      }

      if (this.studentClassDetails.status == 'cancel') {
        this.isRegistered == true;
        this.isCancelled = true;
      }
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

  playVideo(video: { url: any; }): void {
    if (video?.url) {
      this.openVidePlayer(video);
    } else {
      console.error("Invalid video URL");
    }
  }

  openVidePlayer(videoLink: { url?: any; id?: any; }): void {
    // const { videoLink } = videoLink;
    if (videoLink?.id) {
      const videoId = videoLink.id;
      this.courseService.getVideoById(videoId).subscribe((res) => {
        const videoURL = res.data.videoUrl;
        if (!videoURL) {
          Swal.fire({
            icon: "error",
            title: "Video Convert is Pending",
            text: "Please start convert this video",
          });
          return

        }
        const videoType = "application/x-mpegURL";
        if (videoURL) {
          const initialState: ModalOptions = {
            initialState: {
              videoURL,
              videoType,
            },
            class: "videoPlayer-modal",
          };
          this.modalServices.show(VideoPlayerComponent, initialState);
        }
      });
    }
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}
