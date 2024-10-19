import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CertificateService } from '@core/service/certificate.service';
import { EmailConfigService } from '@core/service/email-config.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
})
export class ComposeComponent {
  public Editor: any = ClassicEditor;

  breadscrums = [
    {
      title: 'Compose',
      items: ['Email'],
      active: 'Compose',
    },
  ];
  adminUrl: boolean;
  composeForm: any;
  attachment: any;
  uploadedAttachment: any;
  studentUrl: boolean;
  subscribeParams: any;
  mailId: any;
  emailDetails: any;
  currentDate!: Date;
  currentTime!: string;
  showCCField = false;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '12rem',
    minHeight: '5rem',
    placeholder: 'Description',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
   
   
    toolbarHiddenButtons: [
      [
        'customClasses',
        'strikeThrough',
        'removeFormat',
        'toggleEditorMode',
        'subscript',
        'superscript',
        'indent',
        'outdent',
         'insertOrderedList',
         'insertUnorderedList',
        'heading',
        'fontName'
      ]
    ]
  };

  constructor(private router: Router, private fb: FormBuilder, private certificateService: CertificateService, private emailService: EmailConfigService,
    private activatedRoute: ActivatedRoute) {
    let urlPath = this.router.url.split('/')
    this.adminUrl = urlPath.includes('admin');
    this.studentUrl = urlPath.includes('student');
    this.subscribeParams = this.activatedRoute.params.subscribe((params: any) => {
      this.mailId = params.id;
    });

    this.composeForm = this.fb.group({
      to: ['', []],
      subject: ['', []],
      attachment: ['', []],
      content: ['', []],
      cc: ['']

    })

  }

  ngOnInit() {
    if (this.mailId) {
      this.getMailById();
    }

  }

  toggleCCField() {
    this.showCCField = !this.showCCField;
  }
  getMailById() {
    this.emailService.getMailDetailsByMailId(this.mailId).subscribe((response: any) => {
      let attachment = response?.attachment;
      let uploaded = attachment?.split('/')
      this.uploadedAttachment = uploaded?.pop();
      this.composeForm.patchValue({
        to: response.mail[0].to,
        content: response.mail[0].content,
        subject: response.subject,
        cc:response.mail[0].cc
      })
    })
  }



  onFileUpload(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    this.certificateService.uploadCourseThumbnail(formData).subscribe((response: any) => {
      this.attachment = response.image_link;
      let uploaded = this.attachment.split('/')
      this.uploadedAttachment = uploaded.pop();
    });
  }

  sendEmail() {
    let mail: any = [];
    let userDetails = JSON.parse(localStorage.getItem('currentUser')!);
    this.currentDate = new Date();
    this.currentTime = this.currentDate.toLocaleTimeString();

    mail.push({
      to: this.composeForm.value.to,
      cc:this.composeForm.value.cc,
      content: this.composeForm.value.content,
      attachment: this.attachment,
      from: userDetails.user.email,
      fromName: userDetails.user.name,
      fromProfile: userDetails.user.avatar,
      date: this.currentDate,
      time:this.currentTime,
      read: false
    });

    let payload = {
      mail: mail,
      subject: this.composeForm.value.subject,
      toStatus: 'active',
      fromStatus: 'active'
    };

    this.emailService.sendEmail(payload).subscribe((response: any) => {

      Swal.fire({
        title: 'Successful',
        text: 'Email sent successfully',
        icon: 'success',
      });
      this.router.navigate(['/email/inbox'])

    });

  }
  draftEmail() {
    let mail: any = [];
    let userDetails = JSON.parse(localStorage.getItem('currentUser')!);
    this.currentDate = new Date();
    this.currentTime = this.currentDate.toLocaleTimeString();
    mail.push({
      to: this.composeForm.value.to,
      cc:this.composeForm.value.cc,
      content: this.composeForm.value.content,
      attachment: this.attachment,
      from: userDetails.user.email,
      fromName: userDetails.user.name,
      fromProfile: userDetails.user.avatar,
      date: this.currentDate,
      time:this.currentTime
    })
    let payload = {
      mail: mail,
      subject: this.composeForm.value.subject,
      fromStatus: 'draft'
    }

    this.emailService.sendEmail(payload).subscribe((response: any) => {
      this.router.navigate(['/email/inbox'])

    });

  }




}
