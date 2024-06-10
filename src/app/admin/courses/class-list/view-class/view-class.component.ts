import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { AppConstants } from '@shared/constants/app.constants';
import { ClassService } from 'app/admin/schedule-class/class.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-class',
  templateUrl: './view-class.component.html',
  styleUrls: ['./view-class.component.scss']
})
export class ViewClassComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Course Class'],
      active: 'View Course Class',
    },
  ];
  classDataById: any;
  classData: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  courseId: any;
  response: any;
  isAdmin: boolean = false;
  isInstructor: boolean = false;

  constructor(public _classService: ClassService,private _router: Router, private activatedRoute: ActivatedRoute,) {
    this.coursePaginationModel = {};
    this.activatedRoute.params.subscribe((params: any) => {
      
      this.courseId = params.id;
      // if(this.courseId){
      //   this.getProgramByID(this.courseId);
      // }

    });
  }

  ngOnInit(): void {
    this.getClassList();
    if (this.courseId) {
      this.activatedRoute.params.subscribe((params: any) => {
        
        this.courseId = params.id;
        this.getCategoryByID(this.courseId);
      });
    }
    let userType = localStorage.getItem('user_type');
    if (userType == AppConstants.ADMIN_USERTYPE) {
      this.isAdmin = true;
    }
    if (userType == AppConstants.INSTRUCTOR_ROLE) {
      this.isInstructor = true;
    }
  }

  getClassList() {
    this._classService
      .getClassListWithPagination({ ...this.coursePaginationModel })
      .subscribe(
        (response) => {
          
          if (response.data) {
            this.classData = response.data.docs;
          }
        },
        (error) => {
          
        }
      );
  }
  getCategories(id: string): void {
    
    this.getCategoryByID(id);
  }
  getCategoryByID(id: string) {
     this._classService.getClassById(id).subscribe((response: any) => {
      this.classDataById = response?._id;
      this.response = response;
      // this.subCategory = response.subCategories;
      // if (response && response.data && response.data._id) {
      //   this.classDataById = response?._id;
      //   this.response = response.data;
      // } else {
       
      // }
    });
  }
  editClass(id:string){
    this._router.navigate([`admin/courses/create-class`], { queryParams: {id: id}});
  }
  // getStatusClass(classDeliveryType: string): string {
  //   return classDeliveryType === 'online' ? 'success' : 'fail';
  // }
  delete(id: string) {
    
    this._classService.getClassList({ courseId: id }).subscribe((classList: any) => {
      const matchingClasses = classList.docs.filter((classItem: any) => {
        return classItem.courseId && classItem.courseId.id === id;
      });

      Swal.fire({
        title: "Confirm Deletion",
        text: "Are you sure you want to delete this Class?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          if (matchingClasses.length > 0) {
            Swal.fire({
              title: 'Error',
              text: 'Class have been registered . Cannot delete.',
              icon: 'error',
            });
            return;
          }
          this._classService.deleteClass(id).subscribe(() => {
            Swal.fire({
              title: 'Success',
              text: 'Class deleted successfully.',
              icon: 'success',
            });
            this.getClassList();
            window.history.back();
            // this._router.navigateByUrl(`/admin/courses/class-list`);
          });
    }
    });

    });
  }

}
