import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EmailConfigService } from '@core/service/email-config.service';
import { UtilsService } from '@core/service/utils.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  updatePsw: FormGroup;
  edit = true;
  _id: number | undefined;
  public Editor: any = ClassicEditor;
  isSubmitted = false;
  assignData: any[] = [];
  breadscrums = [
    {
      title: 'Forgot Mail',
      items: ['Email Templates'],
      active: 'Forgot Password',
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
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
  constructor(
    private router: Router,
    private emailConfigurationService: EmailConfigService,
    private formBuilder: FormBuilder,
    public utils: UtilsService
  ) {
    this.updatePsw = this.formBuilder.group({
      email_subject: [
        '',
        [
          Validators.required,
          ...this.utils.validators.noLeadingSpace,
          ...this.utils.validators.name,
        ],
      ],
      email_content: [
        '',
        [
          Validators.required,
          ...this.utils.validators.noLeadingSpace,
          ...this.utils.validators.longDescription,
        ],
      ],
      bottom_button_text: [
        '',
        [
          Validators.required,
          ...this.utils.validators.noLeadingSpace,
          ...this.utils.validators.name,
        ],
      ],
    });
  }

  toggle(_data: any) {
    this.edit = !this.edit;
    this._id = _data._id;
    this.updatePsw.patchValue({
      email_subject: _data.email_subject,
      email_content: _data.email_content,
      bottom_button_text: _data.bottom_button_text,
    });
  }

  back() {
    this.edit = !this.edit;
  }
  ngOnInit() {
    this.getForgetPasswordTemplate();
  }

  getForgetPasswordTemplate() {
    this.emailConfigurationService.getForgetPasswordTemplate().subscribe(
      (response) => {
        this.assignData = response?.data?.docs[0]?.forget_password_template;
      },
      (error) => {
      }
    );
  }
  update() {
    if (this.updatePsw.valid) {
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
      this.updatePsw.markAllAsTouched();
      this.isSubmitted = true;
    }
  }

  updateTemplate() {
    return new Promise<void>((resolve, reject) => {
      const obj = this.updatePsw.value;
      obj.insertaction = 'forget_password_template';
      this.emailConfigurationService
        .updateForgetPasswordTemplate(obj, this._id)
        .subscribe(
          (res) => {
            Swal.fire({
              title: 'Successful',
              text: 'Update data Succesfully',
              icon: 'success',
            });
            this.getForgetPasswordTemplate();
            this.back();
            resolve();
          },
          (err) => {
            Swal.fire('Failed to Update', 'error');
            reject();
          },
          () => {
            reject();
          }
        );
    });
  }
}
