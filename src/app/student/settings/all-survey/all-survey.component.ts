import { Component, NgZone, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SurveyService } from '@core/service/survey.service'; 
import {  ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-survey',
  templateUrl: './all-survey.component.html',
  styleUrls: ['./all-survey.component.scss']
})
export class AllSurveyComponent implements OnInit {
  
  displayedColumns: string[] = ['companyName', 'title', 'fieldCount', 'actions'];
  searchTerm: string = '';
  surveyFields: { label: string; type: string }[] = [];
  
  dataSource = new MatTableDataSource<any>([]);
  editingSurveyId: string | null = null;
  form: any;
  

  constructor(private surveyService: SurveyService,private router: Router, private route: ActivatedRoute, private ngZone: NgZone ) {}

  ngOnInit() {
    this.getAllSurveys();
    this.route.queryParams.subscribe(params => {
     const id = params['surveyId'] as string;
     if (id) {
       this.editingSurveyId = id;
       this.loadSurveyForEdit(id);
     }
    }
    );
  }
  
  getAllSurveys() {
    this.surveyService.getAllSurveys().subscribe({
      next: (data: any[]) => {
        console.log("All surveys received:", data);
        this.dataSource.data = data.map((s, i) => ({ ...s, id: i + 1 }));
  
        if (data.length > 0) {
          this.surveyFields = data[0].fields.map((field: any) => ({
            label: field.label,
            type: field.type
          }));
        }
      },
      error: err => {
        console.error("Error fetching surveys:", err);
      }
    });
  }

  editSurvey(row: any): void {
    this.router.navigate(['student/survey-form/survey-registration'], 
      { queryParams: { surveyId: row._id } }
    );
    console.log('Edit Survey:', row);
  }
  
  getFieldCount(fields: any[]): number {
    return fields ? fields.length : 0;
  }
  
  performSearch() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }
  
  viewSurvey(row: any) {
    console.log('View Survey:', row);
  }

  confirmDelete(row: any): void {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `Are you sure you want to delete?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSurvey(row._id);
      }
    });
  }
  
  deleteSurvey(id: string): void {
    this.surveyService.deleteSurvey(id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Deleted!',
          text: 'Survey has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.getAllSurveys();
      },
      error: err => {
        console.error('Error deleting survey:', err);
        Swal.fire('Error', 'Failed to delete survey.', 'error');
      }
    });
  }
   
  loadSurveyForEdit(id: string): void {
    this.surveyService.getSurveyById(id).subscribe({
      next: (survey) => {
        console.log('Loaded survey for edit:', survey);
        this.form.patchValue({
          title: survey.title,
          // description: survey.description,
          fields: survey.fields,
        });
      },
      error: err => {
        console.error('Error loading survey for edit:', err);
      }
    });
  }

  submitForm(): void {
    const formData = this.form.value;
  
    if (this.editingSurveyId) {
      this.surveyService.updateSurvey(this.editingSurveyId, formData).subscribe({
        next: () => {
          Swal.fire('Success', 'Survey updated successfully!', 'success');
          this.router.navigate(['/student/all-survey']);
        },
        error: err => {
          Swal.fire('Error', 'Update failed.', 'error');
        }
      });
    } else {
      this.surveyService.createSurvey(formData).subscribe({
        next: () => {
          Swal.fire('Success', 'Survey created successfully!', 'success');
          this.router.navigate(['/student/all-survey']);
        },
        error: err => {
          Swal.fire('Error', 'Create failed.', 'error');
        }
      });
    }
  }
  
  
  
}
