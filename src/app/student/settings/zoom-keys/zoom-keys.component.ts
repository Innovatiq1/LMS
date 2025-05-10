import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

export interface TeamsKey {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  companyId: string;
  objectId: string;
  type: string; 
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}
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
  teamsForm: FormGroup;
  hide = true;
  shide = true;
  rhide = true;
  thide = true;
  zoom: any;
  teams: TeamsKey[] = [];

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
      accountId: ['', [Validators.required,  ...this.utils.validators.password]],
    });

    this.teamsForm = this.fb.group({
      clientId: ['',[Validators.required,  ...this.utils.validators.password]],
      objectId: ['',[Validators.required,  ...this.utils.validators.password]],
      clientSecret: ['',[Validators.required,  ...this.utils.validators.password]],
      tenantId: ['', [Validators.required,  ...this.utils.validators.password]],
    });

  }
  ngOnInit(): void {
    this.getData();
    this.getTeamsKeys();
  }
  updatezoomKeys() {
    if (this.zoomForm.valid) {
      const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      let payload = {
        companyId: companyId,
        clientId:this.zoomForm.value.clientId,
        clientSecret:this.zoomForm.value.clientSecret,
        accountId:this.zoomForm.value.accountId,
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

  updateteamsKeys() {
    if (this.teamsForm.valid) {
      const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      let payload = {
        companyId: companyId,
        clientId:this.teamsForm.value.clientId,
        clientSecret:this.teamsForm.value.clientSecret,
        tenantId:this.teamsForm.value.tenantId,
        objectId:this.teamsForm.value.objectId,
        type: 'teams',
        status: 'active',
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to create teams credentials!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.settingsService
            .createTeamsKey( payload)
            .subscribe((response: any) => {
              Swal.fire({
                title: 'Successful',
                text: 'Teams credentials saved successfully',
                icon: 'success',
              });
              this.getTeamsKeys();
            });
        }
      });
    }
  }
  getData() {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.settingsService.getZoomKeysByCompanyId(companyId).subscribe((response: any) => {
      this.zoom = response.data.filter((item: any) => item.type == 'zoom');;
      this.zoomForm.patchValue({
        clientId:this.zoom[0]?.clientId,
        clientSecret:this.zoom[0]?.clientSecret,
        accountId:this.zoom[0]?.accountId
      })
    })
  }
  getTeamsKeys() {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.settingsService.getTeamsKeysByCompanyId(companyId).subscribe((response: any) => {
      this.teams = response?.data?.filter((item: any) => item.type == 'teams');
      console.log(this.teams);
      this.teamsForm.patchValue({
        clientId:this.teams[0]?.clientId,
        clientSecret:this.teams[0]?.clientSecret,
        tenantId:this.teams[0]?.tenantId ,
        objectId:this.teams[0]?.objectId
      }) 
    }) 
  }

  cancel() {
    window.history.back();
  }
}
