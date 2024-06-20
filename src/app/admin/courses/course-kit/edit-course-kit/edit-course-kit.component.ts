import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseKit, CourseKitModel } from '@core/models/course.model';
import { CertificateService } from '@core/service/certificate.service';
import { CommonService } from '@core/service/common.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-course-kit',
  templateUrl: './edit-course-kit.component.html',
  styleUrls: ['./edit-course-kit.component.scss'],
})
export class EditCourseKitComponent {
  breadscrums = [
    {
      title: 'Edit Course Kit',
      items: ['Settings'],
      active: 'Edit Course Kit',
    },
  ];
  @ViewChild('fileDropRef', { static: false })
  fileDropEl!: ElementRef;

  files: any[] = [];
  //mode: string = 'editUrl';
  course: any;

  courseKitModel!: Partial<CourseKitModel>;
  //files: any[] = [];
  templates: any[] = [];
  list = true;
  isSubmitted = false;
  edit = false;
  courseKits!: any;
  viewUrl = false;
  courseKitForm!: FormGroup;
  pageSizeArr = this.utils.pageSizeArr;
  courseId!: string;
  fileName: any;
  subscribeParams: any;
  documentLink: any;
  uploaded: any;
  uploadedDocument: any;
  editUrl = false;
  docs: any;
  videoLink: any;
  videoSrc: any;
  videoId: any;
  //activatedRoute: any;
  constructor(
    private router: Router,

    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public utils: UtilsService,
    private courseService: CourseService,
    private certificateService: CertificateService,
    private commonService: CommonService
  ) {
    this.courseKitModel = {};
    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit-course-kit');
    this.viewUrl = urlPath.includes('view-course-kit');

    if (this.viewUrl === true) {
      this.breadscrums = [
        {
          title: 'View Course Kit',
          items: ['Settings'],
          active: 'View Course Kit',
        },
      ];
    }
    this.courseKitForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        ...this.utils.validators.name,
        ...this.utils.validators.noLeadingSpace,
      ]),
      documentLink: new FormControl('', [ Validators.required,
        ...this.utils.validators.imagePath,
        ...this.utils.validators.noLeadingSpace,]),
      shortDescription: new FormControl('', [ Validators.required,
        ...this.utils.validators.descripton,
        ...this.utils.validators.noLeadingSpace,]),
      longDescription: new FormControl('', [ Validators.required,
        ...this.utils.validators.longDescription,
        ...this.utils.validators.noLeadingSpace,]),
      videoLink: new FormControl('', [ Validators.required,
        ...this.utils.validators.imagePath,
        ...this.utils.validators.noLeadingSpace,]),
      // startDate: ['', [Validators.required]],
      // endDate: ['', [Validators.required]]
      // sections: new FormControl('', [ Validators.required,...this.utils.validators.sections]),
    });

    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.courseId = params.id;
      }
    );
    // if(this.editUrl || this.viewUrl){
    //   this.getData();
    //   }
  }
  dateValidator(group: FormGroup) {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (startDate && endDate) {
      if (startDate > endDate) {
        group.get('endDate')?.setErrors({ dateError: true });
      } else {
        group.get('endDate')?.setErrors(null);
      }
    }
  }
  ngOnInit(): void {
    //this.setup()
    this.getData();

    console.log('sday', this.courseKitForm.value);

  }

  // submitCourseKit(): void {

  // }
  //

  private editCourseKit(courseKitData: CourseKit): void {
    // courseKitData.documentLink = this.documentLink;
    const updatedCourseKit: CourseKit = {
      id: this.courseId,
      ...this.courseKitForm.value,
    };

    Swal.fire({
      title: 'Are you sure?',
          text: 'You want to update this course kit!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.editCourseKit(this.courseId, updatedCourseKit).subscribe(
          () => {
            Swal.fire({
              title: 'Updated',
              text: 'Course Kit Updated successfully',
              icon: 'success',
            });
            // this.fileDropEl.nativeElement.value = "";
            this.courseKitForm.reset();
            // this.toggleList()
            window.history.back();
            // this.router.navigateByUrl('/admin/courses/course-kit');
          },
          (error) => {
            Swal.fire(
              'Failed to update course kit',
              error.message || error.error,
              'error'
            );
          }
        );
  }
  });



  }
  submitCourseKit(): void {
    // const courseKitData: CourseKit = this.courseKitForm.value;
    // courseKitData.documentLink = this.documentLink;
    // console.log('sday', this.courseKitForm.value);

      // const updatedCourseKit: CourseKit = {
      //   id: this.courseId,
      //   ...this.courseKitForm.value,
      // };
      const formdata = new FormData();
      formdata.append('files', this.docs);
      formdata.append('files', this.videoLink);
      formdata.append('video_filename', this.videoSrc);
      formdata.append('doc_filename', this.uploadedDocument);
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait...',
        allowOutsideClick: false,
        timer: 90000,
        timerProgressBar: true,
        // onBeforeOpen: () => {
        //   Swal.showLoading();
        //  },
      });
      // Swal.fire({
      //   // title: "Updated",
      //   // text: "Course Kit updated successfully",
      //   // icon: "success",
      //   title: 'Uploading...',
      //   text: 'Please wait...',
      //   allowOutsideClick: false,
      //   timer: 18000,
      //   timerProgressBar: true,
      // });
      // this.courseService.editCourseKit(this.courseId, updatedCourseKit).subscribe(() => {
      //     Swal.fire({
      //       // title: "Updated",
      //       // text: "Course Kit updated successfully",
      //       // icon: "success",

      //     });
      //     //this.modalRef.close();
      //     this.router.navigateByUrl('/admin/courses/course-kit');
      // });
      // this.courseService.saveVideo(formdata).subscribe(
      //   (response: any) => {
        // console.log("videoid", this.videoId)
          this.courseService.updateVideo(this.videoId,formdata).subscribe((data) => {
            console.log('data', data.data);

            const courseKitData: CourseKit = this.courseKitForm.value;
            courseKitData.videoLink = data.data._id;
            courseKitData.documentLink = data.data.document;
            this.editCourseKit(courseKitData);


            // const courseKitData: CourseKit = this.courseKitForm.value;
            // courseKitData.documentLink = this.documentLink;
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Upload Failed',
              text: 'An error occurred while uploading the video',
            });
            Swal.close();
          });

          // const videoId = response.videoIds;
          // this.commonService.setVideoId(videoId);

          // courseKitData.videoLink = videoId;

          //this.currentVideoIds = [...this.currentVideoIds, ...videoId]
          // this.currentVideoIds.push(videoId);
          // this.editCourseKit(courseKitData);

          // Swal.close();
      //   },
      // );
    } 

    
  
  // toggleList() {
  //   this.router.navigateByUrl("Course/Course Kit")

  // }
  cancel() {
    window.history.back();
  }
  getData() {
    forkJoin({
      course: this.courseService.getCourseKitById(this.courseId),
    }).subscribe((response: any) => {
      if (response) {
        this.course = response.course;
        console.log('56', this.course);
        this.fileName = response?.course?.videoLink
          ? response?.course?.videoLink[0].filename
          : null;
        // let startingDate=response?.course?.startDate;
        // let endingDate=response?.course?.endDate;
        // let startTime=response?.course?.startDate?.split("T")[1];
        // let startingTime=startTime?.split(".")[0];
        // let endTime=response?.course?.endDate.split("T")[1];
        // let endingTime=endTime?.split(".")[0];
        this.documentLink = response.course?.documentLink;
        this.docs = response.course?.documentLink;
        this.videoLink = response.course?.videoLink;
        // this.uploaded=this.documentLink.split('/')
        // this.uploadedDocument = this.uploaded.pop();

        let courseKitDetails = response.course.videoLink[0];
        this.videoId = courseKitDetails._id
        this.videoSrc = courseKitDetails.video_filename;
        this.uploadedDocument = courseKitDetails.doc_filename;
        this.courseKitForm.patchValue({
          name: response?.course?.name,
          shortDescription: response?.course?.shortDescription,
          longDescription: response?.course?.longDescription,
          // videoLink: response?.course?.videoLink
          //   ? response?.course?.videoLink[0].video_url
          //   : null,
          // startDate:this.courseKitForm.get('startDate')?.patchValue(startingDate),
          // moment(startingDate).format("MM/DD/YYYY,h:mm A"),
          // endDate:this.courseKitForm.get('endDate')?.patchValue(endingDate),
        });
      }
    });
  }

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
    this.fileName = '';
  }

  /**
   * handle file from browsing
   */
  // fileBrowseHandler(f: any) {
  //   this.prepareFilesList(f.files);
  // }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      this.fileName = '';
      //this.model.vltitle = item.name;
    }
    //this.fileDropEl.nativeElement.value = "";
  }
  fileBrowseHandler(event: any) {
    const file = event.target.files[0];
    this.videoLink = file;
    console.log(this.videoLink,"90"); 
    this.videoSrc = this.videoLink.name;
    console.log(this.videoSrc,"000"); 
  }
  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.docs = file;
    this.uploadedDocument = this.docs.name;
    // const file = event.target.files[0];
    // const formData = new FormData();
    // formData.append('files', file);
    // this.certificateService
    //   .uploadCourseThumbnail(formData)
    //   .subscribe((response: any) => {
    //     this.documentLink = response.image_link;
    //     this.uploaded = this.documentLink.split('/');
    //     this.uploadedDocument = this.uploaded.pop();
    //   });
  }
}
