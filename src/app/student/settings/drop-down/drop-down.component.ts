import { Component } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent {
  dropDownForm!: FormGroup;
  breadscrums = [
    {
      title: 'Drop Down Algorithm',
      items: ['Configuration'],
      active: 'Drop Down',
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
    this.dropDownForm = this.fb.group({
      field: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.value]],
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
    if (this.dropDownForm.valid) {
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      this.dropDownForm.value.companyId = userId;
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add Drop Down Option',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            data: this.dropDownForm.getRawValue(),
            companyId: userId
          }
          this.SettingsService.addDropDownOption(payload).subscribe((response: any) => {
            Swal.fire({
              title: 'Successful',
              text: 'Drop Down Option created successfully',
              icon: 'success',
            });
            this.getAllDropDowns();
            this.dropDownForm.reset();
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
      this.dropDownForm.markAllAsTouched();
    }
  }

  update(data: any, field:any) {
    console.log(data);
    this.router.navigate(['/student/settings/configuration/drop-down/update'], {
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
}
