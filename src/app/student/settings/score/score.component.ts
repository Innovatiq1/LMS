import { Component } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
//import { CourseService } from '@core/service/course.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent {
  scoreAlgorithmForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Score Algorithm',
      items: ['Configuration'],
      active: 'Score Algorithm',
    },
  ];
  dataSource :any;
  isCreate = false;
  isEdit = false;

  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private SettingsService:SettingsService,public utils:UtilsService,
    private authenService: AuthenService) {
      this.scoreAlgorithmForm = this.fb.group({
        scores: ['', [Validators.required,...this.utils.validators.noLeadingSpace]],
        // description: ['', [Validators.required,...this.utils.validators.name, ...this.utils.validators.noLeadingSpace]]

      })
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let editAction = actions.filter((item:any) => item.title == 'Edit')

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(editAction.length >0){
      this.isEdit = true;
    }
    this.getAllScoreAlgorithm();
  }

  onSubmit() {
    if(this.scoreAlgorithmForm.valid){
      // let userId = localStorage.getItem('id');
      // this.passingCriteriaForm.value.adminId=userId;
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.scoreAlgorithmForm.value.companyId=userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create Score Algorithm',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.SettingsService.saveScoreAlgorithm(this.scoreAlgorithmForm.value).subscribe((response: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Score Algorithm created successfully',
            icon: 'success',
          });
          this.getAllScoreAlgorithm();
          this.scoreAlgorithmForm.reset();
          // this.router.navigate(['/student/settings/create-department'])
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Score Algorithm already exists',
            icon: 'error',
          });

        });
      }
    });
  } else {
    this.scoreAlgorithmForm.markAllAsTouched();
  }
}
getAllScoreAlgorithm(){
  this.SettingsService.getScoreAlgorithm().subscribe((response:any) =>{
    this.dataSource=response.data.docs;
   //this.dataSource = response.reverse();
  })
}
update(data: any) {
  console.log("data score ==",data)
  this.router.navigate(['/student/settings/configuration/score-algorithm/update-score-algorithm'], {
    queryParams: {
      funding: data.scores,
      id: data.id
    }
  });
}

}
