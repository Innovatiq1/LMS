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
  // breadscrums = [
  //   {
  //     title: 'Profile',
  //     items: ['Super Admin'],
  //     active: 'View Admin',
  //   },
  // ];
  currentId: any;
  aboutData1: any;
  viewPackageUrl: any;
  breadcrumbs:any[] = [];
  storedItems: string | null;

  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private StudentService: StudentsService,
    private router: Router
  ) {

    this.storedItems = localStorage.getItem('activeBreadcrumb');
    if (this.storedItems) {
     this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
     this.breadcrumbs = [
       {
         title: '', 
         items: [this.storedItems],  
         active: ' View Company',  
       },
     ];
   }
    this.activeRoute.queryParams.subscribe((params) => {
      this.currentId = params['id'];
    });

    
    let urlPath = this.router.url.split('/')
    this.viewPackageUrl = urlPath.includes('view-package-details');


    if(this.viewPackageUrl == true){
      // this.breadscrums = [
      //   {
      //     title: 'Profile',
      //     items: ['Super Admin'],
      //     active: 'View Package',
      //   },
      // ];
      this.storedItems = localStorage.getItem('activeBreadcrumb');
    if (this.storedItems) {
     this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
     this.breadcrumbs = [
       {
         title: '', 
         items: [this.storedItems],  
         active: 'View Package',  
       },
     ];
   }
    }
  }
ngOnInit(){
  this.loadData();
}
  // loadData(filters?: any) {
  //   this.userService.getUserById(this.currentId).subscribe(
  //     (response: any) => {
  //       this.aboutData1 = response.data.data;
  //     },
  //     () => {}
  //   );
  // }

  loadData(filters?: any) {
  this.userService.getUserById(this.currentId).subscribe(
    (response: any) => {
      this.aboutData1 = response.data.data;
      console.log("Fetched user data:", this.aboutData1);
    },
    (error) => {
      console.error("Error fetching user data:", error);
    }
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
  confirmItem(row: any) {
  row.Active=true;
    Swal.fire({
      title: "Confirm Active",
      text: `Are you sure you want to activate this ${row.role}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Active",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateUsers(row, this.currentId).subscribe(
          (response) => {
            Swal.fire({
              title: "Active",
              text: `${row.role} Activated successfully`,
              icon: "success",
            });
            this.loadData();
            window.history.back();
          },
          (error: { message: any; error: any; }) => {
            Swal.fire(
              `Failed to Activate ${row.role}`,
              error.message || error.error,
              "error"
            );
          }
        );
      }
    });
 
  }
  deactiveconfirmItem(row: any) {
    // console.log("deactiveconfirmItem",row)
    row.Active=false;
   Swal.fire({
     title: "Confirm InActive",
     text: "Are you sure you want to in-active?",
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#d33",
     cancelButtonColor: "#3085d6",
     confirmButtonText: "In-Active",
     cancelButtonText: "Cancel",
   }).then((result) => {
     if (result.isConfirmed) {
      this.userService.updateUsers(row, this.currentId).subscribe(
        (response) => {
           Swal.fire({
             title: "Active",
             text: "In-Active successfully",
             icon: "success",
           });
           this.loadData()
         },
         (error: { message: any; error: any; }) => {
           Swal.fire(
             "Failed to In-Active",
             error.message || error.error,
             "error"
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
