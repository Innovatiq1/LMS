import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { UserService } from '@core/service/user.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { UtilsService } from '@core/service/utils.service';
import { AuthenService } from '@core/service/authen.service';

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
  isDelete = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public utils: UtilsService,
    private authenService: AuthenService
  ) {
    this.userTypeFormGroup = this.fb.group({
      typeName: ['', [Validators.required,...this.utils.validators.noLeadingSpace]],
      shortDes: ['',[Validators.required,...this.utils.validators.noLeadingSpace]],
      userId: new FormControl('', [Validators.required,...this.utils.validators.noLeadingSpace]),
    });
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let deleteAction = actions.filter((item:any) => item.title == 'Delete')
  
    if(deleteAction.length >0){
      this.isDelete = true;
    }
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
            });
            () => {
              Swal.fire({
                title: 'Error',
                text: 'Failed to update. Please try again.',
                icon: 'error',
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
 