import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { AdminService } from '@core/service/admin.service';
import { CourseService } from '@core/service/course.service';
import Swal from 'sweetalert2';
import { Staff } from 'app/admin/staff/staff.model';
import { StaffService } from 'app/admin/staff/staff.service';

@Component({
  selector: 'app-about-staff',
  templateUrl: './about-staff.component.html',
  styleUrls: ['./about-staff.component.scss'],
})
export class AboutStaffComponent implements OnInit{
  breadscrums = [
    {
      title: 'Profile',
      items: ['Staff'],
      active: 'Profile',
    },
  ];
  userTypes: any;
  aboutDataId: any;
  aboutData:any;
  staff?: Staff;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  
  constructor( public _courseService:CourseService,
    private activeRoute:ActivatedRoute,public router:Router,
    public staffService: StaffService ) {
    this.coursePaginationModel = {};
    this.activeRoute.queryParams.subscribe(param =>{
    this.aboutDataId = param['data'];
    })
  }
  ngOnInit() {
    this.loadData();
  }
  loadData(){
    this._courseService.getUserById( this.aboutDataId).subscribe(res => {
      this.aboutData = res;
  
    })
  }
  editCall(row: string) {
    this.router.navigate(['/student/settings/edit-staff'],{queryParams:{id:row}});
  }

  deleteItem(id:any) {

    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this Student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.staffService.deleteStaff(id).subscribe(() => {
            Swal.fire({
              title: "Deleted",
              text: "Staff deleted successfully",
              icon: "success",
            });
            //this.fetchCourseKits();
            this.loadData()
            window.history.back();
          },
          (error: { message: any; error: any; }) => {
            Swal.fire(
              "Failed to delete Staff",
              error.message || error.error,
              "error"
            );
          }
        );
      }
    });
  }

}
