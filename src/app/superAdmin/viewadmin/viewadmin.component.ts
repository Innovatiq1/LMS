import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core/service/user.service';
import { StudentsService } from 'app/admin/students/students.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewadmin',
  templateUrl: './viewadmin.component.html',
  styleUrls: ['./viewadmin.component.scss'],
})
export class ViewadminComponent {
  breadscrums = [
    {
      title: 'Profile',
      items: ['Super Admin'],
      active: 'View Admin',
    },
  ];
  currentId: any;
  aboutData1: any;
  viewPackageUrl: any;
  
  // mode: string = 'viewPackageUrl';

  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private StudentService: StudentsService,
    private router: Router
  ) {
    this.activeRoute.queryParams.subscribe((params) => {
      this.currentId = params['id'];
      console.log(this.currentId);
    });

    
    let urlPath = this.router.url.split('/')
    this.viewPackageUrl = urlPath.includes('view-package-details');


    if(this.viewPackageUrl == true){
      this.breadscrums = [
        {
          title: 'Profile',
          items: ['Super Admin'],
          active: 'View Package',
        },
      ];
    }
  }
ngOnInit(){
  this.loadData();
}
  loadData(filters?: any) {
    this.userService.getUserById(this.currentId).subscribe(
      (response: any) => {
        console.log('listing user', response);
        this.aboutData1 = response.data.data;
      },
      () => {}
    );
  }
  deleteItem(row: any) {
    // this.id = row.id;
    console.log('kjkj', row);
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.StudentService.deleteUser(row.id).subscribe(
          () => {
            Swal.fire({
              title: 'Deleted',
              text: 'User deleted successfully',
              icon: 'success',
            });
            //this.fetchCourseKits();
            this.router.navigate(['/super-admin/admin-list']);
            this.loadData();
          },
          (error: { message: any; error: any }) => {
            Swal.fire(
              'Failed to delete Student',
              error.message || error.error,
              'error'
            );
          }
        );
      }
    });
  }
  edit(){
    this.router.navigate(['/super-admin/edit-admin'], {
      queryParams: {
        id: this.currentId,
      },
    });
  }
  editPackage(){
    this.router.navigate(['/super-admin/edit-package-details'], {
      queryParams: {
        id: this.currentId,
      },
    });
  }
}
