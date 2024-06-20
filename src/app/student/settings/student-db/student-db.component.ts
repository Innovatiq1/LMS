import { Component } from '@angular/core';
import {
  FormArray,
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-db',
  templateUrl: './student-db.component.html',
  styleUrls: ['./student-db.component.scss'],
})
export class StudentDbComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Customize'],
      active: 'Dashboards',
    },
  ];
  dbForm!: FormGroup;
  id: any;
  // dashboard: any;
  dashboardId: any;
  data: any;
  subscribeParams: any;
  dashboard: string = '';

  constructor(
    private fb: UntypedFormBuilder,
    private settingsService: SettingsService,
    private activatedRoute: ActivatedRoute,
    public utils: UtilsService,
    private router: Router, 
  ) {
    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.dashboardId = params.id;
      }
    );
    
  }

  ngOnInit(): void {
    this.dbForm = this.fb.group({
      studentDb: this.fb.array([]),
    });
    this.getData();
  }
  get studentDb(): FormArray {
    return this.dbForm.get('studentDb') as FormArray;
  }


  createStudentDb(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      viewType: [''],
      // percentage: [],
    });
  }

  update() {
    if (this.dbForm.valid) {
      let userId = localStorage.getItem('id');
      const payload = {
        content: this.dbForm.value.studentDb.map((menulist: any) => ({
          title: menulist?.title,
          viewType: menulist?.viewType,
          adminId:userId
          // percentage: menulist?.percentage,
        })),
        id: this.dashboardId,
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update this Dashboard!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.settingsService
            .updateStudentDashboard(payload)
            .subscribe((response: any) => {
              Swal.fire({
                title: 'Successful',
                text: 'Dashboard updated successfully',
                icon: 'success',
              });
              this.router.navigate(['/student/settings/student-dashboard']);
            });

        }
      });
    }
  }

  getData() {
    this.settingsService
      .getStudentDashboardById(this.dashboardId)
      .subscribe((response: any) => {
        const studentDbArray = this.dbForm.get('studentDb') as FormArray;
        if (response.content) {
          response.content.forEach((menuItem: any, i: number) => {
            const newStudentDbGroup = this.createStudentDb();
            newStudentDbGroup.patchValue({
              title: menuItem?.title,
              viewType: menuItem?.viewType,
              // percentage: menuItem?.percentage,
            });
            studentDbArray.push(newStudentDbGroup);
          });
        }
      });
  }

  cancel() {
    window.history.back();
  }
}
