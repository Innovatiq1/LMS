import { Component, ElementRef, OnInit,EventEmitter, Output, ViewChild,Inject,Optional } from '@angular/core';
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
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-scorm-pkg-create',
  templateUrl: './scorm-pkg-create.component.html',
  styleUrls: ['./scorm-pkg-create.component.scss']
})
export class ScormPkgCreateComponent {
breadscrums = [
    {
      title: 'SCORM Package',
      items: ['SCORM Package'],
      active: 'Create SCORM Package',
    },
  ];
  @ViewChild('fileDropRef', { static: false })
  dialogStatus:boolean=false;
  scormKitForm!: FormGroup;
  docs: any;
  
  

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data11: any,
    private router: Router,

    private formBuilder: FormBuilder,
    public utils: UtilsService,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
    private formService: FormService,
    @Optional() private dialogRef: MatDialogRef<ScormPkgCreateComponent>,
    private authenService: AuthenService,
    private _router: Router,
    private dialog: MatDialog
  ) {
    if (data11) {
      this.dialogStatus=true;
    }

    this.scormKitForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        ...this.utils.validators.name,
        ...this.utils.validators.noLeadingSpace,
      ]),
      documentLink: new FormControl('', []),
    });
  }
 
  ngOnInit(): void {
  }
  
  submitCourseKit1() {
    if (this.scormKitForm.valid) {
      const formdata = new FormData();
      if (this.docs) {
        formdata.append('file', this.docs);
      }
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to create a SCORM Package!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.dialogRef) {
            this.dialogRef.close();  
          }
        }
      });
    } else {
      this.scormKitForm.markAllAsTouched();
    }
  }
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
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

  onFileUpload(event: any, isScormKit:boolean=false) {
    const file = event.target.files[0];
    // console.log("Selected file:", file.name, "Type:", file.type);
    let allowedFileTypes = [
      'application/pdf'
    ];
    
  
    
    if (file) {
      if (allowedFileTypes.includes(file.type)) {

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
