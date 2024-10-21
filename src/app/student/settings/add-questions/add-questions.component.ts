import { AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel, SubCategory } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { QuestionService } from '@core/service/question.service';
import { UtilsService } from '@core/service/utils.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { AddExamQuestionsComponent } from '../add-exam-questions/add-exam-questions.component';
import { AssesmentQuestionsComponent } from '../assesment-questions/assesment-questions.component';
import { TutorialQuestionsComponent } from '../tutorial-questions/tutorial-questions.component';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {
  @Input() approved: boolean = false;
  formType: string = 'Create';

  breadscrums = [
    {
      title: 'Questions',
      items: ['Assessment configuration'],
      active: 'Create assessments',
    },
  ];

questionForm!: FormGroup;
questionId!: string;
editUrl: any;
question: any;
subscribeParams: any;
// selectedTabIndex = 0;
selectedTabIndex: number = 0;
@ViewChild(AssesmentQuestionsComponent) assessmentComponent!: AssesmentQuestionsComponent;
  @ViewChild(AddExamQuestionsComponent) examComponent!: AddExamQuestionsComponent;
  @ViewChild(TutorialQuestionsComponent) tutorialComponent!: TutorialQuestionsComponent;
  storedItems: string | null;
  breadcrumbs:any[] = []

constructor(private formBuilder: FormBuilder,private router: Router, private questionService: QuestionService, private cdr: ChangeDetectorRef,private activatedRoute: ActivatedRoute,private ngZone: NgZone) {

  this.storedItems = localStorage.getItem('activeBreadcrumb');
  if (this.storedItems) {
   this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
   this.breadcrumbs = [
     {
       title: '', 
       items: [this.storedItems],  
       active: 'Create assessments',  
     },
   ];
 }
  let urlPath = this.router.url.split('/')
  this.editUrl = urlPath.includes('edit-questions');



  if(this.editUrl===true){
    this.breadcrumbs = [
      {
        title:'Edit Assessments',
        items: [this.storedItems], 
        active: 'Edit Assessments',
      },
    ];
  }

  this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
    this.questionId = params.id;
  });

  this.activatedRoute.queryParams.subscribe(params => {
    if (params['approved'] && params['approved'] === 'true') {
      this.approved = true; 
    }

    if (params['assessmentType']) {
      this.formType = params['assessmentType'];
    }
  });
}

ngOnInit() {
  this.questionForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    questions: this.formBuilder.array([
      this.createQuestion()
    ])
  });
  this.getData();
}


onTabChange(index: number): void {
  this.selectedTabIndex = index;

  // Properly stop auto-save for all components first
  if (this.assessmentComponent) this.assessmentComponent.ngOnDestroy();
  if (this.examComponent) this.examComponent.ngOnDestroy();
  if (this.tutorialComponent) this.tutorialComponent.ngOnDestroy();

  // Start auto-save only for the selected component
  switch (index) {
    case 0:
      this.assessmentComponent?.startAutoSave();
      break;
    case 1:
      this.examComponent?.startAutoSave();
      break;
    case 2:
      this.tutorialComponent?.startAutoSave();
      break;
    default:
      break;
  }
}



get questions(): FormArray {
  return this.questionForm.get('questions') as FormArray;
}

addQuestion() {
  this.questions.push(this.createQuestion());
  this.cdr.detectChanges();
}

addOption(questionIndex: number) {
  const options = this.getOptions(questionIndex);
  options.push(this.createOption());
}

createQuestion(): FormGroup {
  return this.formBuilder.group({
    questionText: ['', Validators.required],
    options: this.formBuilder.array([
      this.createOption(),
    ])
  });
}

createOption(): FormGroup {
  return this.formBuilder.group({
    text: '',
    correct: false
  });
}


getOptions(questionIndex: number): FormArray {
  return this.questions.at(questionIndex).get('options') as FormArray;
}
save() {
  if (this.questionForm.valid) {
    const payload = {
      name: this.questionForm.value.name,
      questions: this.questionForm.value.questions.map((question: any) => ({
        questionText: question.questionText,
        options: question.options.map((option: any) => ({
          text: option.text,
          correct: option.correct
        }))
      }))
    };
Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to create question!',
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed){
      this.questionService.createQuestion(payload).subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Question created successfully',
            icon: 'success',
          });
          this.router.navigate(['/student/settings/all-questions'])
        },
        (err: any) => {
          Swal.fire(
            'Failed to create Question',
            'error'
          );
        }
      );
    }
  });
  }

}

update() {
  if (this.questionForm.valid) {
    const payload = {
      name: this.questionForm.value.name,
      questions: this.questionForm.value.questions.map((question: any) => ({
        questionText: question.questionText,
        options: question.options.map((option: any) => ({
          text: option.text,
          correct: option.correct
        }))
      })),
      id: this.questionId,
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.questionService.updateQuestions(payload).subscribe(
          (res: any) => {
            Swal.fire({
              title: 'Successful',
              text: 'Question Updated successfully',
              icon: 'success',
            });
            this.ngZone.run(() => {
              this.router.navigate(['/student/settings/all-questions']);
            });
          },
          (err: any) => {
            Swal.fire(
              'Failed to update Question',
              'error'
            );
          }
        );
      }
    });
  }
}


getData() {
if (this.questionId) {
  this.questionService.getQuestionsById(this.questionId).subscribe((response: any) => {
    if (response && response.questions) {
      this.question = response;
      this.questionForm.patchValue({
        name: response.name,
      });

      const questionsArray = this.questionForm.get('questions') as FormArray;
      while (questionsArray.length !== 0) {
        questionsArray.removeAt(0);
      }

      response.questions.forEach((question: any) => {
        if (question.questionText.trim() !== '') {
          const newQuestionGroup = this.createQuestion();
          newQuestionGroup.patchValue({
            questionText: question.questionText,
          });

          const optionsArray = newQuestionGroup.get('options') as FormArray;
          optionsArray.clear();
          question.options.forEach((option: any) => {
            optionsArray.push(
              this.formBuilder.group({
                text: option.text,
                correct: option.correct
              })
            );
          });
          questionsArray.push(newQuestionGroup);
        }
      });

    }
  });
}

}


selectTab(index: number) {
  this.selectedTabIndex = index;
}

}
