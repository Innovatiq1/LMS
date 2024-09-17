import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { EtmsService } from '@core/service/etms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-dept-budget',
  templateUrl: './view-dept-budget.component.html',
  styleUrls: ['./view-dept-budget.component.scss']
})
export class ViewDeptBudgetComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Allocation'],
      active: 'View Department Budget',
    },
  ];

  deptBudgetDataById: any;
  deptBudgetData: any;
  response: any;
  deptBudgetId: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  
  constructor(
    private etmsService: EtmsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.coursePaginationModel = {};
    this.activatedRoute.params.subscribe((params: any) => {
      this.deptBudgetId = params.id;
     

    });
  }
  ngOnInit(): void {
    this.getAllDeptBudget();
    if (this.deptBudgetId) {
      this.activatedRoute.params.subscribe((params: any) => {
        
        this.deptBudgetId = params.id;
        this.getDeptBudgetsByID(this.deptBudgetId);
      });
    }
  }
  getAllDeptBudget(): void {
    this.etmsService
    .getAllDepartmentBudgets({...this.coursePaginationModel})
      .subscribe(
        (response) => {
          this.deptBudgetData = response.data.docs;
        },
        (error) => {
          console.error('Failed to fetch request:', error);
        }
      );
  }
  getDeptBudget(id: string): void {
    this.getDeptBudgetsByID(id);
  }
  getDeptBudgetsByID(id: string) {
    this.etmsService.getDeptBudgetById(id).subscribe((response: any) => {
      this.deptBudgetDataById = response?._id;
      this.response = response;
    
    });
  }
  edit(id: any) {
    this.router.navigate(['/admin/budgets/edit-dept-budget-request'], {
      queryParams: { id: id, action: 'edit' },
    });
  }
  delete(id: string){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to recover this department budget!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.etmsService.deleteBudget(id).subscribe((res) => {
         
          Swal.fire(
            'Deleted!',
            'Department Budget Deleted Successfully.',
          'success'
          )
        })
        this.getAllDeptBudget();
        this.router.navigate(['/admin/budgets/allocation']);
      }
    })
  }
}
