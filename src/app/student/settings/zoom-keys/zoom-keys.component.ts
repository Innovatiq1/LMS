import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zoom-keys',
  templateUrl: './zoom-keys.component.html',
  styleUrls: ['./zoom-keys.component.scss']
})
export class ZoomKeysComponent {
  breadscrums = [
    {
      title: 'Integration',
      items: ['Integration'],
      active: 'zoom credentials',
    },
  ];

  highlightStripe: boolean = true;
  gmail: any;
  id!: string;
  razorpayId!: string;
  gmailForm: FormGroup;
  zoomForm: FormGroup;
  hide = true;
  shide = true;
  rhide = true;
  zoom: any;

  constructor(private fb: UntypedFormBuilder,
    private settingsService: SettingsService,
    public utils: UtilsService
    ) {
   
    this.gmailForm = this.fb.group({
      clientId: ['', [Validators.required,  ...this.utils.validators.password]],
    });
    this.zoomForm = this.fb.group({
      clientId: ['', [Validators.required,  ...this.utils.validators.password]],
      clientSecret: ['', [Validators.required,  ...this.utils.validators.password]],
      redirectUri: ['', [Validators.required,  ...this.utils.validators.password]],

    });
  }
  ngOnInit(): void {
    this.getData();
  }
  updatezoomKeys() {
    if (this.zoomForm.valid) {
      const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      let payload = {
        companyId: companyId,
        clientId:this.zoomForm.value.clientId,
        clientSecret:this.zoomForm.value.clientSecret,
        redirectUri:this.zoomForm.value.redirectUri,
        type: 'zoom',
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update zoom credentials!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.settingsService
            .updateZoomKey( payload)
            .subscribe((response: any) => {
              Swal.fire({
                title: 'Successful',
                text: 'zoom credentials saved successfully',
                icon: 'success',
              });
              this.getData();
            });
        }
      });
    }
  }
  getData() {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.settingsService.getZoomKeysByCompanyId(companyId).subscribe((response: any) => {
      this.zoom = response.data.filter((item: any) => item.type == 'zoom');;

console.log('data',this.zoom)
      this.zoomForm.patchValue({
        clientId:this.zoom[0]?.clientId,
        clientSecret:this.zoom[0]?.clientSecret,
        redirectUri:this.zoom[0]?.redirectUri

      })
    })
  }

  cancel() {
    window.history.back();
  }
}
