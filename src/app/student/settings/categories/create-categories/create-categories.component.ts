import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel, SubCategory } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-categories',
  templateUrl: './create-categories.component.html',
  styleUrls: ['./create-categories.component.scss']
})
export class CreateCategoriesComponent implements OnInit{

  listCat: any;
  subCategoryForm!: FormGroup;
  mainCategoryForm!: FormGroup;
  mainCategoryId: string = '';
  isSubmitted=false;
  validations=false;
  subCategoryData :SubCategory[]=[];
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr =this.utils.pageSizeArr;
  list :boolean = true;
  create :boolean = true;
  dataSource: any;
  editUrl: any;
  subcategoryId: string = '';
  subscribeParams: any;
  categoryId: any;   

  breadscrums = [
    {
      title: 'Create Categories',
      items: ['Categories'],
      active: 'Create Categories',
    },
  ];

  constructor(
    private router: Router,
    private courseService:CourseService,
    private formBuilder: FormBuilder,
    public utils:UtilsService,
    private activatedRoute: ActivatedRoute, 
  ){
    let urlPath = this.router.url.split('/')

    this.editUrl = urlPath.includes('edit-categories');



    if(this.editUrl===true){
      this.breadscrums = [
        {
          title:'Edit Categories',
          items: ['Settings'],
          active: 'Edit Categories',
        },
      ];
    }

    this.coursePaginationModel = {};
    this.coursePaginationModel.main_category = '0';
    this.coursePaginationModel.sub_category = '0';

     
    this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.categoryId = params.id;
  });
}
  get subcategories(): FormArray {
    return this.subCategoryForm.get('subcategories') as FormArray;
  }
  ngOnInit(): void {
    if(this.editUrl){
          this.getData();
          }
   
    this.initMainCategoryForm();
    this.initSubCategoryForm();
    this.addSubCategoryField();
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page= $event?.pageIndex + 1;
    this.coursePaginationModel.limit= $event?.pageSize;
    
   }

  addSubCategoryField(): void {
    this.subcategories.push(
      this.formBuilder.group({
        category_name: ['', Validators.required]
      })
    );
  }
  initSubCategoryForm(): void {
    this.subCategoryForm = this.formBuilder.group({
      main_category_id: [''],
      subcategories: this.formBuilder.array([]),
      category_name: ['', Validators.required]
    });
  }


  createMainCategory(): void {
    this.isSubmitted=true
    if (this.mainCategoryForm.invalid) {
      return;
    }
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const mainCategoryData = {...this.mainCategoryForm.value, companyId : userId}
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Main category!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){

    this.courseService.createMainCategory(mainCategoryData).subscribe(
      (response) => {
        Swal.fire('Success', 'Main category created successfully!', 'success');
        this.mainCategoryId = response.data._id;
      },
      (error) => {
        Swal.fire('Error', 'Failed to create main category!', 'error');
      }
    );
      }
    });



    this.isSubmitted=false
  }
  deleteItem(item: any) {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this course kit?",
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
          },
          (error: { message: any; error: any; }) => {
            Swal.fire(
              "Failed to delete course kit",
              error.message || error.error,
              "error"
            );
          }
        );
      }
    });
  }

  deleteSubCategoryField(index: number): void {
    this.subcategories.removeAt(index);
  }
  
  createSubCategory(): void {
    this.isSubmitted=true;
 
    this.subCategoryData = this.subcategories.value;
    this.subCategoryData.forEach(subcategory => {
      subcategory.main_category_id = this.mainCategoryId;
    });
    console.log("create",this.subCategoryData)
    if(this.subCategoryData[0].category_name !==''){
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create sub category!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed){
          this.courseService.createSubCategory(this.subCategoryData).subscribe(
            (response) => {
              Swal.fire('Success', 'Subcategories created successfully!', 'success');
              this.mainCategoryForm.reset();
              this.subCategoryForm.reset();
              this.initSubCategoryForm();
              this.addSubCategoryField();
              window.history.back();
            },
            (error) => {
              Swal.fire('Error', 'Failed to create subcategories!', 'error');
            }
          );
        }
      });
    }
  
    
   
    this.isSubmitted=false
  }

  initMainCategoryForm(): void {
    this.mainCategoryForm = this.formBuilder.group({
      category_name: new FormControl('', [Validators.required,...this.utils.validators.category_name,...this.utils.validators.noLeadingSpace]),
      
    });
  }
  
  
  upload() {
    document.getElementById('input')?.click();
  }
  getData(){
    this.courseService.getcategoryById(this.categoryId).subscribe((response: any) => {
      if(response){
        this.mainCategoryId=response?._id
        this.mainCategoryForm.patchValue({
          category_name: response?.category_name,
              });
        
        const itemControls = response?.subCategories.map((item: {
          _id: any; main_category_id: any; category_name: any; 
  } ) => {
    
          this.subcategoryId =item._id
          return this.formBuilder.group({
           sub_id:[item._id],
            main_category_id: [item.main_category_id],
            category_name: [item.category_name],
          });
        });
        this.subCategoryForm = this.formBuilder.group({
          subcategories: this.formBuilder.array(itemControls),
        });
      }
    });
  
  }

}
