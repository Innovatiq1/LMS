import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from 'app/admin/survey/survey.service';
import Swal from 'sweetalert2';
// import { SurveyService } from '../survey.service';

@Component({
  selector: 'app-create-feedback',
  templateUrl: './create-feedback.component.html',
  styleUrls: ['./create-feedback.component.scss'],
})
export class CreateFeedbackComponent  {
  breadscrums = [
    {
      title: 'Feedback',
      items: ['Customize'],
      active: 'Create Feedback Form',
    },
  ];
  questionTypes: any = [
    {
      id: 'text',
      label: 'Text',
    },
    {
      id: 'textarea',
      label: 'Text Area',
    },
    {
      id: 'select',
      label: 'Select',
    },
    {
      id: 'rating',
      label: 'Star Rating',
    },
    {
      id: 'radio',
      label: 'Radio',
    },
    {
      id: 'datePicker',
      label: 'Date Picker',
    },
  ];
  feedbackForm: FormGroup;
  userSelectsString = '';
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  editUrl: boolean = false;
  surveyId!: string;
  questionsList: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService
  ) {
    const urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit-feedback');
    if (this.editUrl) {
      this.breadscrums[0].active = 'Edit Feedback Form';
    } else {
      this.breadscrums[0].active = 'Create Feedback Form';
    }

    this.activatedRoute.params.subscribe((params: any) => {
      this.surveyId = params.id;
    });

    this.feedbackForm = this.formBuilder.group({
      name: ['', Validators.required],
      questions: this.formBuilder.array([]),
    });
    if (this.editUrl) {
      this.getData();
    } else {
      const question = this.addQuestion();
      this.questions.push(question);
    }
    this.feedbackForm.controls['questions'].valueChanges.subscribe(value=>{
      this.getQuestionsList();
    })
  }


  addQuestion() {
    const questionGroup = this.formBuilder.group({
      type: [null, Validators.required],
      questionText: [null, Validators.required],
      isMandatory: [false],
      options: [[]],
      maxRating: [null],
    });
    return questionGroup;
  }

  get questions(): FormArray {
    return this.feedbackForm.get('questions') as FormArray;
  }

  deleteQuestion(index: number) {
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
        this.questions.removeAt(index);
      }
    });
  }

  getOptions(question: any) {
    return question.get('options')?.value;
  }

  deleteOption(question: any, optionIndex: number, questionIndex: number) {
    let options = (this.questions.at(questionIndex) as FormGroup).get(
      'options'
    )?.value;
    if (options.length) {
      options = options.slice(optionIndex, 1);
      (this.questions.at(questionIndex) as FormGroup).patchValue({ options });
    }
  }

  onSelectChange(e: any, questionIndex: number) {
    const value = e.value;
    if (value === 'rating') {
      this.questions.at(questionIndex).patchValue({
        maxRating: 5,
      });
    }
  }

  checkIsRatingInput(question: any) {
    return question.get('type').value === 'rating';
  }

  checkIsOptionQA(question: any) {
    return ['select', 'radio'].includes(question.get('type').value);
  }

  addAdditionalQuestion() {
    const question = this.addQuestion();
    this.questions.push(question);
  }

  addOptions(option: string, questionIndex: number) {
    const options = (this.questions.at(questionIndex) as FormGroup)?.get(
      'options'
    )?.value;
    const updatedOpts = [...options, option];
    this.questions.at(questionIndex).patchValue({
      options: updatedOpts,
    });
  }

  removeOptions(optionIndex: number, questionIndex: number) {
    const options = (this.questions.at(questionIndex) as FormGroup)?.get(
      'options'
    )?.value;
    options.splice(optionIndex, 1);
    this.questions.at(questionIndex).patchValue({
      options,
    });
  }

  updateOptions(option: string, optionIndex: number, questionIndex: number) {
    const options = (this.questions.at(questionIndex) as FormGroup)?.get(
      'options'
    )?.value;
    const updatedOpts = (options[optionIndex] = option);
    this.questions.at(questionIndex).patchValue({
      options: updatedOpts,
    });
  }

  add(event: MatChipInputEvent, questionIndex: number): void {
    const value = (event.value || '').trim();

    if (value) {
      this.addOptions(value, questionIndex);
    }

    event.chipInput!.clear();
  }

  remove(index: number, questionIndex: number): void {
    this.removeOptions(index, questionIndex);
  }

  edit(event: MatChipEditedEvent, optionIndex: number, questionIndex: number) {
    const value = event.value.trim();
    if (!value) {
      this.removeOptions(optionIndex, questionIndex);
      return;
    }
    this.updateOptions(value, optionIndex, questionIndex);
  }

  getQuestionsList() {
    let value = this.questions.value;
    value = value.length === 1
      ? value.filter((v: any) => v.questionText)
      : value || [];
   this.questionsList =  {
      name: this.feedbackForm.get("name")?.value,
      questions: value
    }
  }

  save() {
    if (this.feedbackForm.valid) {
     // const payload = this.feedbackForm.value;
     let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
           const payload = {...this.feedbackForm.value, companyId : userId}
      console.log(payload);
      payload.questions = payload?.questions.map((v: any) => {
        const data = v;
        if (!['select', 'radio'].includes(v.type)) {
          data.options = null;
        } else {
          data.options = data.options.map((opt: any) => ({ text: opt }));
        }
        if (v.type != 'rating') {
          data.maxRating = null;
        }
        return data;
      });
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create Feedback!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          ;
          this.createFeedbackForm(payload);
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill all mandatory fields!',
      });
    }
  }

  createFeedbackForm(payload: any) {
    this.surveyService.createSurveyQuestions(payload).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Successful',
          text: 'Feedback Question created successfully',
          icon: 'success',
        });
        this.router.navigate(['/admin/survey/survey-list']);
      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create Feedback Question',
        });
      }
    );
  }

  update() {
    if (this.feedbackForm.valid) {
      const payload = this.feedbackForm.value;
      payload.questions = payload?.questions.map((v: any) => {
        const data = v;
        if (!['select', 'radio'].includes(v.type)) {
          data.options = null;
        } else {
          data.options = data.options.map((opt: any) => ({ text: opt }));
        }
        if (v.type != 'rating') {
          data.maxRating = null;
        }
        return data;
      });
      payload.id = this.surveyId;
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateFeedbackForm(payload)
        }
      });
    }
  }

  updateFeedbackForm(payload: any) {
    this.surveyService.updateSurveyQuestions(payload).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Successful',
          text: 'Feedback Question created successfully',
          icon: 'success',
        });
        this.router.navigate(['/admin/survey/survey-list']);
      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update Feedback Question',
        });
      }
    );
  }

  getData() {
    this.surveyService
      .getSurveyQuestionsById(this.surveyId)
      .subscribe((response: any) => {
        if (response && response.questions) {
          this.feedbackForm.patchValue({
            name: response.name,
          });

          const questionsArray = this.feedbackForm.get(
            'questions'
          ) as FormArray;

          response.questions.forEach((question: any) => {
            if (question.questionText.trim() !== '') {
              const newQuestionGroup = this.addQuestion();
              newQuestionGroup.patchValue({
                type: question.type,
                questionText: question.questionText,
                isMandatory: question.isMandatory,
                maxRating: question.maxRating
              });

              const optionsArray: any =
                newQuestionGroup.get('options')?.value || [];
              question.options?.forEach((option: any) => {
                if (option?.text) {
                  optionsArray.push(option.text);
                }
              });
              questionsArray.push(newQuestionGroup);
            }
          });
        }
      });
  }
}
