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
  

  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private StudentService: StudentsService,
    private router: Router
  ) {
    this.activeRoute.queryParams.subscribe((params) => {
      this.currentId = params['id'];
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
        this.aboutData1 = response.data.data;
      },
      () => {}
    );
  }
  deleteItem(row: any) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Do you want to delete this company',
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
              text: 'Company deleted successfully',
              icon: 'success',
            });
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
