import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperAdminService } from '../super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-role-customization',
  templateUrl: './edit-role-customization.component.html',
  styleUrls: ['./edit-role-customization.component.scss'],
})
export class EditRoleCustomizationComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Super Admin'],
      active: 'Edit Customization',
    },
  ];

  userForm!: FormGroup;
  companyId: any;
  data: any;
  constructor(
    public _fb: FormBuilder,
    public activeRoute: ActivatedRoute,
    private superadminservice: SuperAdminService, public router: Router
  ) {
    this.activeRoute.queryParams.subscribe((params) => {
      this.companyId = params['id'];
    });
  }

  ngOnInit() {
    this.userForm = this._fb.group({
      company: new FormControl(''),
      learner: new FormControl(''),
      trainer: new FormControl(''),
    });
    this.getList();
  }

  update() {
    this.superadminservice
      .updateCustomzRole(this.companyId, this.userForm.value)
      .subscribe((data: any) => {
       
          Swal.fire({
            title: 'Success',
            text: 'Course Withdraw successfully.',
            icon: 'success',
          });
        
      });
      this.router.navigate(['super-admin/role-customize'])
  }
  getList(filters?: any) {
    this.superadminservice.getAllCustomRoleById(this.companyId).subscribe(
      (response: any) => {
        console.log('listing user', response);
        this.data = response.data;
        if (this.data) {
          this.userForm.patchValue({
            company: this.data?.company,
            learner: this.data?.learner,
            trainer: this.data?.trainer,
          });
        }
      },
      (error) => {}
    );
  }

  onNoClick() {
    window.history.back();
  }
}
