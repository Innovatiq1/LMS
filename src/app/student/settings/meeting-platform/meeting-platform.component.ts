import { Component } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meeting-platform',
  templateUrl: './meeting-platform.component.html',
  styleUrls: ['./meeting-platform.component.scss']
})
export class MeetingPlatformComponent {
  meetingPlatformForm!: FormGroup;
  breadscrums = [
    {
      title: 'Meeting Platform',
      items: ['Configuration'],
      active: 'Meeeting Platform',
    },
  ];
  dataSource: any;
  fields = [
    {
      name: "Meeting Platform",
      code: "meetingPlatform"
    }
  ]

  isCreate = false;
  isEdit = false;

  constructor(private fb: FormBuilder, private router: Router,
    private activatedRoute: ActivatedRoute, private SettingsService: SettingsService, public utils: UtilsService,
    private authenService: AuthenService) {
    this.meetingPlatformForm = this.fb.group({
      name: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.value]],
      code: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.value]],

    })
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
    const childId =  urlPath[urlPath.length - 1];
    console.log(roleDetails,parentId, childId)
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let editAction = actions.filter((item:any) => item.title == 'Edit')

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(editAction.length >0){
      this.isEdit = true;
    }
    this.getAllDropDowns();
  }

  onSubmit() {
    if (this.meetingPlatformForm.valid) {
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      this.meetingPlatformForm.value.companyId = userId;
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add Meeting Platform',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            data: {
              field:"meetingPlatform",
              ...this.meetingPlatformForm.getRawValue(),
            },
            companyId: userId
          }
          this.SettingsService.addDropDownOption(payload).subscribe((response: any) => {
            Swal.fire({
              title: 'Successful',
              text: 'Meeting Platform created successfully',
              icon: 'success',
            });
            this.getAllDropDowns();
            this.meetingPlatformForm.reset();
          },
            (error) => {
              Swal.fire({
                title: 'Error',
                text: 'Try after sometime',
                icon: 'error',
              });

            });
        }
      });
    } else {
      this.meetingPlatformForm.markAllAsTouched();
    }
  }

  update(data: any, field:any) {
    console.log(data);
    this.router.navigate(['/student/settings/configuration/meeting-platform/update'], {
      queryParams: {
        id: data._id,
        field,
      }
    });
  }



  getAllDropDowns() {
    let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.SettingsService.getDropDowns({ companyId }).subscribe((response: any) => {
      this.dataSource = response.data;
    })
  }
  getOptions(dropDowns: any, field: string) {
    return dropDowns?.[field] || []
  }

  deleteDropDown(optionData: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this option',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  meetingPlatFormOnly(dropDowns:any[]){
    console.log(dropDowns)
    return [];
    // return dropDowns.filter((item:any)=>item ==='meetingPlatform')
  }
}
