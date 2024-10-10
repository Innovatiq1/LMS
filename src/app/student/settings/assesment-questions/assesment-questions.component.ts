import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { QuestionService } from '@core/service/question.service';
import { number } from 'echarts';
import { Subscription, timer } from 'rxjs';
import { StudentsService } from 'app/admin/students/students.service';
import { SettingsService } from '@core/service/settings.service';
import * as XLSX from 'xlsx';
import { TestPreviewComponent } from '@shared/components/test-preview/test-preview.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '@core/service/common.service';

@Component({
  selector: 'app-assesment-questions',
  templateUrl: './assesment-questions.component.html',
  styleUrls: ['./assesment-questions.component.scss'],
})
export class AssesmentQuestionsComponent implements OnInit, OnDestroy{
  draftSubscription: Subscription | null = null;
  @Input() formType: string = '';
  @Input() approved: boolean = false;
  questionFormTab3: FormGroup;
  editUrl: any;
  questionId!: string;
  subscribeParams: any;
  studentId: any;
  dataSource:any;
  configuration: any;
  configurationSubscription!: Subscription;
  defaultTimer: string = '';
  defaultRetake: string = '';
  currencyCodes: string[] = [
    'USD',
    'SGD',
    'NZD',
    'YEN',
    'GBP',
    'KWN',
    'IDR',
    'TWD',
    'MYR',
    'AUD',
  ];
  retakeCodesAssessment: string[] = ['1', '2', '3', '4', '5'];
  timerValues:any;
scoreDataAlgo:any;
draftId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private studentsService: StudentsService,
    private SettingsService:SettingsService,
    private dialog: MatDialog,
    private commonService: CommonService
  ) {
    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit-questions');

    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.questionId = params.id;
      }
    );

    this.questionFormTab3 = this.formBuilder.group({
      name: ['', Validators.required],
      timer: [''],
      retake: [''],
      passingCriteria:['', Validators.required],
      scoreAlgorithm: [1, [Validators.required, Validators.min(0.1)]],
      resultAfterFeedback: [null, [Validators.required]],
      questions: this.formBuilder.array([]),
    });
    if (!this.editUrl) {
      for (let index = 0; index < 5; index++) {
        const question = this.addQuestion();
        this.questions.push(question);
      }
    } else {
      this.getData();
      this.getRetakes();
      this.getTimer();


    }
  }

  ngOnInit(): void {
    this.loadData();
    this.getAllPassingCriteria();
    this.getAllScoreAlgo();
    this.getAllTimeAlgo();
    if (this.formType === 'Assessment' || this.formType === 'Create') {
      this.startAutoSave();
    }
    if (!this.editUrl) {
      this.draftId = this.commonService.generate4DigitId();
    }
  }
  startAutoSave() {
    setTimeout(() => {
      if (!this.draftSubscription) {
        this.draftSubscription = timer(0, 30000).subscribe(() => {
          this.saveDraft();
        });
      }
    }, 30000); 
  }

  ngOnDestroy() {
    if (this.draftSubscription) {
      this.draftSubscription.unsubscribe(); // Unsubscribe to stop auto-save
      this.draftSubscription = null;
    }
  }

saveDraft(data?: string) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      const payload = {
        draftId: this.draftId,
        name: this.questionFormTab3.value.name,
        timer: this.questionFormTab3.value.timer,
        retake: this.questionFormTab3.value.retake,
        passingCriteria:this.questionFormTab3.value.passingCriteria,
        scoreAlgorithm: this.questionFormTab3.value.scoreAlgorithm,
        resultAfterFeedback: this.questionFormTab3.value.resultAfterFeedback,
        status: 'draft',
        companyId:userId,
        questions: this.questionFormTab3.value.questions.map((v: any) => ({
          options: v.options,
          questionText: v.questionText,
        })),
      };
      this.questionService.createQuestion(payload).subscribe(
              (res: any) => {
                if (data) {
                  Swal.fire({
                    title: 'Successful',
                    text: 'Assessment Questions drafted successfully',
                    icon: 'success',
                  });
                  window.history.back();
                }
              },
            );
  }
  loadData() {
    this.studentId = localStorage.getItem('id');
    this.studentsService.getStudentById(this.studentId).subscribe((res) => {});
  }

  getTimer(): any {
    this.configurationSubscription =
      this.studentsService.configuration$.subscribe((configuration) => {
        this.configuration = configuration;
      const config = this.configuration.find((v:any)=>v.field === 'timer')

        if (config) {
          this.defaultTimer = config.value;
          this.questionFormTab3.patchValue({
            timer: this.defaultTimer,
          });
        }
      });
  }
  getAllPassingCriteria(){
    this.SettingsService.getPassingCriteria().subscribe((response:any) =>{
      this.dataSource=response.data.docs;
    })
  }

  getAllScoreAlgo(){
    this.SettingsService.getScoreAlgorithm().subscribe((response:any) =>{
      this.scoreDataAlgo=response.data.docs;
    })
  }

  getAllTimeAlgo(){
    this.SettingsService.getTimeAlgorithm().subscribe((response:any) =>{
      this.timerValues=response.data.docs;
    })
  }

  getRetakes(): any {
    this.configurationSubscription =
      this.studentsService.configuration$.subscribe((configuration) => {
        this.configuration = configuration;
      const config = this.configuration.find((v:any)=>v.field === 'assessment')

        if (config) {
          this.defaultRetake = config.value;
          this.questionFormTab3.patchValue({
            retake: this.defaultRetake,
          });
        }
      });
  }
  getData() {
    if (this.questionId) {
      this.questionService
        .getQuestionsById(this.questionId)
        .subscribe((response: any) => {
          if (response && response.questions) {
            const passingCriteriaAsString = String(response?.passingCriteria);
            this.questionFormTab3.patchValue({
              name: response.name,
              scoreAlgorithm: response.scoreAlgorithm,
              resultAfterFeedback: response.resultAfterFeedback,
              passingCriteria:passingCriteriaAsString,
               retake:String(response.retake),
               timer:response?.timer,
            });

            const questionsArray = this.questionFormTab3.get(
              'questions'
            ) as FormArray;
            while (questionsArray.length !== 0) {
              questionsArray.removeAt(0);
            }

            response.questions.forEach((question: any) => {
              if (question.questionText.trim() !== '') {
                const questionGP = this.addQuestion();
                questionGP.patchValue({
                  questionText: question.questionText,
                });

                const optionsArray = questionGP.get('options') as FormArray;
                optionsArray.clear();
                question.options.forEach((option: any) => {
                  optionsArray.push(
                    this.formBuilder.group({
                      text: option.text,
                      correct: option.correct,
                    })
                  );
                });
                questionsArray.push(questionGP);
              }
            });
          }
        });
    }
  }

  addQuestion() {
    const newTempId = this.getLastQuestionId() + 1;
    const questionGroup = this.formBuilder.group({
      tempId: newTempId,
      questionText: ['', Validators.required],
      isSelected: [false],
      options: this.formBuilder.array([
        this.formBuilder.group({
          text: ['', Validators.required],
          correct: [false],
        }),
        this.formBuilder.group({
          text: ['', Validators.required],
          correct: [false],
        }),
        this.formBuilder.group({
          text: ['', Validators.required],
          correct: [false],
        }),
        this.formBuilder.group({
          text: ['', Validators.required],
          correct: [false],
        }),
      ]),
    });
    return questionGroup;
  }

  addAdditionalQuestion() {
    const question = this.addQuestion();
    this.questions.push(question);
  }

  getLastQuestionId() {
    const lastIndex = this.questions.controls.length - 1;
    return lastIndex > -1 ? this.questions.at(lastIndex).value.tempId : 0;
  }

  deleteQuestion(questionIndex: number) {
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
        const controls = (this.questions as FormArray).controls;
        const filteredQuestions: number[] = [];
        controls.forEach((control: any, index: number) => {
          if (control.value.isSelected) {
            filteredQuestions.push(control.value.tempId);
          }
        });
        if (filteredQuestions.length) {
          filteredQuestions.forEach((tempId: number) => {
            const index = this.questions.controls.findIndex(
              (c: any) => c.value.tempId === tempId
            );
            if (index != -1) {
              this.questions.removeAt(index);
            }
          });
        } else {
          this.questions.removeAt(questionIndex);
        }
        Swal.fire({
          title: 'Deleted!',
          text: 'Deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  get questions(): FormArray {
    return this.questionFormTab3.get('questions') as FormArray;
  }

  getAnswers(questionIndex: number) {
    return (this.questions.at(questionIndex) as FormGroup).get(
      'options'
    ) as FormArray;
  }

  addAnswer(questionIndex: number) {
    const answer = this.formBuilder.group({
      text: ['', Validators.required],
      correct: [false, Validators.required],
    });
    this.getAnswers(questionIndex).push(answer);
  }

  checkboxChange(questionIndex: number, optionIndex: number): void {
    for (let index = 0; index < 4; index++) {
      const option = (
        (
          (this.questionFormTab3.get('questions') as FormArray)?.at(
            questionIndex
          ) as FormGroup
        )?.get('options') as FormArray
      ).at(index) as FormGroup;
      if (index != optionIndex && option.get('correct')) {
        option.patchValue({ correct: false });
      }
    }
  }

  update() {
    if (this.questionFormTab3.valid) {
      if (this.editUrl) {
        
        this.updateAssesment();
      } else {
        
        this.save();
      }
    } else {
      this.questionFormTab3.markAllAsTouched();
    }
  }

  save() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    
        if (this.questionFormTab3.valid) {
      const payload = {
        name: this.questionFormTab3.value.name,
        timer: this.questionFormTab3.value.timer,
        retake: this.questionFormTab3.value.retake,
        passingCriteria:this.questionFormTab3.value.passingCriteria,
        scoreAlgorithm: this.questionFormTab3.value.scoreAlgorithm,
        resultAfterFeedback: this.questionFormTab3.value.resultAfterFeedback,
        status: 'open',
        companyId:userId,
        questions: this.questionFormTab3.value.questions.map((v: any) => ({
          options: v.options,
          questionText: v.questionText,
        })),
      };

      if (!payload.questions.length) {
        Swal.fire('At least one question is needed', 'error');
        return;
      }

      const isNoAnswer = payload.questions.some(
        (q: any) => !q.options.some((c: any) => c.correct)
      );
      if (isNoAnswer) {
        Swal.fire('Select at least one option is correct', 'error');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create Assessment!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.openPreviewModal(payload);
        }
      });
    } else {
      Swal.fire('Please fill all mandatory fields', 'error');
    }
  }

  openPreviewModal(payload: any, isEdit: boolean = false) {
    const dialogRef = this.dialog.open(TestPreviewComponent, {
      width: '600px',
      data: payload,
    });
    dialogRef.afterClosed().subscribe(() => {
      if (!isEdit) {
        this.createAssesment(payload);
      } else {
        this.updateAssementAction(payload);
      }
    });
  }

  updateAssementAction(payload: any) {
    this.questionService.updateQuestions(payload).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Successful',
          text: 'Question Updated successfully',
          icon: 'success',
        });
          window.history.back();
      },
      (err: any) => {
        Swal.fire('Failed to update Question', 'error');
      }
    );
  }

  updateAssesment() {
    if (this.questionFormTab3.valid) {
      const formData = this.questionFormTab3.value;
      const isNoAnswer = formData.questions.some(
        (q: any) => !q.options.some((c: any) => c.correct)
      );
      if (isNoAnswer) {
        Swal.fire('Select at least one option is correct', 'error');
        return;
      }

      const payload = { ...formData, id: this.questionId };
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.openPreviewModal(payload, true);
        }
      });
    }
  }

  createAssesment(payload: any) {
    this.questionService.createQuestion(payload).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Successful',
          text: 'Question created successfully',
          icon: 'success',
        });
        window.history.back();
      },
      (err: any) => {
        Swal.fire('Failed to create Question', 'error');
      }
    );
  }

  approve() {
    const payload = {
      status: 'approved',
      id: this.questionId,
    };
    this.questionService.updateQuestions(payload).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Successful',
          text: 'Assessment approved successfully',
          icon: 'success',
        });
        window.history.back();
      },
      (err: any) => {
        Swal.fire('Failed to update Question', 'error');
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && !this.isValidExcelFile(file)) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please select a valid Excel file with .xlsx or .xls extension.',
        icon: 'error',
      });
      return;
    }
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });

      const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];

      const excelData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
      });
      this.processExcelData(excelData);
    };

    reader.readAsBinaryString(file);
  }

  isValidExcelFile(file: File): boolean {
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    return allowedExtensions.some((ext) => fileName.endsWith(ext));
  }

  processExcelData(data: any[]) {
    while (this.questions.length !== 0) {
      this.questions.removeAt(0);
    }

    data.forEach((row: any, index: number) => {
      const question = this.addQuestion();
      question.patchValue({
        questionText: row['Question Text'],
      });

      const optionsArray = question.get('options') as FormArray;
      while (optionsArray.length !== 0) {
        optionsArray.removeAt(0);
      }
      for (let i = 1; i <= 4; i++) {
        const optionText = row[`Option ${i} Text`];
        const optionCorrect = row[`Option ${i} Correct`];
        if (optionText.trim() !== '') {
          optionsArray.push(
            this.formBuilder.group({
              text: optionText,
              correct: optionCorrect,
            })
          );
        }
        if (optionText.trim() === '' || i === 4) {
          break;
        }
      }

      this.questions.push(question);
    });
  }
}
