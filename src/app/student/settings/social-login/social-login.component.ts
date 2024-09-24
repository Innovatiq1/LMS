import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent {
  breadscrums = [
    {
      title: 'Integration',
      items: ['Integration'],
      active: 'Social Login Keys',
    },
  ];

  highlightStripe: boolean = true;
  gmail: any;
  id!: string;
  razorpayId!: string;
  gmailForm: FormGroup;
  linkedinForm: FormGroup;
  hide = true;
  shide = true;
  rhide = true;
  linkedin: any;

  constructor(private fb: UntypedFormBuilder,
    private settingsService: SettingsService,
    public utils: UtilsService
    ) {
   
    this.gmailForm = this.fb.group({
      clientId: ['', [Validators.required,  ...this.utils.validators.password]],
    });
    this.linkedinForm = this.fb.group({
      clientId: ['', [Validators.required,  ...this.utils.validators.password]],
      clientSecret: ['', [Validators.required,  ...this.utils.validators.password]],
      redirectUri: ['', [Validators.required,  ...this.utils.validators.password]],

    });
  }
  ngOnInit(): void {
    this.getData();
  }

  updateGmailKeys() {
    if (this.gmailForm.valid) {
      const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      let payload = {
        companyId: companyId,
        clientId:this.gmailForm.value.clientId,
        type: 'google',
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update Gmail key!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.settingsService
            .updateKey( payload)
            .subscribe((response: any) => {
              Swal.fire({
                title: 'Successful',
                text: 'Gmail key saved successfully',
                icon: 'success',
              });
              this.getData();
            });
        }
      });
    }
  }

  updateLinkedinKeys() {
    if (this.linkedinForm.valid) {
      const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      let payload = {
        companyId: companyId,
        clientId:this.linkedinForm.value.clientId,
        clientSecret:this.linkedinForm.value.clientSecret,
        redirectUri:this.linkedinForm.value.redirectUri,
        type: 'linkedin',
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update LinkedIn keys!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.settingsService
            .updateKey( payload)
            .subscribe((response: any) => {
              Swal.fire({
                title: 'Successful',
                text: 'LinkedIn keys saved successfully',
                icon: 'success',
              });
              this.getData();
            });
        }
      });
    }
  }
  getData() {
    this.settingsService.getKeysByCompanyId().subscribe((response: any) => {
      this.gmail = response.data.filter((item: any) => item.type == 'google');
      this.linkedin = response.data.filter((item: any) => item.type == 'linkedin');;

console.log('data',this.linkedin)
      this.gmailForm.patchValue({
        clientId: this.gmail[0]?.clientId,
      });
      this.linkedinForm.patchValue({
        clientId:this.linkedin[0]?.clientId,
        clientSecret:this.linkedin[0]?.clientSecret,
        redirectUri:this.linkedin[0]?.redirectUri

      })
    })
  }
  // getRazorData(){
  //   this.settingsService.getPayment().subscribe((response: any) => {
  //     this.payment = response.data.docs[0];
  //     this.razorpayId = response.data.docs[0]._id;
  //     this.linkedinForm.patchValue({
  //       company: this.payment?.company,
  //       public: this.payment?.keyId,
  //       secret: this.payment?.secretkey,
  //     });
  //   });
  // }
  cancel() {
    window.history.back();
  }
}
