import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EmailConfigService } from '@core/service/email-config.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-new-email',
  templateUrl: './admin-new-email.component.html',
  styleUrls: ['./admin-new-email.component.scss']
})
export class AdminNewEmailComponent {
  edit = true;
  emailTemplateForm!: FormGroup;
  id: any;
  itemData: any;
  pageContent: any;
  isLoading = false;
  assignData = [];
  isSubmitted = false;
  public Editor: any = ClassicEditor;

  breadscrums = [
    {
      title: 'Forgot Mail',
      items: ['Email Configuration'],
      active: 'Admin New Email ',
    },
  ];

  
  constructor(
    private fb: FormBuilder,
    public utils: UtilsService,
    private emailConfigurationService: EmailConfigService,
    private ref: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.initialize();

    this.getForgetPasswordTemplate();

  }

  toggle(_data: any) {
    this.edit = !this.edit;
    this.emailTemplateForm.patchValue({
      email_subject: _data.email_subject,
      email_content: _data.email_content,

    });

  }
  initialize() {
    this.createForm();

  }
  back() {
    this.edit = !this.edit;
  }
  fetchUpdated() {
    this.patchForm(this.itemData);
  }

  patchForm(pageContent: any) {
    this.pageContent = pageContent;
    this.emailTemplateForm.patchValue({
      email_subject: pageContent?.email_subject,
      email_content: pageContent?.email_content,
    });
  }

  createForm() {
    this.emailTemplateForm = this.fb.group(
      {
        email_subject: ['', [Validators.required]],
        email_content: ['', [Validators.required]],

      },
    );
    this.emailTemplateForm.valueChanges.subscribe(() => {
    });
  }

  getForgetPasswordTemplate() {
    this.emailConfigurationService.getForgetPasswordTemplate().subscribe(response => {
      this.assignData = response?.data?.docs[0]?.admin_email;
      this.ref.detectChanges();
    }
    )
  }
  update() {
    return new Promise<void>((resolve, reject) => {
      if (this.emailTemplateForm.valid) {
          const obj = this.emailTemplateForm.value;
          obj.insertaction = 'admin_email';
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
      }
    )};
}
