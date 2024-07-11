import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { UserService } from '@core/service/user.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { UtilsService } from '@core/service/utils.service';

@Component({
  selector: 'app-update-usergroup',
  templateUrl: './update-usergroup.component.html',
  styleUrls: ['./update-usergroup.component.scss'],
})
export class UpdateUsergroupComponent {
  userTypeFormGroup!: FormGroup;
  breadscrums = [
    {
      title: 'Admin',
      items: ['Manage Users'],
      active: 'User Group',
    },
  ];
  users: any;
  shortDes: any;
  typeName: any;
  id: any;
  response: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public utils: UtilsService
  ) {
    this.userTypeFormGroup = this.fb.group({
      typeName: ['', [Validators.required,...this.utils.validators.noLeadingSpace]],
      shortDes: ['',[Validators.required,...this.utils.validators.noLeadingSpace]],
      userId: new FormControl('', [Validators.required,...this.utils.validators.noLeadingSpace]),
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.getUserGroupById(this.id);
    });

    this.setup();
  }
  getUserGroupById(id: string): void {
    this.userService.getUserGroupById(id).subscribe(
      (response: any) => {
        this.response = response?.data;
        let userId = this.response?.userId?.map((item: { id: any; }) => item) || [];
        this.userTypeFormGroup.patchValue({
          typeName: this.response.group_name,
          shortDes: this.response.shortDes,
          userId : userId
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  setup() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.users = response?.results.reverse();
    });
  }


  onUpdate() {
    if (this.userTypeFormGroup.valid) {
    const userData ={
      group_name: this.userTypeFormGroup.value.typeName,
      shortDes: this.userTypeFormGroup.value.shortDes,
      userId: this.userTypeFormGroup.value.userId
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.userService.updateUserGroup(this.id, userData).subscribe((response: any) => {

          if(response){
            Swal.fire({
              title: 'Success',
              text: 'User Group updated successfully.',
              icon: 'success',
              // confirmButtonColor: '#d33',
            });
            () => {
              Swal.fire({
                title: 'Error',
                text: 'Failed to update. Please try again.',
                icon: 'error',
                // confirmButtonColor: '#d33',
              });
            };
          }
        })
        window.history.back();
      }
    });
  }else{
    this.userTypeFormGroup.markAllAsTouched();
  }
  }

  deleteUserGroup(id:string){
    Swal.fire({
  title: "Confirm Deletion",
  text: "Are you sure you want to delete this?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
  confirmButtonText: "Delete",
  cancelButtonText: "Cancel",
}).then((result) => {
  if (result.isConfirmed){
    this.userService.deleteUserGroup(id).subscribe(result => { 
      Swal.fire({
        title: 'Success',
        text: 'Record Deleted Successfully...!!!',
        icon: 'success',
        // confirmButtonColor: '#526D82',
      });
      window.history.back();
    });
  }
});
}
goBack(): void {
  this.location.back();
}
}
 