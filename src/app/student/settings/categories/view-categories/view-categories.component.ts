import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.scss']
})
export class ViewCategoriesComponent {

  breadscrums = [
    {
      title: 'Blank',
      items: ['Categories'],
      active: 'View Category',
    },
  ];

  categoryDataById: any;
  categoryData: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  response: any;
  courseId: any;
  subCategory: any;
  
  constructor(
    private courseService: CourseService, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.coursePaginationModel = {};
    this.activatedRoute.params.subscribe((params: any) => {
      console.log("params.id", params.id)
      this.courseId = params.id;
      // if(this.courseId){
      //   this.getProgramByID(this.courseId);
      // }

    });
  }
  ngOnInit(): void {
    this.fetchSubCategories();
    if (this.courseId) {
      this.activatedRoute.params.subscribe((params: any) => {
        
        this.courseId = params.id;
        this.getCategoryByID(this.courseId);
      });
    }
  }
  fetchSubCategories(): void {
    this.courseService
      .getMainCategoriesWithPagination({ ...this.coursePaginationModel })
      .subscribe(
        (response) => {
          this.categoryData = response.data.docs;
        },
        (error) => {
          console.error('Failed to fetch categories:', error);
        }
      );
  }
  getCategories(id: string): void {
    
    this.getCategoryByID(id);
  }
  getCategoryByID(id: string) {
    this.courseService.getcategoryById(id).subscribe((response: any) => {
      this.categoryDataById = response?._id;
      this.response = response;
      this.subCategory = response.subCategories;
      // if (response && response.data && response.data.id) {
      //   this.response = response;
      //   this.categoryDataById = this.response?._id;
      // } else {
       
      // }
    });
  }
  edit(id:any){
    this.router.navigate(['/student/settings/edit-categories/'+ id]);
  }

  deleteItem(item: any) {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCategory(item._id).subscribe(
          () => {
            Swal.fire({
              title: "Deleted",
              text: "Category deleted successfully",
              icon: "success",
            });
            
            this.fetchSubCategories();
            window.history.back();
            // this.getCategoryByID(id);
          },
          (error: { message: any; error: any; }) => {
            Swal.fire(
              "Failed to delete Category",
              error.message || error.error,
              "error"
            );
          }
        );
      }
    });
  }
  
}
