import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubCategory } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.scss'],
})
export class EditCategoriesComponent {
  categoryId: any;
  subscribeParams: any;
  mainCategoryForm!: FormGroup;
  subcategoryId: string = '';
  mainCategoryId: string = '';
  subCategoryForm!: FormGroup;
  isSubmitted: boolean | undefined;
  subCategoryData: SubCategory[] = [];
  fb: any;
  validations: boolean | undefined;

  breadscrums = [
    {
      title: 'Edit Categories',
      items: ['Categories'],
      active: 'Edit Categories',
    },
  ];
  row: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public utils: UtilsService,
    private courseService: CourseService
  ) {
    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.categoryId = params.id;
      }
    );
  }
  get subcategories(): FormArray {
    return this.subCategoryForm.get('subcategories') as FormArray;
  }
  ngOnInit(): void {
    this.initMainCategoryForm();
    this.initSubCategoryForm();
    this.addSubCategoryField();
    this.getData();
  }

  isDeleteVisible(subcategory: AbstractControl): boolean {
    return subcategory.value.category_name !== '';
  }

  addSubCategoryField(): void {
    this.subcategories.push(
      this.formBuilder.group({
        category_name: ['', Validators.required],
      })
    );
  }
  initMainCategoryForm(): void {
    this.mainCategoryForm = this.formBuilder.group({
      category_name: new FormControl('', [
        Validators.required,
        ...this.utils.validators.category_name,
        ...this.utils.validators.noLeadingSpace,
      ]),
    });
  }
  initSubCategoryForm(): void {
    this.subCategoryForm = this.formBuilder.group({
      sub_id: [''],
      main_category_id: [''],
      subcategories: this.formBuilder.array([]),
      category_name: ['', Validators.required],
    });
  }
  getData() {
    this.courseService
      .getcategoryById(this.categoryId)
      .subscribe((response: any) => {
        if (response) {
          this.mainCategoryId = response?._id;
          this.mainCategoryForm.patchValue({
            category_name: response?.category_name,
          });

          const itemControls = response?.subCategories.map(
            (item: { _id: any; main_category_id: any; category_name: any }) => {
              this.subcategoryId = item._id;
              return this.formBuilder.group({
                sub_id: [item._id],
                main_category_id: [item.main_category_id],
                category_name: [item.category_name],
              });
            }
          );
          this.subCategoryForm = this.formBuilder.group({
            subcategories: this.formBuilder.array(itemControls),
          });
        }
      });
  }

  deleteSubCategory(id: string) {
    this.courseService.deleteSubCategory(id).subscribe((data) => {});
  }

  deleteSubCategoryField(index: number, sub?: any): void {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this sub category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subcategories.removeAt(index);
        const id = sub.value.sub_id;
        this.deleteSubCategory(id);
        Swal.fire({
          title: 'Success',
          text: 'Record Deleted Successfully...!!!',
          icon: 'success',
        });
      }
    });
  }
  createSubCategory(): void {
    this.isSubmitted = true;
    if (this.subCategoryForm.invalid) {
      this.validations = true;
      return;
    }

    this.subCategoryData = this.subcategories.value;
    let data = {
      main_category_id: this.subCategoryData[0].main_category_id,
      category_name: this.subCategoryData[0].category_name,
    };
    this.subCategoryData.forEach((subcategory) => {
      subcategory.main_category_id = this.mainCategoryId;
    });

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this sub category!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService
          .updateSubCategory(this.subcategoryId, this.subCategoryData)
          .subscribe(
            (response) => {
              Swal.fire(
                'Success',
                'Subcategories upated successfully!',
                'success'
              );
              this.mainCategoryForm.reset();
              this.subCategoryForm.reset();
              this.initSubCategoryForm();
              this.addSubCategoryField();
              window.history.back();
            },
            (error) => {
              Swal.fire('Error', 'Failed to update subcategories!', 'error');
            }
          );
      }
    });

    this.isSubmitted = false;
  }
  createMainCategory(): void {
    this.isSubmitted = true;
    if (this.mainCategoryForm.invalid) {
      return;
    }

    const mainCategoryData = this.mainCategoryForm.value;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this main category!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService
          .updateMainCategory(this.mainCategoryId, mainCategoryData)
          .subscribe(
            (response) => {
              Swal.fire(
                'Success',
                'Main category Updated successfully!',
                'success'
              );
            },
            (error) => {
              Swal.fire('Error', 'Failed to update main category!', 'error');
            }
          );
      }
    });

    this.isSubmitted = false;
  }
}
