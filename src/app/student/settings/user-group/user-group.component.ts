import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@core/service/user.service';
import { Users } from '@core/models/user.model';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { CoursePaginationModel } from '@core/models/course.model';
import { UtilsService } from '@core/service/utils.service';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss'],
})
export class UserGroupComponent {
  userTypeFormGroup!: FormGroup;
  users!: Users[];
  searchTerm: string = '';
  dataSource: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;

  breadscrums = [
    {
      title: 'Admin',
      items: ['Manage Users'],
      active: 'User Group',
    },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    public utils: UtilsService
  ) {
    this.userTypeFormGroup = this.fb.group({
      typeName: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.userGroup]],
      shortDes: ['',[Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.name]],
      userId: new FormControl('', [Validators.required,...this.utils.validators.user]),
    });
    this.coursePaginationModel = {};
  }

  ngOnInit(): void {
    this.setup();
    this.getUserGroups();
  }

  getUserGroups(filters?: any) {
    this.userService.getUserGroups({ ...this.coursePaginationModel }).subscribe(
      (response: any) => {
        this.dataSource = response.data.docs;
      },
      (error) => {}
    );
  }

  setup() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.users = response?.results.reverse()
    });
  }

  submit() {
    if (this.userTypeFormGroup.valid) {
      const courseData = this.userTypeFormGroup.value;
      let userId = localStorage.getItem('id')

      let payload = {
        group_name: courseData?.typeName,
        shortDes: courseData?.shortDes,
        userId: courseData?.userId,
        adminId:userId
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to create a user group!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.saveGroups(payload).subscribe((response: any) => {
            Swal.fire({
              title: 'Successful',
              text: 'Group created successfully',
              icon: 'success',
            });
            this.getUserGroups();
            this.userTypeFormGroup.reset();
            // this.courseAdded=true;
            // this.router.navigate(['/admin/courses/submitted-courses/pending-courses'])
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'User Group already exists',
              icon: 'error',
            });
  
          });
        }
      });
    } else{
      this.userTypeFormGroup.markAllAsTouched(); 
    }
    
  }
  update(id: any) {
    this.router.navigate(['/student/settings/update-user-group'], {
      queryParams: {
        id: id,
      },
    });
  }
}
