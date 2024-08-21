import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EmailConfigService } from '@core/service/email-config.service';
import { UtilsService } from '@core/service/utils.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-welcome-mail',
  templateUrl: './welcome-mail.component.html',
  styleUrls: ['./welcome-mail.component.scss']
})
export class WelcomeMailComponent {

  edit = true;
  emailTemplateForm!: FormGroup;
  assignData :any[] = [];
  isSubmitted=false;
  id: any;
  itemData: any;
  pageContent: any;
  isLoading = false;
  show_loader: boolean = false;
  public Editor: any = ClassicEditor;

  breadscrums = [
    {
      title: 'Forgot Mail',
      items: ['Email Templates'],
      active: 'Welcome E-mail',
    },
  ];
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
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
  constructor(private router: Router,
    public utils:UtilsService,
    private emailConfigurationService: EmailConfigService,
     private fb: FormBuilder,
     private activatedRoute: ActivatedRoute,
     private ref: ChangeDetectorRef
    ) {


  }

  toggle(_data: any){
    this.edit =!this.edit;
    this.emailTemplateForm.patchValue({
      email_subject: _data.email_subject,
      email_top_welcome_text:_data.email_top_welcome_text,
      email_content1:_data.email_content1,
      bottom_button_text: _data.bottom_button_text
    });

  }

  back(){
    this.edit =!this.edit;
  }
  ngOnInit(): void {
    this.initialize();

      this.getForgetPasswordTemplate();

  }

  initialize() {
    this.createForm();

  }

  fetchUpdated() {
    this.patchForm(this.itemData);
  }

  patchForm(pageContent: any) {
    this.pageContent = pageContent;
    this.emailTemplateForm.patchValue({
      email_template_type: pageContent?.email_template_type,
      email_subject: pageContent?.email_subject,
      email_top_welcome_text: pageContent?.email_top_welcome_text,
      email_content1: pageContent?.email_content1,
      bottom_button_text: pageContent?.bottom_button_text,
    });

  }

  createForm() {
    this.emailTemplateForm = this.fb.group(
      {
        email_subject: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name] ],
        email_top_welcome_text: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
        email_content1: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.longDescription]],
        bottom_button_text: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
      },
    );
    this.emailTemplateForm.valueChanges.subscribe(() => {
    });
  }
  getForgetPasswordTemplate() {
    this.emailConfigurationService.getForgetPasswordTemplate().subscribe( response =>{
      this.assignData  = response?.data?.docs[0]?.welcome_email_template;
      this.ref.detectChanges();

  }
  )}
update(){
  if (this.emailTemplateForm.valid) {
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
  this.emailTemplateForm.markAllAsTouched(); 
  this.isSubmitted = true;
}
}

  updateTemplate(){
  return new Promise<void>((resolve, reject) => {
        const obj = this.emailTemplateForm.value;
        obj.insertaction = 'welcome_mail_template';
        this.emailConfigurationService.updateForgetPasswordTemplate(obj, this.id).subscribe(
          (res) => {
            
            Swal.fire({
              title: 'Successful',
              text: 'Update data Succesfully',
              icon: 'success',
            });
            this.back();
            resolve();
            this.getForgetPasswordTemplate();
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
          }
        );
      }

   )};
}
