import { Component } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { CourseService } from '@core/service/course.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-passing-criteria',
  templateUrl: './passing-criteria.component.html',
  styleUrls: ['./passing-criteria.component.scss']
})
export class PassingCriteriaComponent {
  passingCriteriaForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Passing Criteria',
      items: ['Configuration'],
      active: 'Passing Criteria',
    },
  ];
  dataSource :any;

  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private SettingsService:SettingsService,public utils:UtilsService) {
      this.passingCriteriaForm = this.fb.group({
        value: ['', [Validators.required,...this.utils.validators.noLeadingSpace]],
        // description: ['', [Validators.required,...this.utils.validators.name, ...this.utils.validators.noLeadingSpace]]

      })
  }

  ngOnInit() {
    this.getAllPassingCriteria();
  }

  onSubmit() {
    if(this.passingCriteriaForm.valid){
      // let userId = localStorage.getItem('id');
      // this.passingCriteriaForm.value.adminId=userId;
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.passingCriteriaForm.value.companyId=userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create passing Criteria',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.SettingsService.savePassingCriteriya(this.passingCriteriaForm.value).subscribe((response: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Passing Criteria created successfully',
            icon: 'success',
          });
          this.getAllPassingCriteria();
          this.passingCriteriaForm.reset();
          // this.router.navigate(['/student/settings/create-department'])
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Passing Criteria already exists',
            icon: 'error',
          });

        });
      }
    });
  } else {
    this.passingCriteriaForm.markAllAsTouched();
  }
}
getAllPassingCriteria(){
  this.SettingsService.getPassingCriteria().subscribe((response:any) =>{
    this.dataSource=response.data.docs;
   //this.dataSource = response.reverse();
  })
}
update(data: any) {
  
  this.router.navigate(['/student/settings/update-passing-criteria'], {
    queryParams: {
      funding: data.value,
      id: data.id
    }
  });
}

}
