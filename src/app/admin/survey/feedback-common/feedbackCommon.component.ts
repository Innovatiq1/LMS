import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feedbackcommon',
  templateUrl: './feedbackCommon.component.html',
  styleUrls: ['./feedbackCommon.component.scss'],
})
export class FeedbackCommonComponent implements OnChanges {
  @Input() feedbackInfo: any;
  @Input() isPreview: boolean = false;
  @Input() answer: boolean = false;
  @Input() col: number = 1;
  @Input() showSkip: boolean = false;
  @Output() submitAnswers: EventEmitter<any> = new EventEmitter<any>();
  @Output() skip: EventEmitter<any> = new EventEmitter<any>();
  questionsList: any = [];
  constructor(private formBuilder: FormBuilder) {
    this.questionsList = this.getQuestions();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['feedbackInfo'] && changes?.['feedbackInfo'].currentValue) {
      this.questionsList = this.getQuestions();
    }
  }

  getQuestions() {
    return (
      this.feedbackInfo?.questions?.map((question: any) => ({
        ...question,
        answer: this.answer ? question.answer: null,
      })) || []
    );
  }

  handleRatingInput(event: any, question: any, index: number) {
    const value = event;
    this.questionsList[index].answer=value
  }
  handleDatePickerInput(event: any, question: any, index: number) {
    const value = event.value;
    this.questionsList[index].answer=value
  }

  confirmSubmit(){
    const isUnanswered = this.questionsList.some((v:any)=> v.isMandatory && (v.answer==null || v.answer==undefined))
    if(isUnanswered){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please answer all mandatory Questions!',
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create Feedback!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedOptions = this.questionsList.map((v:any)=>{
          return {
            questionText: v.questionText,
            selectedOption: v.answer
          }
        })
        const payload = {
          selectedOptions,
          surveyId: this.feedbackInfo?.id
        }
        this.submitAnswers.next(payload);
      }
    });
  }

  skipCallback(){
    this.skip.next(false);
  }
}
