import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EmailConfigService } from '@core/service/email-config.service';
import { UtilsService } from '@core/service/utils.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ta-course-notification',
  templateUrl: './ta-course-notification.component.html',
  styleUrls: ['./ta-course-notification.component.scss']
})
export class TaCourseNotificationComponent {
  taNotifForm:FormGroup  ;
  edit = true;
  welcomeUrl: any;
  trainerUrl: any;
  rejectUrl: any;  
  studentrefUrl: any;
  courserefUrl: any;
  completecourseUrl : any;
  instcourseinvtUrl : any;
  instacptcrsinvtstsUrl : any;
  sendcourseinvoiceUrl : any;
  adminnewmailUrl : any;
  isSubmitted=false;
  id: any;

  assignData :any[] = [];
  public Editor: any = ClassicEditor;
  itemData: any;
  pageContent: any;
 
  breadscrums = [
    {
      title: 'Forgot Mail',
      items: ['Email Templates'],
      active: 'Payment Verification Request',
    },
  ];
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
  constructor(
     private emailConfigurationService: EmailConfigService,
     private router: Router,
     private formBuilder: FormBuilder, 
     public utils:UtilsService, 
     private ref: ChangeDetectorRef,)
     {
    this.taNotifForm = this.formBuilder.group({
      email_subject: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name] ],
      email_top_header_text: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
      email_content: ['', [Validators.required,  ...this.utils.validators.noLeadingSpace, ...this.utils.validators.longDescription]],
    });
  }

  ngOnInit(){
    this.getTaCourseNotificationTemplate();
  }
  fetchUpdated() {
    this.patchForm(this.itemData);
  }
  patchForm(pageContent: any) {
    this.pageContent = pageContent;
    this.taNotifForm.patchValue({
      email_template_type: pageContent?.email_template_type,
      email_subject: pageContent?.email_subject,
      email_top_header_text: pageContent?.email_top_header_text,
      email_content: pageContent?.email_content,
    });

  }

  getTaCourseNotificationTemplate() {
    this.emailConfigurationService.getForgetPasswordTemplate().subscribe( response =>{
      this.assignData  = response?.data?.docs[0]?.admin_payment_notification;
      this.ref.detectChanges();
    }, error => {
    }); 
  }

  update(){
    if (this.taNotifForm.valid) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update template!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateTemplate();
      }
    });
  } else {
    this.taNotifForm.markAllAsTouched(); 
    this.isSubmitted = true;
  }
  }
  updateTemplate() {
    return new Promise<void>((resolve, reject) => {
          const obj = this.taNotifForm.value;
          obj.insertaction = 'admin_payment_notification';
          let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    obj['companyId'] = companyId; 
          this.emailConfigurationService.updateForgetPasswordTemplate(obj, this.id).subscribe(
            (res) => {
              Swal.fire({
                title: 'Successful',
                text: 'Update data Succesfully',
                icon: 'success',
              });
              
             this.back();
              resolve();
              this.getTaCourseNotificationTemplate(); 
            },
            (err) => {
              Swal.fire(
                'Failed to Update',
                'error'
              );
              reject();
            },
            () => {
              reject();
            });
        });
      }

  back(){
    this.edit =!this.edit;
  }

  toggle(_data: any){
    this.edit = !this.edit;
    this.taNotifForm.patchValue({
      email_subject: _data.email_subject,
      email_content:_data.email_content,
      email_top_header_text: _data.email_top_header_text
    });

  }
}
