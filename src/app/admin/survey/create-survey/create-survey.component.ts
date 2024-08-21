import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SurveyService } from '../survey.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseTitleModel } from '@core/models/class.model';
import { SurveyBuilderModel } from '../survey.model';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { ExampleDataSource } from '../survey-list/survey-list.component';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
})
export class CreateSurveyComponent {
  selectcourse: boolean = false;
  programData: any = [];
  userTypeNames: any;
  data:any;
  question6 = 0;
  currentRate = 3.14;
  breadscrums = [
    {
      title: 'View Survey',
      items: ['Feedbacks List'],
      active: 'View Feedback',
    },
  ];
  selected = false;
  instructorList: any = [];
  courseList!: CourseTitleModel[];
  countNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedIndex: number | undefined;
  favoriteSeason?: string;
  course: string[] = [
    'Strongly Disagree',
    'Disagree',
    'Normal',
    'Agree',
    'Strongly Agree',
  ];
  levelofcourse: string[] = [
    'Strongly Disagree',
    'Disagree',
    'Normal',
    'Agree',
    'Strongly Agree',
  ];
  expectations: string[]=[
    'Strongly Disagree',
    'Disagree',
    'Normal',
    'Agree',
    'Strongly Agree',
  ];
  subject : string[]=[
    'Strongly Disagree',
    'Disagree',
    'Normal',
    'Agree',
    'Strongly Agree',
  ];

  feedbackForm!: FormGroup;
  questionsection = false;
  ratingsection = false;
  surveyBuilderId = '';
  courseName: any;
  programName: any;
  studentFirstName: any;
  studentLastName!:string;
  questionList: any;
  dataSource: any;
  sort: any;
  paginator: any;
  filter: any;
  subs: any;
  commonRoles: any;
  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public httpClient: HttpClient,
    public exampleDatabase: SurveyService,
  ) {
    this.activeRoute.queryParams.subscribe((param) => {

      this.surveyBuilderId = param['id'];
      this.getSurveyById(this.surveyBuilderId);
    });
    this.feedbackForm = this.fb.group({
      courseName: ['',[] ],
      // question1: ['', []],
      question2:['',[] ],
      question3: ['',[] ],
      question4: ['',[] ],
      question5:['',[]],
      question7: ['',[] ],
    });

    this.commonRoles = AppConstants

  }
    public setRow(_index: number) {

    this.selectedIndex = _index;
  }
  deleteItem(id: SurveyBuilderModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this survey entry!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.surveyService.deleteSurveyBuilders(id).subscribe(response => {
          
          if (response.success){
            Swal.fire(
              'Deleted!',
              'Survey entry has been deleted.',
              'success'
            );
            this.loadData();
          }
        });
      }
    });

  }
  public loadData() {
    this.exampleDatabase = new SurveyService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }

  getSurveyById(id:any){
    this.surveyService.getSurveyBuildersById(id).subscribe((response:any) => {
      this.courseName = response.data.courseName;
      if(response.data.studentId){
        this.studentFirstName = response.data.studentId.name;
        this.studentLastName = response.data.studentId.last_name;
      }else{
        this.studentFirstName = response.data.studentFirstName;
        this.studentLastName = response.data.studentLastName;
      }
      // this.questionList = response?.data?.selectedOptions;
      const surveyId  = response.data.surveyId;
      const selectedAnswer = response.data.selectedOptions;
      this.questionList = {
        name: surveyId.name,
        questions: surveyId.questions.map((question: any) => {
          return {
            type: question.type,
            questionText: question.questionText,
            isMandatory: question.isMandatory,
            maxRating: question.maxRating,
            options: question.options?.map((option:any)=> option.text)|| null,
            answer: selectedAnswer.find((ans:any)=>ans.questionText == question.questionText)?.selectedOption
          };
        }),
      };

      this.feedbackForm.patchValue({
        courseName: response.data.courseName,
      });
    }, (err:any) => {});
  }

}
