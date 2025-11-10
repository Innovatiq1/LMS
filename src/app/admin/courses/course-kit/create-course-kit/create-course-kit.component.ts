import { Component, ElementRef, OnInit, EventEmitter, Output, ViewChild, Inject, Optional } from '@angular/core';
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
// import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenService } from '@core/service/authen.service';
import { ScormPkgCreateComponent } from 'app/student/settings/scorm-pkg/scorm-pkg-create/scorm-pkg-create.component';
import { MatTableDataSource } from '@angular/material/table';

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
  // @Output() courseKitCreated = new EventEmitter<CourseKit>();
  @Output() courseKitCreated = new EventEmitter<any>();
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
  dialogStatus: boolean = false;
  kitOpt: any[] = [
    { code: 'course', label: 'Course' },
    { code: 'scorm', label: 'Scorm' },
    { code: 'imscc', label: 'IMSCC' },
  ];
  kitType: any[] = [];
  isScormKit: boolean = false;
  SCORM_KIT: boolean = false;
  scorm_kit_list: any[] = [];

  fileTypeOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'img', label: 'Image (PNG, JPG, GIF)' },
    { value: 'word', label: 'Word' },
    { value: 'ppt', label: 'PPT' },
    { value: 'txt', label: 'Text File (.txt)' },
    { value: 'excel', label: 'Excel File (.xlsx)' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'thirdparty', label: '3rd Party Learning Link (Udemy, GDrive,YouTube)' }
  ];
  
  fileSizeOptions = [5, 10, 20, 50, 100];
  
  showFileSizeDropdown = false;
  showChooseFile = false;
  showThirdPartyInput = false;
  acceptedFormats = '';
  selectedFileName = '';
  // uploadedFiles: any[] = [];
  uploadedFiles: any[] = [];
uploadedFilesDataSource = new MatTableDataSource<any>();
uploadedDisplayedColumns: string[] = ['fileName', 'fileSize', 'fileType', 'actions'];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data11: any,
    private router: Router,

    private formBuilder: FormBuilder,
    public utils: UtilsService,
    private modalServices: BsModalService,
    private courseService: CourseService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private certificateService: CertificateService,
    private formService: FormService,
    @Optional() private dialogRef: MatDialogRef<CreateCourseKitComponent>,
    private authenService: AuthenService,
    private _router: Router,
    private dialog: MatDialog
  ) {
    if (data11) {
      this.dialogStatus = true;
      // console.log("Received variable:", data11.variable);
    }
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
      allowDownload: new FormControl(false),
      fileType: new FormControl('', [Validators.required]),
       fileSize: new FormControl('',[Validators.required]),
     thirdPartyLink: new FormControl('',[]),
      videoLink: new FormControl('', [...this.utils.validators.noLeadingSpace]),
      kitType: new FormControl('course', [
        ...this.utils.validators.longDescription,
        ...this.utils.validators.noLeadingSpace,
      ]),
      scormKit: new FormControl(null, [])
    });

    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.courseId = params.id;
      }
    );

    this.courseKitForm.get('kitType')?.valueChanges.subscribe((value) => {
      if (value === 'scorm' || value === 'imscc') {
        this.isScormKit = true;
        this.courseKitForm.patchValue({
          videoLink: '',
          documentLink: '',
        });
        this.fetchScormKits();
      } else {
        this.isScormKit = false;
      }
    });
  }

  // onFileTypeChange(fileType: string) {
  //   this.showFileSizeDropdown = false;
  //   this.showChooseFile = false;
  //   this.showThirdPartyInput = false;
  //   this.acceptedFormats = '';
  
  //   switch (fileType) {
  //     case 'pdf':
  //       this.acceptedFormats = '.pdf';
  //       this.showFileSizeDropdown = true;
  //       this.showChooseFile = true;
  //       break;
  //     case 'img':
  //       this.acceptedFormats = 'image/png,image/jpeg,image/jpg,image/gif';
  //       this.showFileSizeDropdown = true;
  //       this.showChooseFile = true;
  //       break;
  //     case 'word':
  //       this.acceptedFormats = '.doc,.docx';
  //       this.showFileSizeDropdown = true;
  //       this.showChooseFile = true;
  //       break;
  //     case 'ppt':
  //       this.acceptedFormats = '.ppt,.pptx';
  //       this.showFileSizeDropdown = true;
  //       this.showChooseFile = true;
  //       break;
  //     case 'video':
  //       this.acceptedFormats = 'video/mp4,video/x-matroska,video/x-msvideo';
  //       this.showFileSizeDropdown = true;
  //       this.showChooseFile = true;
  //       break;
  //     case 'audio':
  //       this.acceptedFormats = 'audio/mp3,audio/wav,audio/aac';
  //       this.showFileSizeDropdown = true;
  //       this.showChooseFile = true;
  //       break;
  //     case 'youtube':
  //     case 'thirdparty':
  //       this.showThirdPartyInput = true;
  //       break;
  //   }
  // }
  onFileTypeChange(fileType: string) {
    this.showFileSizeDropdown = false;
    this.acceptedFormats = '';
    this.showThirdPartyInput = false;
  
    switch (fileType) {
      case 'pdf':
        this.acceptedFormats = '.pdf';
        break;
      case 'img':
        this.acceptedFormats = 'image/png,image/jpeg,image/jpg,image/gif';
        break;
      case 'word':
        this.acceptedFormats = '.doc,.docx';
        break;
      case 'ppt':
        this.acceptedFormats = '.ppt,.pptx';
        break;
      case 'txt':
          this.acceptedFormats = '.txt';
          break;
      case 'excel':
          this.acceptedFormats = '.xlsx';
          break;
      case 'video':
        this.acceptedFormats = 'video/mp4,video/x-matroska,video/x-msvideo';
        break;
      case 'audio':
        this.acceptedFormats = 'audio/mp3,audio/wav,audio/aac';
        break;
      case 'youtube':
      case 'thirdparty':
        this.showThirdPartyInput = true;
        break;
    }
  
    // Always show Document upload for allowed formats
    if (['pdf', 'img', 'word', 'ppt', 'video', 'audio','txt', 'excel'].includes(fileType)) {
      this.showFileSizeDropdown = true;
    }
  }
  
  onSelectedFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      // You can store the file to FormData or variable
    }
  }
  fetchScormKits() {
    var companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const selectedKitType = this.courseKitForm.get('kitType')?.value;
    
    if (selectedKitType === 'imscc') {
      // Fetch IMSCC kits
      this.courseService.getImsccKits(companyId).subscribe((res: any) => {
        this.scorm_kit_list = res.data;
      });
    } else {
      // Fetch SCORM kits (default)
      this.courseService.getScormKits(companyId).subscribe((res: any) => {
        this.scorm_kit_list = res.data;
      });
    }
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
    const roleDetails = this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this._router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId = "course-kit";
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let SCORM_KIT = actions.some((item: any) => item.title == 'SCORM Kit' && item.checked);

    this.SCORM_KIT = SCORM_KIT;
    if (!this.SCORM_KIT) {
      this.kitType = this.kitOpt.filter(v => v.code != 'scorm')
    } else {
      this.kitType = this.kitOpt
    }

    this.getForms();
    this.courseService.getAllCourseKit().subscribe((data) => { });
  }

  // submitCourseKit1() {
  //   if (this.courseKitForm.valid) {
  //     const formdata = new FormData();
  //     if (this.docs) {
  //       formdata.append('files', this.docs);
  //     }
  //     if (this.videoLink && !this.isScormKit) {
  //       formdata.append('files', this.videoLink);
  //     }
  //     if (!this.isScormKit) {
  //       formdata.append('video_filename', this.videoSrc || '');
  //       formdata.append('doc_filename', this.uploadedDocument || '');
  //     }
  //     let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  //     formdata.append('companyId', userId);
  //     if (this.isScormKit) {
  //       const courseKitData: CourseKit = this.courseKitForm.value;
  //       delete courseKitData.videoLink;
  //       delete courseKitData.documentLink;
  //       if (courseKitData) {
  //         this.createCourseKit(courseKitData);
  //       }
  //     } else {
  //       Swal.fire({
  //         title: 'Uploading...',
  //         text: 'Please wait...',
  //         allowOutsideClick: false,
  //         timer: 90000,
  //         timerProgressBar: true,
  //       });
  //       setTimeout(() => {
  //         if (formdata) {
  //           console.log("form data--",formdata)
  //           this.courseService.saveVideo(formdata).subscribe((data) => {
  //             console.log("rrrrrrData",data);
  //             const courseKitData: CourseKit = this.courseKitForm.value;
  //             courseKitData.videoLink = data.data._id;
  //             courseKitData.documentLink = data.data.document || '';
  //             if (courseKitData) {
  //               this.createCourseKit(courseKitData);
  //             }
  //           });

  //         }
  //       }, 5000);
  //     }
  //   } else {
  //     this.courseKitForm.markAllAsTouched();
  //   }



  // }
//the below submitCourseKit1() working fine for the single docuemtn and video file and scromKit 
  // submitCourseKit1() {
  //   if (this.courseKitForm.valid) {
  //     const formdata = new FormData();
  
  //     console.log("this.uploadedFiles",this.uploadedFiles)
  //     this.uploadedFiles.forEach(fileObj => {
  //       formdata.append('files', fileObj.file);
  //     });
  //     formdata.append('file_names', JSON.stringify(this.uploadedFiles.map(f => f.name)));
  
  //     // Add other form fields
  //     if (!this.isScormKit) {
  //       formdata.append('video_filename', this.videoSrc || '');
  //       formdata.append('doc_filename', this.uploadedFiles.map(f => f.name).join(', '));
  //     }
  
  //     const userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  //     formdata.append('companyId', userId);
  
  //     if (this.isScormKit) {
  //       const courseKitData: CourseKit = this.courseKitForm.value;
  //       delete courseKitData.videoLink;
  //       delete courseKitData.documentLink;
  
  //       if (courseKitData) {
  //         this.createCourseKit(courseKitData);
  //       }
  //     } else {
  //       Swal.fire({
  //         title: 'Uploading...',
  //         text: 'Please wait...',
  //         allowOutsideClick: false,
  //         timer: 90000,
  //         timerProgressBar: true,
  //       });
  
  //       setTimeout(() => {
  //         console.log("Formadata",formdata)
  //         this.courseService.saveVideo(formdata).subscribe((data) => {
  //           const courseKitData: CourseKit = this.courseKitForm.value;
  //           courseKitData.videoLink = data.data._id;
  //           courseKitData.documentLink = data.data.document || '';
  //           if (courseKitData) {
  //             this.createCourseKit(courseKitData);
  //           }
  //         });
  //       }, 5000);
  //     }
  //   } else {
  //     this.courseKitForm.markAllAsTouched();
  //   }
  // }

  //in below method i am adding the features that handel the multiple different type files 
  submitCourseKit1() {
    console.log("this.courseKitForm.valid",this.courseKitForm.valid)
    console.log("this.courseKitForm.valid",this.courseKitForm)
    if (true) {
      const formdata = new FormData();
      const thirdPartyLinks:any = [];
  
      this.uploadedFiles.forEach(fileObj => {
        if (fileObj.type === 'thirdparty') {
          thirdPartyLinks.push({
            name: fileObj.name,
            thirdPartyLink: fileObj.thirdPartyLink,
            type: fileObj.type
          });
        } else {
          formdata.append('files', fileObj.file);
        }
      });
  
      formdata.append('file_names', JSON.stringify(this.uploadedFiles.map(f => f.name)));
  
      const userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      formdata.append('companyId', userId);
      formdata.append('allowDownload', this.courseKitForm.get('allowDownload')?.value);
  
      if (!this.isScormKit) {
        formdata.append('thirdPartyLinks', JSON.stringify(thirdPartyLinks));
        formdata.append('courseKitName', this.courseKitForm.value.name);
        formdata.append('uploadedBy', 'Prosanjeet');
  
        formdata.append('video_filename', this.videoSrc || '');
        formdata.append('doc_filename', this.uploadedFiles.map(f => f.name).join(', '));
  
        Swal.fire({
          title: 'Uploading...',
          text: 'Please wait...',
          allowOutsideClick: false,
          timer: 90000,
          timerProgressBar: true,
        });
  
        setTimeout(() => {
          console.log("Formadata", formdata);
          this.courseService.uploadMultiFiles(formdata).subscribe((res) => {
            const courseKitData: CourseKit = this.courseKitForm.value;
            courseKitData.videoLink = res.data._id;
            courseKitData.documentLink = res.data.files?.find((f:any) => !f.isThirdParty && f.type.includes('application'))?.url || '';
            this.createCourseKit(courseKitData);
          });
        }, 5000);
  
      } else {
        console.log("uploading the scrom kit",this.courseKitForm.value)
        const courseKitData: CourseKit = this.courseKitForm.value;
        delete courseKitData.videoLink;
        delete courseKitData.documentLink;
  
        if (courseKitData) {
          this.createCourseKit(courseKitData);
        }
      }
  
    } else {
      this.courseKitForm.markAllAsTouched();
    }
  }
  
  
  // private createCourseKit(courseKitData: CourseKit): void {
  //   let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  //       Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You want to create a course kit!',
  //     icon: 'warning',
  //     confirmButtonText: 'Yes',
  //     showCancelButton: true,
  //     cancelButtonColor: '#d33',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //        courseKitData.companyId=userId;
  //       this.courseService.createCourseKit(courseKitData).subscribe(
  //         (res) => {
  //           Swal.fire({
  //             title: 'Successful',
  //             text: 'Course Kit created successfully',
  //             icon: 'success',
  //           });
  //           this.courseKitForm.reset();
  //           this.router.navigateByUrl('/admin/courses/course-kit');
  //         },
  //         (error) => {
  //           Swal.fire(
  //             'Failed to create course kit',
  //             error.message || error.error,
  //             'error'
  //           );
  //         }
  //       );
  //     }
  //   });
  // }
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  private createCourseKit(courseKitData: CourseKit): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    console.log("courseKitData111",courseKitData)
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
            if (this.dialogRef) {
              this.dialogRef.close();
            }
            if (!this.dialogStatus) {
              this.router.navigateByUrl('/admin/courses/course-kit');
            }

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
    // console.log("fileType==",file.type)

    // Check if the selected file is a video and its size is less than 10MB
    if ((file.type.startsWith('video/') || file.type.startsWith('audio/')) && file.size <= 10000000) {
      this.videoLink = file;
      this.videoSrc = this.videoLink.name;
    } else if (!(file.type.startsWith('video/') || file.type === 'audio/mp3')) {
      Swal.fire({
        title: 'Oops...',
        text: 'Selected format doesn\'t support. Only video and MP3 formats are allowed!',
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
      if (item.type.startsWith('video/') || item.type.startsWith('audio')) {
        item.progress = 0;
        this.files.push(item);
        this.model.vltitle = item.name;
      } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Selected format doesn\'t support. Only video and MP3 formats are allowed!',
          icon: 'error',
        });
      }
    }
  }
  isUploading = false;

  
 
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;

onFileUpload(event: any, isScormKit: boolean = false) {
  const file = event.target.files[0];
  if (!file) return;

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'video/mp4',
    'video/x-matroska',
    'video/x-msvideo',
    'audio/mp3',
    'audio/wav',
    'audio/aac',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
  ];

  if (isScormKit) {
    allowedFileTypes.push('application/x-zip-compressed');
  }

  if (!allowedFileTypes.includes(file.type)) {
    Swal.fire('Oops...', 'Unsupported format selected.', 'error');
    this.resetFileInput(); 
    return;
  }

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
        this.isUploading = false;

        this.resetFileInput();
      },
      () => {
        this.isUploading = false;
        this.resetFileInput();
        Swal.fire('Upload Failed', 'Unable to convert the file.', 'error');
      }
    );
  } else {
    this.uploadedDocument = file.name;
    this.docs = file;
    this.resetFileInput(); 
  }
}
resetFileInput() {
  if (this.fileInputRef) {
    this.fileInputRef.nativeElement.value = '';
  }
}
 
  // addUploadedFile() {
  //   if (this.docs) {
  //     const file = this.docs;
  //     if (this.uploadedFiles.some(f => f.name === file.name && f.size === (file.size / 1024).toFixed(2))) {
  //       Swal.fire('Duplicate File', 'This file is already added.', 'warning');
  //       return;
  //     }
  
  //     this.uploadedFiles.push({
  //       name: file.name,
  //       size: (file.size / 1024).toFixed(2),
  //       type: file.type,
  //       file: file,
  //     });
  
  //     this.uploadedFilesDataSource.data = [...this.uploadedFiles];
  
  //     this.docs = null;
  //     this.uploadedDocument = '';
  //     this.courseKitForm.get('documentLink')?.reset();
  //   }
  // }
  
  addUploadedFile() {
    const thirdPartyLink = this.courseKitForm.get('thirdPartyLink')?.value;
  
    if (this.showThirdPartyInput && thirdPartyLink) {
      const existing = this.uploadedFiles.some(
        f => f.type === 'thirdparty' && f.thirdPartyLink === thirdPartyLink
      );
      if (existing) {
        Swal.fire('Duplicate Link', 'This third-party link is already added.', 'warning');
        return;
      }
  
      this.uploadedFiles.push({
        name: thirdPartyLink, 
        size: 0,
        type: 'thirdparty',
        thirdPartyLink: thirdPartyLink
      });
  
      this.uploadedFilesDataSource.data = [...this.uploadedFiles];
      this.courseKitForm.get('thirdPartyLink')?.reset();
      return;
    }
  
    if (this.docs) {
      const file = this.docs;
      const size = (file.size / 1024).toFixed(2);
      if (this.uploadedFiles.some(f => f.name === file.name && f.size === size)) {
        Swal.fire('Duplicate File', 'This file is already added.', 'warning');
        return;
      }
  
      this.uploadedFiles.push({
        name: file.name,
        size: size,
        type: file.type,
        file: file
      });
  
      this.uploadedFilesDataSource.data = [...this.uploadedFiles];
      this.docs = null;
      this.uploadedDocument = '';
      this.courseKitForm.get('documentLink')?.reset();
    }
  }
  

  deleteFile(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.uploadedFilesDataSource.data = [...this.uploadedFiles]; 
  }
  
  viewFile(file: any) {
    const blob = new Blob([file.file], { type: file.type });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  openCreateContentPackage() {
    const dialogRef = this.dialog.open(ScormPkgCreateComponent, {
      width: '70%',
      height: '80%',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: false,
      data: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.fetchScormKits();
    });
  }

  getKitLabel(): string {
    const selectedKitType = this.courseKitForm.get('kitType')?.value;
    if (selectedKitType === 'scorm') {
      return 'Scorm Kit';
    } else if (selectedKitType === 'imscc') {
      return 'IMSCC Kit';
    }
    return 'Scorm Kit'; // Default fallback
  }
}
