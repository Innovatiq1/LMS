import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EmailConfigService } from '@core/service/email-config.service';
import { UtilsService } from '@core/service/utils.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zoom-create',
  templateUrl: './zoom-create.component.html',
  styleUrls: ['./zoom-create.component.scss']
})
export class ZoomCreateComponent {
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
    this.id = _data._id;
    this.emailTemplateForm.patchValue({
      email_subject: _data.email_subject,
      email_top_welcome_text:_data.email_top_welcome_text,
      email_content1:_data.email_content1,
      email_top_welcome_title1:_data?.email_top_welcome_title1,
      email_top_welcome_title2:_data?.email_top_welcome_title2,
      email_top_welcome_title3:_data?.email_top_welcome_title3,
      email_top_welcome_title4:_data?.email_top_welcome_title4,
      email_top_welcome_title5:_data?.email_top_welcome_title5,
      email_top_welcome_title6:_data?.email_top_welcome_title6
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
      email_top_welcome_title1:pageContent?.email_top_welcome_title1,
      email_top_welcome_title2:pageContent?.email_top_welcome_title2,
      email_top_welcome_title3:pageContent?.email_top_welcome_title3,
      email_top_welcome_title4:pageContent?.email_top_welcome_title4,
      email_top_welcome_title5:pageContent?.email_top_welcome_title5,
      email_top_welcome_title6:pageContent?.email_top_welcome_title6
    });

  }

  createForm() {
    this.emailTemplateForm = this.fb.group(
      {
        email_subject: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name] ],
        email_top_welcome_text: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
        email_content1: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.longDescription]],
        email_top_welcome_title1:['',[Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
        email_top_welcome_title2:['',[Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
        email_top_welcome_title3:['',[Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
        email_top_welcome_title4:['',[Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
        email_top_welcome_title5:['',[Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
        email_top_welcome_title6:['',[Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],
      },
    );
    this.emailTemplateForm.valueChanges.subscribe(() => {
    });
  }
  getForgetPasswordTemplate() {
    this.emailConfigurationService.getForgetPasswordTemplate().subscribe( response =>{
      this.assignData  = response?.data?.docs[0]?.zoom_meeting_creation_template;
      this.ref.detectChanges();
    })}
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
        const payload = {
          email_top_welcome_text: obj.email_top_welcome_text,
          email_content1: obj.email_content1,
          insertaction:'zoom_meeting_creation_template',
        }
        obj.insertaction = 'zoom_meeting_creation_template';
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
