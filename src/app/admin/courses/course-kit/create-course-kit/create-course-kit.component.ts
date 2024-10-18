import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseKit, CourseKitModel } from '@core/models/course.model';
import { CommonService } from '@core/service/common.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { CertificateService } from '@core/service/certificate.service';
import { FormService } from '@core/service/customization.service';

@Component({
  selector: 'app-create-course-kit',
  templateUrl: './create-course-kit.component.html',
  styleUrls: ['./create-course-kit.component.scss'],
})
export class CreateCourseKitComponent implements OnInit {
  breadscrums = [
    {
      title: 'Create Course Kit',
      items: ['Course kit'],
      active: 'Create Course Kit',
    },
  ];
  @ViewChild('fileDropRef', { static: false })
  currentVideoIds: string[] = [];
  fileDropEl!: ElementRef;
  courseKitModel!: Partial<CourseKitModel>;
  files: any[] = [];
  templates: any[] = [];
  list = true;
  // edit = false;
  courseKits!: any;
  courseKitForm!: FormGroup;
  pageSizeArr = this.utils.pageSizeArr;
  dataSource: any;
  displayedColumns!: string[];

  isSubmitted = false;

  totalItems: any;
  currentDate: Date;
  model = {
    coursename: '',
    sd: '',
    ld: '',
    dl: '',
    vltitle: '',
    selectopt: false,
  };
  fileDropRef: any;
  subscribeParams: any;
  courseId!: string;
  course: any;
  fileName: any;
  uploadedDocument: any;
  uploaded: any;
  documentLink: any;
  docs: any;
  videoLink: any;
  videoSrc: any;
  forms!: any[];
  kitType: any[] = [
    { code: 'course', label: 'Course' },
    { code: 'scorm', label: 'Scorm' },
  ];
  isScormKit: boolean = false;

  constructor(
    private router: Router,

    private formBuilder: FormBuilder,
    public utils: UtilsService,
    private modalServices: BsModalService,
    private courseService: CourseService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private certificateService: CertificateService,
    private formService: FormService
  ) {
    this.currentDate = new Date();
    this.courseKitModel = {};

    this.courseKitForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        ...this.utils.validators.name,
        ...this.utils.validators.noLeadingSpace,
      ]),
      documentLink: new FormControl('', []),
      shortDescription: new FormControl('', [
        ...this.utils.validators.descripton,
        ...this.utils.validators.noLeadingSpace,
      ]),
      longDescription: new FormControl('', [
        ...this.utils.validators.longDescription,
        ...this.utils.validators.noLeadingSpace,
      ]),
      videoLink: new FormControl('', [...this.utils.validators.noLeadingSpace]),
      kitType: new FormControl('course', [
        ...this.utils.validators.longDescription,
        ...this.utils.validators.noLeadingSpace,
      ]),
    });

    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.courseId = params.id;
      }
    );

    this.courseKitForm.get('kitType')?.valueChanges.subscribe((value) => {
      if (value === 'scorm') {
        this.isScormKit = true;
      this.courseKitForm.patchValue({
        videoLink: '',
        documentLink: '',
      });
      } else {
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
  initCourseKitForm(): void {
    this.courseKitForm = this.formBuilder.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: ['', Validators.required],
      videoLink: ['', Validators.required],
      documentLink: ['', []],
      kitType: ['course', Validators.required],
    });
  }
  startDateChange(element: { end: any; start: any }) {
    element.end = element.start;
  }
  ngOnInit(): void {
    this.getForms();
    this.courseService.getAllCourseKit().subscribe((data) => {});
  }
  submitCourseKit1() {
    if (this.courseKitForm.valid) {
      const formdata = new FormData();
      if (this.docs) {
        formdata.append('files', this.docs);
      }
      if (this.videoLink && !this.isScormKit) {
        formdata.append('files', this.videoLink);
      }
      if (!this.isScormKit) {
        formdata.append('video_filename', this.videoSrc || '');
        formdata.append('doc_filename', this.uploadedDocument || '');
      }
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait...',
        allowOutsideClick: false,
        timer: 90000,
        timerProgressBar: true,
      });
      setTimeout(() => {
        if (formdata) {
          if (this.isScormKit) {
            this.courseService.saveScormKit(formdata).subscribe((data) => {
              const courseKitData: CourseKit = this.courseKitForm.value;
              delete courseKitData.videoLink;
              delete courseKitData.documentLink;
              courseKitData.scormKit = data.data._id;
              if (courseKitData) {
                this.createCourseKit(courseKitData);
              }
            });
          } else {
            this.courseService.saveVideo(formdata).subscribe((data) => {
              const courseKitData: CourseKit = this.courseKitForm.value;
              courseKitData.videoLink = data.data._id;
              courseKitData.documentLink = data.data.document || '';
              if (courseKitData) {
                this.createCourseKit(courseKitData);
              }
            });
          }
        }
      }, 5000);
    } else {
      this.courseKitForm.markAllAsTouched();
    }
  }
  private createCourseKit(courseKitData: CourseKit): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to create a course kit!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        courseKitData.companyId = userId;
        this.courseService.createCourseKit(courseKitData).subscribe(
          (res) => {
            Swal.fire({
              title: 'Successful',
              text: 'Course Kit created successfully',
              icon: 'success',
            });
            this.courseKitForm.reset();
            this.router.navigateByUrl('/admin/courses/course-kit');
          },
          (error) => {
            Swal.fire(
              'Failed to create course kit',
              error.message || error.error,
              'error'
            );
          }
        );
      }
    });
  }

  getForms(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.formService
      .getAllForms(userId, 'Course kit Creation Form')
      .subscribe((forms) => {
        this.forms = forms;
      });
  }

  labelStatusCheck(labelName: string): any {
    if (this.forms && this.forms.length > 0) {
      const status = this.forms[0]?.labels?.filter(
        (v: any) => v?.name === labelName
      );
      if (status && status.length > 0) {
        return status[0]?.checked;
      }
    }
    return false;
  }

  // fileBrowseHandler(event: any) {
  //   const file = event.target.files[0];
  //   if(file.size <= 10000000){
  //   this.videoLink = file;
  //   this.videoSrc = this.videoLink.name;
  //   } else {
  //     Swal.fire({
  //       title: 'Error',
  //       text: 'Failed to upload media.Please upload less than 10mb.',
  //       icon: 'error',
  //     });
  //   }
  // }
  fileBrowseHandler(event: any) {
    const file = event.target.files[0];
    
    // Check if the selected file is a video and its size is less than 10MB
    if (file.type.startsWith('video/') && file.size <= 10000000) {
      this.videoLink = file;
      this.videoSrc = this.videoLink.name;
    } else if (!file.type.startsWith('video/')) {
      Swal.fire({
        title: 'Oops...',
        text: 'Selected format doesn\'t support. Only video formats are allowed!',
        icon: 'error',
      });
    } else if (file.size > 10000000) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload media. Please upload a file less than 10MB.',
        icon: 'error',
      });
    }
  }
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }
  // prepareFilesList(files: Array<any>) {
  //   for (const item of files) {
  //     item.progress = 0;
  //     this.files.push(item);
  //     this.model.vltitle = item.name;
  //   }
  // }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      // Check if the file is a video format
      if (item.type.startsWith('video/')) {
        item.progress = 0;
        this.files.push(item);
        this.model.vltitle = item.name;
      } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Selected format doesn\'t support. Only video formats are allowed!',
          icon: 'error',
        });
      }
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
  //           this.uploadedDocument = file.name;
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
  onFileUpload(event: any, isScorm: boolean=false) {
    const file = event.target.files[0];
    
    let allowedFileTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'text/plain',
    ];
    if(isScorm){
      allowedFileTypes =[
        'application/x-zip-compressed'
      ]
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
