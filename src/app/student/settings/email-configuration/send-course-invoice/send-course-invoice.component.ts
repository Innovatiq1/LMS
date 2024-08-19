import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EmailConfigService } from '@core/service/email-config.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-send-course-invoice',
  templateUrl: './send-course-invoice.component.html',
  styleUrls: ['./send-course-invoice.component.scss']
})
export class SendCourseInvoiceComponent {
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
      items: ['Email Configuration'],
      active: 'Send Course Invoice',
    },
  ];
  constructor(
    private router: Router,  
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
      email_top_header_text:_data.email_top_header_text,
      email_content:_data.email_content,
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
      email_subject: pageContent?.email_subject,
      email_top_header_text: pageContent?.email_top_header_text,
      email_content: pageContent?.email_content,
    });
  
  }

  createForm() {
    this.emailTemplateForm = this.fb.group(
      {
        email_subject: ['', [Validators.required]],
        email_top_header_text: ['', [Validators.required]],
        email_content: ['', [Validators.required]],
        bottom_button_text: ['', [Validators.required]],
      },
    );
    this.emailTemplateForm.valueChanges.subscribe(() => {
    });
  }
  getForgetPasswordTemplate() {
    this.emailConfigurationService.getForgetPasswordTemplate().subscribe( response =>{
      this.assignData  = response?.data?.docs[0]?.send_project_invoice_template;
      this.ref.detectChanges();
    
  }
  )}
 
  
  update(){
  return new Promise<void>((resolve, reject) => {
        const obj = this.emailTemplateForm.value;
        obj.insertaction = 'send_project_invoice_template';
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
