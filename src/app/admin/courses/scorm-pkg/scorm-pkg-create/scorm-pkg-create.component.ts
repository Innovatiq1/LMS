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
  pkgForm!: FormGroup;
  docs: any;
  uploadedDocument: any;
  dialogStatus: boolean = false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data11: any,
    private fb: FormBuilder,
    public utils: UtilsService,
    @Optional() private dialogRef: MatDialogRef<ScormPkgCreateComponent>,
    private cdRef: ChangeDetectorRef,
    private courseService: CourseService,
  ) {
    if (data11) {
      this.dialogStatus = true;
    }


  }
  ngOnInit(): void {
    if (!this.pkgForm) {
      this.pkgForm = this.fb.group({
        title: new FormControl('', [
          Validators.required
        ]),
        documentLink: new FormControl('', [Validators.required]),
      });
    }
  }

  ngAfterViewInit(): void {
    // If any updates are made after view initialization, call detectChanges
    this.cdRef.detectChanges();
  }


  submitSCORMKit() {
    if (this.pkgForm.valid&&this.docs) {
      const formdata = new FormData();
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      formdata.append('companyId', userId);
      const isPDF = this.docs.type === 'application/pdf';
      if (isPDF) {
        formdata.append('file', this.docs);
      }else {
        formdata.append('files', this.docs);
      }
      const data = this.pkgForm.value;
      console.log(data);
      formdata.append('title', data.title)
      Swal.fire({
        title: 'Are you sure?',
        text: isPDF ? 'You want to create a SCORM Package!': 'You want to upload SCORM Package',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          if (isPDF) {
            this.courseService.createScormPkg(formdata).subscribe(res=>{
              this.closeDialog()
            })
          }else {
            this.courseService.saveScormKit(formdata).subscribe(res=>{
              this.closeDialog()
            })
          }
        }
      });
    } else {
      this.pkgForm.markAllAsTouched();
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

  onFileUpload(event: any, isScormKit: boolean = false) {
    const file = event.target.files[0];
    // console.log("Selected file:", file.name, "Type:", file.type);
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
}
