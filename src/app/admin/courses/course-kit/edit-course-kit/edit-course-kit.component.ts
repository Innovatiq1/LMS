import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseKit, CourseKitModel } from '@core/models/course.model';
import { CertificateService } from '@core/service/certificate.service';
import { CommonService } from '@core/service/common.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ScormPkgCreateComponent } from '../../../../student/settings/scorm-pkg/scorm-pkg-create/scorm-pkg-create.component';
import { MatTableDataSource } from '@angular/material/table';
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
  // acceptedFormats: string = ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt";
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
    private router: Router,
    private dialog: MatDialog,
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
        allowDownload: new FormControl(false),
      fileType: new FormControl('', [Validators.required]),
       fileSize: new FormControl('',[Validators.required]),
     thirdPartyLink: new FormControl('',[]),
      videoLink: new FormControl('', [
        ...this.utils.validators.noLeadingSpace,]),
      kitType: new FormControl('', [...this.utils.validators.descripton,
      ...this.utils.validators.noLeadingSpace]),
      scormKit: new FormControl(null, [])
    });

    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.courseId = params.id;
      }
    );

    this.courseKitForm.get('kitType')?.valueChanges.subscribe((value) => {
      if (value === 'scorm') {
        this.acceptedFormats = ".zip";
        this.isScormKit = true;
        this.courseKitForm.patchValue({
          videoLink: '',
          documentLink: '',
          scormKit: null,
        });
      } else {
        this.acceptedFormats = '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt';
        this.isScormKit = false;
      }
    });
  }
  fetchScormKits() {
    var companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.courseService.getScormKits(companyId).subscribe((res: any) => {
      this.scorm_kit_list = res.data;
    })
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
  // submitCourseKit(): void {
  //   const formdata = new FormData();
  //   formdata.append('files', this.docs);
  //   if (this.videoLink && !this.isScormKit) {
  //     formdata.append('files', this.videoLink);
  //   }
  //   if (!this.isScormKit) {
  //     formdata.append('video_filename', this.videoSrc);
  //     formdata.append('doc_filename', this.uploadedDocument);
  //   }
  //   if (this.isScormKit) {
  //     const courseKitData: CourseKit = this.courseKitForm.value;
  //     delete courseKitData.videoLink;
  //     delete courseKitData.documentLink;
  //     if (courseKitData) {
  //       this.editCourseKit(courseKitData);
  //     }
  //   } else {
  //     Swal.fire({
  //       title: 'Uploading...',
  //       text: 'Please wait...',
  //       allowOutsideClick: false,
  //       timer: 90000,
  //       timerProgressBar: true,
  //     });
  //     if (!this.docs) {
  //       const courseKitData: CourseKit = this.courseKitForm.value;
  //       delete courseKitData.videoLink;
  //       delete courseKitData.documentLink;
  //       this.editCourseKit(courseKitData);
  //     } else {
  //       this.courseService.updateVideo(this.videoId, formdata).subscribe((data) => {
  //         const courseKitData: CourseKit = this.courseKitForm.value;
  //         courseKitData.videoLink = data.data._id;
  //         courseKitData.documentLink = data.data.document;
  //         this.editCourseKit(courseKitData);
  //       },
  //         (error) => {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Upload Failed',
  //             text: 'An error occurred while uploading the video',
  //           });
  //           Swal.close();
  //         });
  //     }
  //   }
  // }
  submitCourseKit(): void {
    if (!this.courseKitForm.valid) {
      this.courseKitForm.markAllAsTouched();
      return;
    }
  
    const formdata = new FormData();
    const thirdPartyLinks: any[] = [];
    const existingFiles: any[] = [];
  
    // Separate files
    this.uploadedFiles.forEach(fileObj => {
      if (fileObj.type === 'thirdparty') {
        // Third party links
        thirdPartyLinks.push({
          name: fileObj.name,
          thirdPartyLink: fileObj.thirdPartyLink,
          type: fileObj.type
        });
      } else if (fileObj.file) {
        // New file uploaded in this session
        formdata.append('files', fileObj.file);
  
        // Also add to existingFiles so it persists after update
        existingFiles.push({
          name: fileObj.name,
          size: fileObj.size,
          type: fileObj.type,
          url: fileObj.url || '' // backend will overwrite later
        });
      } else {
        // Existing file from DB
        existingFiles.push({
          name: fileObj.name,
          size: fileObj.size,
          type: fileObj.type,
          url: fileObj.url
        });
      }
    });
  
    formdata.append('file_names', JSON.stringify(this.uploadedFiles.map(f => f.name)));
  
    const userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    formdata.append('companyId', userId);
    formdata.append('allowDownload', this.courseKitForm.get('allowDownload')?.value);
  
    if (!this.isScormKit) {
      formdata.append('thirdPartyLinks', JSON.stringify(thirdPartyLinks));
      formdata.append('existingFiles', JSON.stringify(existingFiles));
      formdata.append('courseKitName', this.courseKitForm.value.name);
      formdata.append('uploadedBy', 'Prosanjeet');
  
      formdata.append('video_filename', this.videoSrc || '');
      formdata.append('doc_filename', this.uploadedFiles.map(f => f.name).join(', '));
  
      // Debug log before sending
      console.log('📦 FormData values before sending:');
      formdata.forEach((value, key) => {
        if (value instanceof File) {
          console.log(key, '=> File:', value.name, '(', value.type, ')', 'size:', value.size);
        } else {
          console.log(key, '=>', value);
        }
      });
      console.log('📂 thirdPartyLinks:', thirdPartyLinks);
      console.log('📂 existingFiles:', existingFiles);
  
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait...',
        allowOutsideClick: false,
        timer: 90000,
        timerProgressBar: true,
      });
  
      this.courseService.updateMultiFiles(this.videoId, formdata).subscribe(
        (res) => {
          console.log("rrrrrrrrrr",res)
          const courseKitData: CourseKit = this.courseKitForm.value;
          courseKitData.videoLink = res.data._id;
  
          // Update documentLink with the actual uploaded file URL
          courseKitData.documentLink =
            res.data.files?.find((f: any) => !f.isThirdParty && f.type.includes('application'))?.url || '';
  
           this.editCourseKit(courseKitData);
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'An error occurred while uploading the video',
          });
          Swal.close();
        }
      );
    } else {
      const courseKitData: CourseKit = this.courseKitForm.value;
      delete courseKitData.videoLink;
      delete courseKitData.documentLink;
  
      if (courseKitData) {
        this.editCourseKit(courseKitData);
      }
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
        if (response.course?.videoLink?.length > 0) {
          let courseKitDetails = response.course.videoLink[0];
          this.videoId = courseKitDetails._id
          this.videoSrc = courseKitDetails.video_filename;
          this.uploadedDocument = courseKitDetails.doc_filename;
          this.acceptedFormats = '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt';
        } else {
          this.acceptedFormats = '.zip';
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
          scormKit: response?.course?.scormKit?.id,
          allowDownload: response?.course?.allowDownload
        });

        
  
        // if files exist from API, map them into uploadedFiles
        if (response.course?.videoLink?.length > 0 && response.course.videoLink[0].files) {
          this.uploadedFiles = response.course.videoLink[0].files.map((f: any) => {
            return {
              name: f.name,
              size: parseFloat(f.size), // remove "KB" if string
              type: f.isThirdParty ? 'thirdparty' : f.type,
              thirdPartyLink: f.isThirdParty ? f.name : null,
              url: f.url
            };
          });
  
          // update the datasource for mat-table
          this.uploadedFilesDataSource.data = [...this.uploadedFiles];
        }
        if (this.kitType === 'scorm') {
          this.fetchScormKits();
        }
      }
    });
  }
  onFileDropped($event: any) {
    this.prepareFilesList($event);
    this.fileName = '';
  }

  //Edit coursekit new features ss

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
        file: file,
         url: '',
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

  // viewFile(file: any) {
  //   const blob = new Blob([file.file], { type: file.type });
  //   const url = URL.createObjectURL(blob);
  //   window.open(url, '_blank');
  // }

  viewFile(file: any) {
    if (file?.url) {
      window.open(file.url, '_blank');
    }
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
    const allowedFormats = ['video/mp4', 'video/x-matroska', 'video/x-msvideo', 'audio/mp3', 'audio/wav', 'audio/aac', 'audio/mpeg'];
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
 
  onFileUpload(event: any, isScormKit: boolean = false) {
    const file = event.target.files[0];
    // console.log("Selected file:", file.name, "Type:", file.type);
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

  openCreateScormPackage() {
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



}
