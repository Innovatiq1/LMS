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
      items: ['Course kit'],
      active: 'Edit Course Kit',
    },
  ];
  @ViewChild('fileDropRef', { static: false })
  fileDropEl!: ElementRef;

  files: any[] = [];
  course: any;

  courseKitModel!: Partial<CourseKitModel>;
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
  kitType: any;
  scormKit: any;
  scormId: any;
  kitTypeOpt: any[] = [
    { code: 'course', label: 'Course' },
    { code: 'scorm', label: 'Scorm' },
  ];
  isScormKit: boolean = false;
  acceptedFormats: string=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt";
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
      documentLink: new FormControl('', [
        ...this.utils.validators.noLeadingSpace,]),
      shortDescription: new FormControl('', [
        ...this.utils.validators.descripton,
        ...this.utils.validators.noLeadingSpace,]),
      longDescription: new FormControl('', [ 
        ...this.utils.validators.longDescription,
        ...this.utils.validators.noLeadingSpace,]),
      videoLink: new FormControl('', [ 
        ...this.utils.validators.noLeadingSpace,]),
      kitType: new FormControl('', [...this.utils.validators.descripton,
        ...this.utils.validators.noLeadingSpace]),
    });

    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.courseId = params.id;
      }
    );

    this.courseKitForm.get('kitType')?.valueChanges.subscribe((value) => {
      if (value === 'scorm') {
        this.acceptedFormats=".zip";
        this.isScormKit = true;
      this.courseKitForm.patchValue({
        videoLink: '',
        documentLink: '',
      });
      } else {
        this.acceptedFormats='.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt';
        this.isScormKit = false;
      }
    });
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
    this.getData();
  }
  private editCourseKit(courseKitData: CourseKit): void {
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
            this.courseKitForm.reset();
            window.history.back();
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
      const formdata = new FormData();
      formdata.append('files', this.docs);
      if (this.videoLink && !this.isScormKit) {
        formdata.append('files', this.videoLink);
      }
      if (!this.isScormKit) {
        formdata.append('video_filename', this.videoSrc);
        formdata.append('doc_filename', this.uploadedDocument);
      }
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait...',
        allowOutsideClick: false,
        timer: 90000,
        timerProgressBar: true,
      });
      if(this.isScormKit){
        this.courseService.updateScormKit(this.scormId,formdata).subscribe((data) => {
          const courseKitData: CourseKit = this.courseKitForm.value;
          delete courseKitData.videoLink;
          delete courseKitData.documentLink;
          courseKitData.scormKit = data.data._id;
          this.editCourseKit(courseKitData);
        });
      }else{
          this.courseService.updateVideo(this.videoId,formdata).subscribe((data) => {
            const courseKitData: CourseKit = this.courseKitForm.value;
            courseKitData.videoLink = data.data._id;
            courseKitData.documentLink = data.data.document;
            this.editCourseKit(courseKitData);
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Upload Failed',
              text: 'An error occurred while uploading the video',
            });
            Swal.close();
          });
        }
    } 
  cancel() {
    window.history.back();
  }
  getData() {
    forkJoin({
      course: this.courseService.getCourseKitById(this.courseId),
    }).subscribe((response: any) => {
      if (response) {
        // console.log(response);
        
        this.course = response.course;
        this.fileName = response?.course?.videoLink?.length > 0
          ? response?.course?.videoLink[0].filename
          : null;
        this.documentLink = response.course?.documentLink;
        this.docs = response.course?.documentLink;
        this.videoLink = response.course?.videoLink;
        if(response.course?.videoLink?.length > 0){
        let courseKitDetails = response.course.videoLink[0];
        this.videoId = courseKitDetails._id
        this.videoSrc = courseKitDetails.video_filename;
        this.uploadedDocument = courseKitDetails.doc_filename;
        this.acceptedFormats='.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt';
        }else {
          this.acceptedFormats='.zip';
          this.scormId = response.course.scormKit._id;
          this.scormKit = response.course.scormKit;
          this.uploadedDocument = response.course.scormKit.fileName || response.course.scormKit.title;
        }
        this.kitType = response.course.kitType;
        this.courseKitForm.patchValue({
          name: response?.course?.name,
          shortDescription: response?.course?.shortDescription,
          longDescription: response?.course?.longDescription,
          kitType: response?.course?.kitType,
        });
      }
    });
  }
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
    }
  }
  // fileBrowseHandler(event: any) {
  //   const file = event.target.files[0];
  //   if(file.size <= 10000000){
  //     this.videoLink = file;
  //     this.videoSrc = this.videoLink.name;
  //     } else {
  //       Swal.fire({
  //         title: 'Error',
  //         text: 'Failed to upload media.Please upload less than 10mb.',
  //         icon: 'error',
  //       });
  //     }
  //   }
  fileBrowseHandler(event: any) {
    const file = event.target.files[0];
    // console.log("ffile",file.type)
    const allowedFormats = ['video/mp4', 'video/x-matroska', 'video/x-msvideo','audio/mp3','audio/wav','audio/aac','audio/mpeg']; 
    if (!allowedFormats.includes(file.type)) {
      Swal.fire({
        title: 'Oops...',
        text: 'Selected format doesn\'t support. Only video and MP3 formats are allowed!',
        icon: 'error',
      });
      return; 
    }
    if (file.size <= 10000000) {
      this.videoLink = file;
      this.videoSrc = this.videoLink.name;
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload media. Please upload less than 10MB.',
        icon: 'error',
      });
    }
  }
  
    isUploading = false;
  // onFileUpload(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     if (
  //       file.type === 'application/vnd.ms-powerpoint' ||
  //       file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  //     ) {
  //       this.isUploading = true;

  //       this.courseService.uploadFile(file).subscribe(
  //         (response) => {
  //           const byteCharacters = atob(response.fileContent);
  //           const byteNumbers = new Array(byteCharacters.length);
  //           for (let i = 0; i < byteCharacters.length; i++) {
  //             byteNumbers[i] = byteCharacters.charCodeAt(i);
  //           }
  //           const byteArray = new Uint8Array(byteNumbers);
  //           const blob = new Blob([byteArray], { type: 'application/pdf' });
  //           const fileToUpload = new File([blob], response.filename, { type: 'application/pdf' });
  //          this.uploadedDocument = file.name;
  //           this.docs = fileToUpload;
  //           const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  //           if (fileInput) {
  //             const dataTransfer = new DataTransfer();
  //             dataTransfer.items.add(fileToUpload);
  //             fileInput.files = dataTransfer.files; 
  //           }
  //           this.isUploading = false;
  //         },
  //         (error) => {
  //           //console.error('File upload failed', error);
  //           this.isUploading = false;
  //           Swal.fire('Upload Failed', 'Unable to convert the file.', 'error');
  //         }
  //       );
  //     } else {
  //       this.uploadedDocument = file.name;
  //       this.docs = file;
  //     }
  //   }
  // }
  onFileUpload(event: any, isScormKit:boolean=false) {
    const file = event.target.files[0];
    // console.log("Selected file:", file.name, "Type:", file.type);
    const allowedFileTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint', 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain' 
    ];
    if(isScormKit){
      allowedFileTypes.push('application/x-zip-compressed')
    }
  
    if (file) {
      if (allowedFileTypes.includes(file.type)) {
        if (
          file.type === 'application/vnd.ms-powerpoint' ||
          file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ) {
          this.isUploading = true;
  
          this.courseService.uploadFile(file).subscribe(
            (response) => {
              const byteCharacters = atob(response.fileContent);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: 'application/pdf' });
              const fileToUpload = new File([blob], response.filename, { type: 'application/pdf' });
  
              this.uploadedDocument = file.name;
              this.docs = fileToUpload;
  
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              if (fileInput) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(fileToUpload);
                fileInput.files = dataTransfer.files;
              }
              this.isUploading = false;
            },
            (error) => {
              this.isUploading = false;
              Swal.fire('Upload Failed', 'Unable to convert the file.', 'error');
            }
          );
        } else {
          this.uploadedDocument = file.name;
          this.docs = file;
        }
      } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Selected format doesn\'t support. Only document formats are allowed!',
          icon: 'error',
        });
      }
    }
  }
  
}
