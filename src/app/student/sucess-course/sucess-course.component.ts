import { Component, OnInit ,Inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseKitModel } from '@core/models/course.model';
import { CommonService } from '@core/service/common.service';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import {  BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import { DOCUMENT, isPlatformBrowser, DatePipe } from '@angular/common';

import Swal from 'sweetalert2';
import { VideoPlayerComponent } from 'app/admin/courses/course-kit/video-player/video-player.component';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
 
];
@Component({
  selector: 'app-sucess-course',
  templateUrl: './sucess-course.component.html',
  styleUrls: ['./sucess-course.component.scss']
})
export class SucessCourseComponent implements OnInit {
  displayedColumns: string[] = ['position', ' Class Start Date ', ' Class End Date ', 'action'];
  displayedColumns1: string[] = [
    'Course Name',
    'Short Description',
    'Long Description',
    'Video Link',
    'Document Link'
    ];
  dataSource:any;
  courseKitModel!: Partial<CourseKitModel>;
  templates: any[] = [];
  currentDate!: Date;
  breadscrums = [
    {
      title: 'Courses',
      items: ['Course'],
      active: 'View Details',
    },
  ];
  isRegistered = false;
  subscribeParams: any;
  classId: any;
  classDetails: any;
  courseId: any;
  courseKitDetails:any;
  studentClassDetails: any;
  isStatus = false;
  isApproved = false
  isCancelled = false

  constructor(@Inject(DOCUMENT) private document: any,
  private classService: ClassService,private activatedRoute:ActivatedRoute,private modalServices:BsModalService, private courseService:CourseService){
    this.subscribeParams = this.activatedRoute.params.subscribe((params) => {
      this.classId = params["id"];
    });
    this.getRegisteredClassDetails();
    this.getClassDetails();
  

  }
  ngOnInit(): void {
    Swal.fire({
      title: 'Thank you',
      text: 'We will approve once verified',
      icon: 'success',
    });

  }
  getClassDetails(){
    this.classService.getClassById(this.classId).subscribe((response)=>{
      this.classDetails =response;
      this.courseId=this.classDetails.courseId.id
      this.dataSource=this.classDetails.sessions;
      this.getCourseKitDetails();
    })
  }
  registerClass(classId: string) {
    let userdata = JSON.parse(localStorage.getItem('currentUser')!)
    let studentId=localStorage.getItem('id')
    console.log('title',this.classDetails.courseId.title)
    let payload ={
      email:userdata.user.email,
      courseTitle:this.classDetails?.courseId?.title,
      courseFee:this.classDetails?.courseId?.fee,
      studentId:studentId,
      classId:this.classId


    }
    this.courseService.saveRegisterClass(payload).subscribe((response) => {
      let studentId=localStorage.getItem('user_data');
      this.document.location.href = response.data.session.url;

        Swal.fire({
          title: 'Thank you',
          text: 'We will approve once verified',
          icon: 'success',
        });
      this.isRegistered = true;
      this.getClassDetails();
    });
  }
  getCourseKitDetails(){
    this.courseService.getCourseById(this.courseId).subscribe((response) => {
      this.courseKitDetails=response?.course_kit;
    });
  }
  getRegisteredClassDetails(){
    let studentId=localStorage.getItem('id')
    this.courseService.getStudentClass(studentId,this.classId).subscribe((response) => {
      this.studentClassDetails=response.data.docs[0];
      if(this.studentClassDetails.status =='registered' ){
        this.isRegistered == true;
        this.isStatus=true;
      }
      if(this.studentClassDetails.status =='approved' ){
        this.isRegistered == true;
        this.isApproved=true;
      }
      if(this.studentClassDetails.status =='cancel' ){
        this.isRegistered == true;
        this.isCancelled=true;
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
