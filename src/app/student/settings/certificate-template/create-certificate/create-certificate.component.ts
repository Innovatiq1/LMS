import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CertificateService } from 'app/core/service/certificate.service';
import { forkJoin } from 'rxjs';
import { text } from 'd3';
import { CourseService } from '@core/service/course.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenService } from '@core/service/authen.service';
@Component({
  selector: 'app-create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.scss'],
})
export class CreateCertificateComponent implements OnInit {
  breadscrums = [
    {
      title: 'Certificate',
      items: ['Customize'],
      active: 'Create Certificate',
    },
  ];
  @ViewChild('backgroundTable') backgroundTable!: ElementRef;
  certificateForm!: FormGroup;
  isSubmitted = false;
  editUrl!: boolean;

  classId!: any;
  viewUrl: boolean;

  title: boolean = false;
  submitted: boolean = false;
  course: any;
  thumbnail: any;
  image_link: any;
  uploaded: any;
  uploadedImage: any;
  isEdit = false;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    sanitize: false,
    toolbarHiddenButtons: [
      ['strikethrough']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _activeRoute: ActivatedRoute,
    private certificateService: CertificateService,
    private courseService: CourseService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private authenService: AuthenService
  ) {
    this._activeRoute.queryParams.subscribe((params) => {
      this.classId = params['id'];
      if (this.classId) {
        this.title = true;
      }
    });
    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit');
    this.viewUrl = urlPath.includes('view');

    if (this.editUrl == true) {
      this.breadscrums = [
        {
          title: 'Certificate',
          items: ['Certificate'],
          active: 'Edit Certificate',
        },
      ];
    }
    if (this.viewUrl == true) {
      this.breadscrums = [
        {
          title: 'Certificate',
          items: ['Certificate'],
          active: 'View Certificate',
        },
      ];
    }
    if (this.editUrl || this.viewUrl) {
      this.getData();
    }
  }

  edit() {
    this.router.navigate(['/student/settings/customize/certificate/template/edit/:id'], {
      queryParams: { id: this.classId },
    });
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath[3]}`;
    const childId =  `${urlPath[4]}/${urlPath[5]}`;
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let editAction = actions.filter((item:any) => item.title == 'Edit')
  
    if(editAction.length >0){
      this.isEdit = true;
    }
    
    this.certificateForm = this.fb.group({
      title: [''],
      text1: [''],
    });
  }
  
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  onFileUpload(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.thumbnail = file;
      const formData = new FormData();
      formData.append('files', this.thumbnail);

      this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) => {
        let imageUrl = data.data.thumbnail;
        this.image_link = data.data.thumbnail
        imageUrl = imageUrl.replace(/\\/g, '/');
        imageUrl = encodeURI(imageUrl);
        this.setBackgroundImage(imageUrl);
        this.uploaded=imageUrl?.split('/')
      let image  = this.uploaded?.pop();
      this.uploaded= image?.split('\\');
      this.uploadedImage = this.uploaded?.pop();
      }, (error) => {
        console.error('Upload error:', error);
      });
    }
  }

  private setBackgroundImage(imageUrl: string) {
    this.backgroundTable.nativeElement.style.backgroundImage = `url("${imageUrl}")`;
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(
        this.backgroundTable.nativeElement
      );
    }, 1000);
  }

  saveCertificate() {
    if (this.certificateForm.valid) {
      if (!this.editUrl) {
        let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.isSubmitted = true;
        this.certificateForm.value.companyId=userId;

        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to create Certificate!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this.certificateForm.value.image = this.image_link;
            this.certificateService
              .createCertificate(this.certificateForm.value)
              .subscribe((response: any) => {
                Swal.fire({
                  title: 'Success',
                  text: 'Certificate Created successfully.',
                  icon: 'success',
                });
                this.router.navigateByUrl(
                  `/student/settings/certificate/template`
                );
              });
          }
        });
        //  }
      }
      if (this.editUrl) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to update this certificate!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this.certificateForm.value.image = this.image_link;
            this.certificateService
              .updateCertificate(this.classId, this.certificateForm.value)
              .subscribe((response: any) => {
                Swal.fire({
                  title: 'Success',
                  text: 'Certificate updated successfully.',
                  icon: 'success',
                });
                window.history.back();
              });
          }
        });
      }
    } else {
      this.submitted = true;
    }
  }
  getData() {
    forkJoin({
      course: this.certificateService.getCertificateById(this.classId)
    }).subscribe((response: any) => {
      this.course = response.course;

      let imageUrl = this.course?.image;
      imageUrl = imageUrl.replace(/\\/g, '/');
      imageUrl = encodeURI(imageUrl);
      this.setBackgroundImage(imageUrl);
      
      this.uploaded = imageUrl?.split('/');
      let image = this.uploaded?.pop();
      this.uploaded = image?.split('\\');
      this.uploadedImage = this.uploaded?.pop();

      this.certificateForm.patchValue({
        title: this.course?.title,
        text1: this.course?.text1,
      });
    });
  }
}
