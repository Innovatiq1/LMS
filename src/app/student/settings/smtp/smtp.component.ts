import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.scss'],
})
export class SmtpComponent implements OnInit {
  breadscrums = [
    {
      title: 'Integration',
      items: ['Integration'],
      active: 'SMTP',
    },
  ];

  smtpForm: UntypedFormGroup;
  subscribeParams: any;
  smtp: any;
  id: any;

  constructor(
    private fb: UntypedFormBuilder,
    private settingsService: SettingsService,
    private activatedRoute: ActivatedRoute,
    public utils: UtilsService
  ) {
    this.smtpForm = this.fb.group({
      email: ['',[ Validators.required, Validators.email,Validators.minLength(5), ...this.utils.validators.noLeadingSpace, ...this.utils.validators.email],],
      user: ['',[ Validators.required, Validators.pattern(/[a-zA-Z0-9]+/), ...this.utils.validators.noLeadingSpace, ...this.utils.validators.uname],],
      host: ['',[ Validators.required, Validators.pattern(/[a-zA-Z0-9]+/), ...this.utils.validators.noLeadingSpace, ...this.utils.validators.uname],],
      port: ['',[ Validators.required]],
      password: ['',[ Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  update() {
    if (this.smtpForm.valid) {
      const smtpData = this.smtpForm.value;
      let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      let payload = {
        emailFrom: smtpData?.email,
        emailUsername: smtpData?.user,
        emailHost: smtpData?.host,
        emailPort: smtpData?.port,
        emailPassword: smtpData?.password,
        companyId:companyId
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update this SMTP!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.settingsService
            .updateSmtp(this.id, payload)
            .subscribe((response: any) => {
              Swal.fire({
                title: 'Successful',
                text: 'SMTP saved successfully',
                icon: 'success',
              });
              this.getData();
              // window.history.back();
            });
        }
      });
    }
  }

  getData() {
    let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.settingsService.getSmtp({companyId}).subscribe((response: any) => {
      this.smtp = response.data.docs[0];
      this.id = response.data.docs[0]._id;
      this.smtpForm.patchValue({
        email: this.smtp?.emailFrom,
        user: this.smtp?.emailUsername,
        host: this.smtp?.emailHost,
        port: this.smtp?.emailPort,
        password: this.smtp?.emailPassword,
      });
    });
  }
}
