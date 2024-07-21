import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../survey.service';
import Swal from 'sweetalert2';
import { SendDailogComponent } from './send-dailog/send-dailog.component';
import { Direction } from '@angular/cdk/bidi';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '@core/service/user.service';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-feedback-view',
  templateUrl: './feedback-view.component.html',
  styleUrls: ['./feedback-view.component.scss'],
})
export class FeedbackViewComponent {
  breadscrums = [
    {
      title: 'Feedback',
      items: ['Survey List'],
      active: 'View Survey',
    },
  ];
  surveyId!: string;
  questionsList: any = [];
  allUsers: any;
  surveyName: any;
  edit = false;
  isDelete = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private router: Router,
    public dialog: MatDialog,
       private alluserService: UserService,
    private authenService: AuthenService


  ) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.surveyId = params.id;
    });
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 3];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let editAction = actions.filter((item:any) => item.title == 'Edit')
    let deleteAction = actions.filter((item:any) => item.title == 'Delete')

    if(editAction.length >0){
      this.edit = true;
    }
    if(deleteAction.length >0){
      this.isDelete = true;
    }
    this.getData();
  }

  getData() {
    this.surveyService
      .getSurveyQuestionsById(this.surveyId)
      .subscribe((response: any) => {
        if (response && response.questions) {
          this.surveyName = response.name
          this.questionsList = {
            name: response.name,
            questions: response.questions.map((question: any) => {
              return {
                type: question.type,
                questionText: question.questionText,
                isMandatory: question.isMandatory,
                maxRating: question.maxRating,
                options: question.options?.map((option:any)=> option.text)||null
              };
            }),
          };
        }
      });
  }
  sendSurvey(){
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      this.alluserService.getAllStudents().subscribe((response: any) => {
        this.allUsers = response.results;
        const dialogRef = this.dialog.open(SendDailogComponent, {
          data: {
            users:this.allUsers,
            surveyId:this.surveyId,
            surveyName:this.surveyName
          },
          direction: tempDirection,
         
        });
  
      })    
  }
  delete(){
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.surveyService.deleteSurveyQuestions(this.surveyId).subscribe(
          (res: any) => {
            Swal.fire({
              title: 'Successful',
              text: 'Feedback Question deleted successfully',
              icon: 'success',
            });
            this.router.navigate(['/admin/survey/survey-list']);
          },
          (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete Feedback Question',
            });
          }
        );
      }
    });
  }
}
