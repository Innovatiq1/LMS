import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-third-party-tools',
  templateUrl: './third-party-tools.component.html',
  styleUrls: ['./third-party-tools.component.scss']
})
export class ThirdPartyToolsComponent {
  breadscrums = [
    {
      title: 'Integration',
      items: ['Integration'],
      active: '3rd Party Integrations',
    },
  ];

  smtpForm: UntypedFormGroup;
  
  constructor(private fb: UntypedFormBuilder,) {
   
    this.smtpForm = this.fb.group({
      integration: ['SMTP', [Validators.required]],
      label: ['SMTP', [Validators.required]],
      url: ['http://203.118.55.27:4600/', [Validators.required]],
      protocol: ['http', [Validators.required]],
      server: ['203.118.55.27'],
      port: ['44', [Validators.required]],
      user: ['admin', [Validators.required]],
      password: ['********'],
    });
  }
  cancel() {
  
    window.history.back();
  }
}
