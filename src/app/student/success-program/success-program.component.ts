import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseKitModel } from '@core/models/course.model';
import { CommonService } from '@core/service/common.service';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import {  BsModalService, ModalOptions} from "ngx-bootstrap/modal";

import Swal from 'sweetalert2';
import { VideoPlayerComponent } from 'app/admin/courses/course-kit/video-player/video-player.component';

@Component({
  selector: 'app-success-program',
  templateUrl: './success-program.component.html',
  styleUrls: ['./success-program.component.scss']
})
export class SuccessProgramComponent implements OnInit{
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
  courseKitDetails:any;
  studentClassDetails: any;
  isStatus = false;
  isApproved = false
  isCancelled = false
  courseName: any;
  documentLink: any;
  uploadedDoc: any;

  constructor(private classService: ClassService,private activatedRoute:ActivatedRoute,private modalServices:BsModalService, private courseService:CourseService,
    @Inject(DOCUMENT) private document: any){
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
    this.classService.getProgramClassById(this.classId).subscribe((response)=>{
      this.classDetails =response;
      this.courseId=this.classDetails.courseId.id
      this.dataSource=this.classDetails.sessions;
      this.getCourseKitDetails();
    })
  }
  registerProgram(classId: string) {
    let userdata = JSON.parse(localStorage.getItem('currentUser')!)
    let studentId=localStorage.getItem('id')
    let payload ={
      email:userdata.user.email,
      name:userdata.user.name,
      programTitle:this.classDetails?.courseId?.title,
      programFee:this.classDetails?.courseId?.fee,
      studentId:studentId,
      classId:this.classId,
    }
    this.courseService.registerProgramClass(payload).subscribe((response) => {
      this.document.location.href = response.data.session.url;
      this.getClassDetails();
    });
  }
  getCourseKitDetails(){
    this.courseService.getProgramById(this.courseId).subscribe((response) => {
      this.courseKitDetails=response?.data?.programKit;
      this.courseName=response?.data?.title;
      this.documentLink = this.courseKitDetails[0].documentLink;
      let uploadedDocument=this.documentLink?.split('/')
      this.uploadedDoc = uploadedDocument?.pop();
    });
  }
  getRegisteredClassDetails(){
    let studentId=localStorage.getItem('id')
    this.courseService.getProgramRegisteredClasses(studentId,this.classId).subscribe((response) => {
      this.studentClassDetails=response.data;
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
