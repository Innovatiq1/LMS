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
      items: ['Settings'],
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
      documentLink: new FormControl('', [
        //Validators.required,
       // ...this.utils.validators.imagePath,
        //...this.utils.validators.noLeadingSpace,
      ]),
      shortDescription: new FormControl('', [
       // Validators.required,
        ...this.utils.validators.descripton,
        ...this.utils.validators.noLeadingSpace,
      ]),
      longDescription: new FormControl('', [
      //  Validators.required,
        ...this.utils.validators.longDescription,
        ...this.utils.validators.noLeadingSpace,
      ]),
      videoLink: new FormControl('', [
        // Validators.required,
        //...this.utils.validators.imagePath,
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
      shortDescription: ['',Validators.required],
      longDescription: ['',Validators.required],
      videoLink: ['',Validators.required],
      documentLink: ['',[]],
    });
  }
  startDateChange(element: { end: any; start: any }) {
    element.end = element.start;
  }
  ngOnInit(): void {
    this.getForms();
    this.courseService.getAllCourseKit().subscribe((data) => {
    });
  }
  submitCourseKit1() {
    if(this.courseKitForm.valid) {
      const formdata = new FormData();
      if (this.docs) {
        formdata.append('files', this.docs);
      }
      if (this.videoLink) {
        formdata.append('files', this.videoLink);
      }
      formdata.append('video_filename', this.videoSrc || '');
      formdata.append('doc_filename', this.uploadedDocument || '');
      // formdata.append('files', this.docs);
      // formdata.append('files', this.videoLink);
      // formdata.append('video_filename', this.videoSrc);
      // formdata.append('doc_filename', this.uploadedDocument);
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
      setTimeout(() => {
        if(formdata){
          this.courseService.saveVideo(formdata).subscribe((data) => {
            const courseKitData: CourseKit = this.courseKitForm.value;
            courseKitData.videoLink = data.data._id;
           courseKitData.documentLink = data.data.document || '';
           // courseKitData.documentLink = data.data.document ||'';
            if(courseKitData){
              this.createCourseKit(courseKitData);
            }
          });
        }
      }, 5000);
    }else{
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
         courseKitData.companyId=userId;
        this.courseService.createCourseKit(courseKitData).subscribe(
          (res) => {
            console.log('res', res);
            Swal.fire({
              title: 'Successful',
              text: 'Course Kit created successfully',
              icon: 'success',
            });
            // this.fileDropEl.nativeElement.value = "";
            this.courseKitForm.reset();
            // this.toggleList()
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
      .getAllForms(userId,'Course kit Creation Form')
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

  //videoUpload
  fileBrowseHandler(event: any) {
    const file = event.target.files[0];
    if(file.size <= 10000000){
    this.videoLink = file;
    this.videoSrc = this.videoLink.name;
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload media.Please upload less than 10mb.',
        icon: 'error',
      });
    }
  }

  // fileBrowseHandler(event: any) {
  //   const files = event.target.files;
  //   this.onFileDropped(files);
  // }
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      this.model.vltitle = item.name;
    }
    //this.fileDropEl.nativeElement.value = "";
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.docs = file;
    this.uploadedDocument = this.docs.name;
  }
}
