import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { EtmsService } from '@core/service/etms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-budget',
  templateUrl: './view-budget.component.html',
  styleUrls: ['./view-budget.component.scss']
})
export class ViewBudgetComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Budget'],
      active: 'View Budget',
    },
  ];

  budgetDataById: any;
  budgetData: any;
  response: any;
  budgetId: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  
  constructor(
    private etmsService: EtmsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.coursePaginationModel = {};
    this.activatedRoute.params.subscribe((params: any) => {
      this.budgetId = params.id;
     

    });
  }
  ngOnInit(): void {
    this.getAllBudget();
    if (this.budgetId) {
      this.activatedRoute.params.subscribe((params: any) => {
        
        this.budgetId = params.id;
        this.getBudgetsByID(this.budgetId);
      });
    }
  }
  getAllBudget(): void {
    this.etmsService
    .getAllBudgets({...this.coursePaginationModel})
      .subscribe(
        (response) => {
          this.budgetData = response.data.docs;
        },
        (error) => {
          console.error('Failed to fetch request:', error);
        }
      );
  }
  getBudget(id: string): void {
    this.getBudgetsByID(id);
  }
  getBudgetsByID(id: string) {
    this.etmsService.getBudgetById(id).subscribe((response: any) => {
      this.budgetDataById = response?._id;
      this.response = response;
    
    });
  }
  edit(id: any) {
    this.router.navigate(['/admin/budgets/create-budget'], {
      queryParams: { id: id, action: 'edit' },
    });
  }

  deleteTraining(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this budget data!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.etmsService.deleteTrainingBudget(id).subscribe((res) => {
          if (res) {
            Swal.fire('Deleted!', 'Budget request deleted successfully.', 'success');
          }
          this.getAllBudget();
          this.router.navigate(['/admin/budgets/budget']);
        });
      }
    });
  }

}
