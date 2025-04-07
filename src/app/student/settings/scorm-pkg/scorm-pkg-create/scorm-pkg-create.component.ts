import { Component, ViewChild, Inject, Optional, ChangeDetectorRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CourseService } from '@core/service/course.service';
import { AuthenService } from '@core/service/authen.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-scorm-pkg-create',
  templateUrl: './scorm-pkg-create.component.html',
  styleUrls: ['./scorm-pkg-create.component.scss']
})
export class ScormPkgCreateComponent implements OnInit {
  breadscrums = [
    {
      title: 'SCORM Package',
      items: ['SCORM Package'],
      active: 'Create SCORM Package',
    },
  ];


  isEdit = false;
  hasDelete = false;

  pkgForm!: FormGroup;
  docs: any;
  uploadedDocument: any;
  dialogStatus: boolean = false;
  subscribeParams: any;

  scormKitId: any;


  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data11: any,
    private fb: FormBuilder,
    public utils: UtilsService,
    @Optional() private dialogRef: MatDialogRef<ScormPkgCreateComponent>,
    private cdRef: ChangeDetectorRef,
    private courseService: CourseService,
    private authenService: AuthenService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    if (data11) {
      this.dialogStatus = true;
    }


  }
  ngOnInit(): void {
    if(!this.dialogStatus){
    const roleDetails = this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath[3]}`;
    const childId = urlPath[urlPath.length - 2];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let deleteAction = actions.filter((item: any) => item.title == 'Delete')

    const isEdit = this.router.url.includes('update');
    if (isEdit) {
      this.isEdit = true;
      this.breadscrums[0].active = 'Edit SCORM Package';
    } else {
      this.isEdit = false;
      this.breadscrums[0].active = 'Create SCORM Package';
    }

    if (deleteAction.length > 0) {
      this.hasDelete = true;
    }
  }



    if (!this.pkgForm) {
      this.pkgForm = this.fb.group({
        title: new FormControl('', [
          Validators.required
        ]),
        documentLink: new FormControl('',),
      });
    }

    if (this.isEdit) {
      this.subscribeParams = this.activatedRoute.queryParams.subscribe(
        (params: any) => {
          this.scormKitId = params.id;
          this.courseService.getScormKit(this.scormKitId).subscribe((res: any) => {
            this.pkgForm.patchValue({
              title: res.data.title,
              // documentLink: res.data.fileName,
            });
            this.uploadedDocument = res.data.fileName;
          })
        }
      );
    }
  }

  ngAfterViewInit(): void {
    // If any updates are made after view initialization, call detectChanges
    this.cdRef.detectChanges();
  }


  submitSCORMKit() {
    if(!this.isEdit && this.docs == null){
      Swal.fire({
        title: 'Error',
        text: 'Please upload a file',
        icon: 'error',
      });
      return;
    }
    if (this.pkgForm.valid && (this.isEdit || this.docs)) {
      const formdata = new FormData();
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      formdata.append('companyId', userId);
      let msg = this.isEdit ? 'You want to update the SCORM Package!' : 'You want to create a SCORM Package!';
      if (this.docs) {
        const isPDF = this.docs?.type === 'application/pdf';
        if (isPDF) {
          formdata.append('file', this.docs);
        } else {
          formdata.append('file', this.docs);
        }
        msg =!this.isEdit && isPDF ? 'You want to create a SCORM Package!' : 'You want to upload SCORM Package';
      }
      const data = this.pkgForm.value;
      formdata.append('title', data.title)
      Swal.fire({
        title: 'Are you sure?',
        text: msg,
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          const isPDF = this.docs?.type === 'application/pdf';
          if (this.isEdit) {
            formdata.append('scormKitId', this.scormKitId);
            this.editScormKit(formdata, isPDF);
          } else {
            this.createScormKit(formdata, isPDF);
          }         
        }
      });
    } else {
      this.pkgForm.markAllAsTouched();
      Swal.fire({
        title: 'Error',
        text: 'Please fill all required fields',
        icon: 'error',
      });
    }
  }

  editScormKit(data:any, isPDF: boolean = false) {
    data.append('isPDF', isPDF);

    this.courseService.updateScormKit(this.scormKitId,data).subscribe(res => {
      this.closeDialog()
    })
  }

  createScormKit(data:any, isPDF: boolean = false) {
    if (isPDF) {
      this.courseService.createScormPkg(data).subscribe(res => {
        this.closeDialog()
      })
    } else {
      this.courseService.saveScormKit(data).subscribe(res => {
        this.closeDialog()
      })
    }
    
  }
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }else {
      this.router.navigate(['/student/settings/configuration/scorm-kit']);
    }
  }



  fileBrowseHandler(event: any) {
    const file = event.target.files[0];
    if (file.size > 10000000) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload media. Please upload a file less than 10MB.',
        icon: 'error',
      });
    }
  }

  isUploading = false;

  onFileUpload(event: any, isScormKit: boolean = false) {
    const file = event.target.files[0];
    let allowedFileTypes = [
      'application/pdf', 'application/x-zip-compressed'
    ];

    if (file) {
      if (allowedFileTypes.includes(file.type)) {
        this.uploadedDocument = file.name;
        this.docs = file;
      } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Selected format doesn\'t support. Only document formats are allowed!',
          icon: 'error',
        });
      }
    }
  }

  deleteScormKit(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete the SCORM Package!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteScormKit(this.scormKitId).subscribe(res => {
          this.closeDialog()
        })
      }
    })
   
  }
}
