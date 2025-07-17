import { Component, Input, OnDestroy, OnInit, Inject, Optional } from '@angular/core';
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
import { CourseService } from '@core/service/course.service';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { TestPreviewComponent } from '@shared/components/test-preview/test-preview.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '@core/service/common.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Component({
  selector: 'app-assesment-questions',
  templateUrl: './assesment-questions.component.html',
  styleUrls: ['./assesment-questions.component.scss'],
})
export class AssesmentQuestionsComponent implements OnInit, OnDestroy {
  draftSubscription: Subscription | null = null;
  @Input() formType: string = '';
  @Input() approved: boolean = false;
  questionFormTab3: FormGroup;
  editUrl: any;
  questionId!: string;
  subscribeParams: any;
  studentId: any;
  dataSource: any;
  configuration: any;
  configurationSubscription!: Subscription;
  defaultTimer: string = '';
  defaultRetake: string = '';
  dialogStatus: boolean = false;
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
  timerValues: any;
  scoreDataAlgo: any;
  fileSizeDataAlgo: any;
  draftId!: string;
  thumbnail: any;
  totalmarks: number = 0;
  filteredQuestionTypes: any[] = [];
  questionTypes = [
    { label: 'Multiple Choice Questions (MCQ)', value: 'mcq' },
    { label: 'One-Word Answer', value: 'text' },
    { label: 'Text Area (Descriptive)', value: 'textarea' },
    { label: 'Fill in the Blanks', value: 'fillBlanks' },
    { label: 'True/False', value: 'trueFalse' },
    { label: 'single-choice questions', value: 'radio' },
    { label: 'Number Input', value: 'number' },
    // { label: 'Rich Text Editor Question', value: 'angularEditor' },
    { label: 'File Upload', value: 'file' }
  ];
  // selectedQuestionType = ''; // Default selection
  //   newQuestionText = '';
  showDropdown = false;


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '0',
    placeholder: 'Enter answer...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [],
    uploadUrl: 'your-api-endpoint',
    customClasses: [],
    sanitize: false,
  };



  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data11: any,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private studentsService: StudentsService,
    private SettingsService: SettingsService,
    private courseService: CourseService,
    private dialog: MatDialog,
    private commonService: CommonService,
    @Optional() private dialogRef: MatDialogRef<AssesmentQuestionsComponent>
  ) {
    if (data11) {
      this.dialogStatus = true;
      // console.log("Received variable:", data11.variable);
    }
    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit-questions');

    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.questionId = params.id;
      }
    );

    this.questionFormTab3 = this.formBuilder.group({
      name: ['', Validators.required],
      totalMarks: ['', Validators.required],
      allottedMarks: [{ value: '', disabled: true }],
      timer: [''],
      retake: [''],
      passingCriteria: ['', Validators.required],
      // scoreAlgorithm: [, [Validators.required, Validators.min(0.1)]],
      scoreAlgorithm: [''],
      fileSizeAlgorithm: [''],
      resultAfterFeedback: [null, [Validators.required]],
      selectedQuestionType: [''],
      newQuestionText: [''],
      assessmentEvaluationType: ['', Validators.required],
      questions: this.formBuilder.array([]),
    });

    if (!this.editUrl) {
      // for (let index = 0; index < 1; index++) {
      //   const question = this.addQuestion(this.selectedQuestionType, this.newQuestionText);
      //   this.questions.push(question);
      // }
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
    this.getAllFileSizeAlgo();
    this.getAllTimeAlgo();
    // this.startAutoSave();
    if (!this.editUrl) {
      this.draftId = this.commonService.generate4DigitId();
    }
    // this.questionFormTab3.get('selectedQuestionType')?.valueChanges.subscribe((value) => {
    //   if (value !== 'file') {
    //     this.questionFormTab3.get('fileSizeAlgorithm')?.setValue('');
    //   }
    // });
      // Filter initially based on the default value of assessmentEvaluationType
  this.updateQuestionTypeOptions();

  // Listen to evaluation type change
  this.questionFormTab3.get('assessmentEvaluationType')?.valueChanges.subscribe(() => {
    this.updateQuestionTypeOptions();
  });

  // Clear fileSizeAlgorithm if not file
  this.questionFormTab3.get('selectedQuestionType')?.valueChanges.subscribe((value) => {
    if (value !== 'file') {
      this.questionFormTab3.get('fileSizeAlgorithm')?.setValue('');
    }

    // Prevent selection of 'file' when Systematic is selected
    const isSystematic = this.questionFormTab3.get('assessmentEvaluationType')?.value === 'Systematic';
    if (value === 'file' && isSystematic) {
      this.questionFormTab3.get('selectedQuestionType')?.setValue('');
    }
  });
  }
  updateQuestionTypeOptions(): void {
    const isSystematic = this.questionFormTab3.get('assessmentEvaluationType')?.value === 'Systematic';
  
    if (isSystematic) {
      this.filteredQuestionTypes = this.questionTypes.filter(q => q.value !== 'file');
      if (this.questionFormTab3.get('selectedQuestionType')?.value === 'file') {
        this.questionFormTab3.get('selectedQuestionType')?.setValue('');
      }
    } else {
      this.filteredQuestionTypes = [...this.questionTypes];
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
      this.draftSubscription.unsubscribe();
      this.draftSubscription = null;
    }
  }
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  saveDraft(data?: string) {
    // Get form values
    const formValues = this.questionFormTab3.value;
    const isFormEmpty = !formValues.name &&
      !formValues.timer &&
      !formValues.retake &&
      !formValues.passingCriteria &&
      !formValues.scoreAlgorithm &&
      !formValues.resultAfterFeedback

    if (isFormEmpty && data) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill in at least one field to save as draft.',
        icon: 'warning',
      });
      return;
    }

    if (!isFormEmpty) {

      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      const payload = {
        draftId: this.draftId,
        name: formValues.name,
        timer: formValues.timer,
        retake: formValues.retake,
        passingCriteria: formValues.passingCriteria,
        scoreAlgorithm: formValues.scoreAlgorithm,
        resultAfterFeedback: formValues.resultAfterFeedback,
        status: 'draft',
        companyId: userId,
        questions: formValues.questions.map((v: any) => ({
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
  }


  loadData() {
    this.studentId = localStorage.getItem('id');
    this.studentsService.getStudentById(this.studentId).subscribe((res) => { });
  }

  getTimer(): any {
    this.configurationSubscription =
      this.studentsService.configuration$.subscribe((configuration) => {
        this.configuration = configuration;
        const config = this.configuration.find((v: any) => v.field === 'timer')

        if (config) {
          this.defaultTimer = config.value;
          this.questionFormTab3.patchValue({
            timer: this.defaultTimer,
          });
        }
      });
  }
  getAllPassingCriteria() {
    this.SettingsService.getPassingCriteria().subscribe((response: any) => {
      this.dataSource = response.data.docs;
    })
  }

  getAllScoreAlgo() {
    this.SettingsService.getScoreAlgorithm().subscribe((response: any) => {
      this.scoreDataAlgo = response.data.docs;
    })
  }
  getAllFileSizeAlgo() {
    this.SettingsService.getFileSizeAlgorithm().subscribe((response: any) => {
      this.fileSizeDataAlgo = response.data.docs;
    })
  }
  getAllTimeAlgo() {
    this.SettingsService.getTimeAlgorithm().subscribe((response: any) => {
      this.timerValues = response.data.docs;
    })
  }

  getRetakes(): any {
    this.configurationSubscription =
      this.studentsService.configuration$.subscribe((configuration) => {
        this.configuration = configuration;
        const config = this.configuration.find((v: any) => v.field === 'assessment')

        if (config) {
          this.defaultRetake = config.value;
          this.questionFormTab3.patchValue({
            retake: this.defaultRetake,
          });
        }
      });
  }
  // getData() {
  //   if (this.questionId) {
  //     this.questionService
  //       .getQuestionsById(this.questionId)
  //       .subscribe((response: any) => {
  //         console.log("heloo ",response)
  //         if (response && response.questions) {
  //           const passingCriteriaAsString = String(response?.passingCriteria);
  //           this.questionFormTab3.patchValue({
  //             name: response.name,
  //             scoreAlgorithm: response.scoreAlgorithm,
  //             resultAfterFeedback: response.resultAfterFeedback,
  //             passingCriteria: passingCriteriaAsString,
  //             retake: String(response.retake),
  //             timer: response?.timer,
  //           });

  //           const questionsArray = this.questionFormTab3.get(
  //             'questions'
  //           ) as FormArray;
  //           while (questionsArray.length !== 0) {
  //             questionsArray.removeAt(0);
  //           }

  //           response.questions.forEach((question: any) => {
  //             if (question.questionText.trim() !== '') {
  //               // const questionGP = this.addQuestion(this.selectedQuestionType, this.newQuestionText);
  //               const questionGP = this.addQuestion('xyz', 'xyz');
  //               questionGP.patchValue({
  //                 questionText: question.questionText,
  //               });

  //               const optionsArray = questionGP.get('options') as FormArray;
  //               optionsArray.clear();
  //               question.options.forEach((option: any) => {
  //                 optionsArray.push(
  //                   this.formBuilder.group({
  //                     text: option.text,
  //                     correct: option.correct,
  //                   })
  //                 );
  //               });
  //               questionsArray.push(questionGP);
  //             }
  //           });
  //         }
  //       });
  //   }
  // }

  getData() {
    if (this.questionId) {
      this.questionService.getQuestionsById(this.questionId).subscribe((response: any) => {
        // console.log("Response:", response);
        if (response && response.questions) {
          const passingCriteriaAsString = String(response?.passingCriteria);
          this.questionFormTab3.patchValue({
            name: response.name,
            totalMarks: response.totalMarks,
            scoreAlgorithm: response.scoreAlgorithm,
            resultAfterFeedback: response.resultAfterFeedback,
            passingCriteria: passingCriteriaAsString,
            retake: String(response.retake),
            timer: response?.timer,
            assessmentEvaluationType: response?.assessmentEvaluationType,
          });

          const questionsArray = this.questionFormTab3.get('questions') as FormArray;
          questionsArray.clear();

          response.questions.forEach((question: any) => {
            if (question.questionText.trim() !== '') {
              const questionGP = this.addQuestion(question.questionType, question.questionText, 1);
              questionGP.patchValue({
                questionText: question.questionText,
                textAnswer: question.textAnswer || '',
                questionscore: question.questionscore || '',
                textareaAnswer: question.textareaAnswer || '',
                trueFalseAnswer: question.trueFalseAnswer !== null ? question.trueFalseAnswer : null,
                numberAnswer: question.numberAnswer || '',
                fillBlankAnswer: question.fillBlankAnswer || '',

              });

              // Patch options for MCQ, Checkbox, and Radio
              if (['mcq', 'radio', 'checkbox'].includes(question.questionType)) {
                const optionsArray = questionGP.get('options') as FormArray;
                optionsArray.clear();

                question.options.forEach((option: any) => {
                  optionsArray.push(this.formBuilder.group({
                    text: option.text,
                    correct: option.correct
                  }));
                });
              }

              if (question.questionType === 'file' && question.fileAnswer) {
                // console.log("questionsArr",question.fileAnswer.documentName)
                questionGP.patchValue({
                  fileAnswer: {
                    documentName: question.fileAnswer[0].documentName,
                    uploadedFileName: question.fileAnswer[0].uploadedFileName,
                    documentLink: question.fileAnswer[0].documentLink
                  }
                });
              }
              // console.log("questionGP",questionGP)

              questionsArray.push(questionGP);
            }
          });
        }
      });
    }
  }



  addQuestion(type: string, text: string, questionscore: any, fileSize?: any) {
    const questionGroup = this.formBuilder.group({
      questionType: [type, Validators.required],
      questionText: [text, Validators.required],
      questionscore: [questionscore, Validators.required],
      isSelected: [false],
      options: this.formBuilder.array([]),
      textAnswer: [''],
      textareaAnswer: [''],
      trueFalseAnswer: [null],
      numberAnswer: [''],
      fillBlankAnswer: [''],
      angularEditorAnswer: [''],
      fileSize: [fileSize || null],
      // fileAnswer: [null]
      fileAnswer: this.formBuilder.group({
        documentName: [''],
        uploadedFileName: [''],
        documentLink: ['']
      }),
    });

    if (type === 'mcq' || type === 'checkbox' || type === 'radio') {
      const optionsArray = questionGroup.get('options') as FormArray;
      for (let i = 0; i < 4; i++) {
        optionsArray.push(
          this.formBuilder.group({
            text: ['', Validators.required],
            correct: [false],
          })
        );
      }
    }
    return questionGroup;
  }

  getSelectedRadioOption(questionIndex: number): number | null {
    const optionsArray = this.getAnswers(questionIndex);
    return optionsArray.controls.findIndex(opt => opt.get('correct')?.value === true);
  }

  updateRadioSelection(questionIndex: number, selectedIndex: number) {
    const optionsArray = this.getAnswers(questionIndex);
    optionsArray.controls.forEach((option, i) => {
      option.get('correct')?.setValue(i === selectedIndex);
    });
  }


  addAdditionalQuestion() {
    const selectedType = this.questionFormTab3.get('selectedQuestionType')?.value;
    const questionText = this.questionFormTab3.get('newQuestionText')?.value;
    const questionscore = this.questionFormTab3.get('scoreAlgorithm')?.value;
    const selectedFileSize = this.questionFormTab3.get('fileSizeAlgorithm')?.value;
    this.totalmarks = this.totalmarks + questionscore;
    const question = this.addQuestion(selectedType, questionText, questionscore, selectedFileSize);
    question.get('questionscore')?.valueChanges.subscribe(() => {
      this.calculateTotalMarks();
    });
    this.questions.push(question);
    this.questionFormTab3.patchValue({ newQuestionText: '' });
    this.calculateTotalMarks();
  }

  calculateTotalMarks() {
    this.totalmarks = this.questions.controls.reduce((sum, q) => {
      const score = q.get('questionscore')?.value || 0;
      return sum + Number(score);
    }, 0);
    this.questionFormTab3.get('allottedMarks')?.setValue(this.totalmarks);
  }

  get questions(): FormArray {
    return this.questionFormTab3.get('questions') as FormArray;
  }


  getLastQuestionId() {
    const lastIndex = this.questions.controls.length - 1;
    return lastIndex > -1 ? this.questions.at(lastIndex).value.tempId : 0;
  }


  hasSelectedQuestions(): boolean {
    return this.questions.controls.some(control => control.get('isSelected')?.value);
  }

  deleteSelectedQuestions() {
    Swal.fire({
      title: 'Confirm Bulk Deletion',
      text: 'Are you sure you want to delete the selected questions?',
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
            filteredQuestions.push(index);
          }
        });

        if (filteredQuestions.length) {
          filteredQuestions.sort((a, b) => b - a); // remove from last
          filteredQuestions.forEach((index: number) => {
            const score = this.questions.at(index).get('questionscore')?.value || 0;
            this.totalmarks -= score;
            this.questions.removeAt(index);
          });

          this.calculateTotalMarks();

          Swal.fire({
            title: 'Deleted!',
            text: 'Selected questions have been deleted.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  }



  deleteQuestion(questionIndex: number) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this question?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const score = this.questions.at(questionIndex).get('questionscore')?.value || 0;
        this.totalmarks -= score;
        this.questions.removeAt(questionIndex);

        this.calculateTotalMarks();

        Swal.fire({
          title: 'Deleted!',
          text: 'Question deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }
    });
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

  onFileChoosed(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    const question = this.questions.at(index);
    const allowedFileSizeMB = question.get('fileSize')?.value; // per-question fileSize

    if (!allowedFileSizeMB) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing File Size Limit',
        text: 'Please specify a file size limit before uploading.',
      });
      event.target.value = '';
      return;
    }

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > allowedFileSizeMB) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: `This file exceeds the allowed size of ${allowedFileSizeMB} MB. Please choose a smaller file.`,
      });
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('files', file);

    this.courseService.uploadDocument(formData).subscribe({
      next: (res: any) => {
        // console.log('Upload success:', res);

        const { documentLink, documentName, uploadedFileName } = res.data || {};

        this.questions.at(index).patchValue({
          fileAnswer: {
            documentLink,
            documentName,
            uploadedFileName
          }
        });

        // console.log('File patched at index', index, this.questions.at(index).value);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Upload failed',
          text: 'Something went wrong while uploading the file.',
        });
      }
    });
  }


  // save() {
  //   let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;

  //   if (this.questionFormTab3.valid) {
  //     const payload = {
  //       name: this.questionFormTab3.value.name,
  //       timer: this.questionFormTab3.value.timer,
  //       retake: this.questionFormTab3.value.retake,
  //       passingCriteria: this.questionFormTab3.value.passingCriteria,
  //       scoreAlgorithm: this.questionFormTab3.value.scoreAlgorithm,
  //       resultAfterFeedback: this.questionFormTab3.value.resultAfterFeedback,
  //       status: this.dialogStatus ? 'approved' : 'open',
  //       companyId: userId,
  //       questions: this.questionFormTab3.value.questions.map((v: any) => ({
  //         options: v.options,
  //         questionText: v.questionText,
  //       })),
  //     };

  //     console.log("payload", payload)

  //     if (!payload.questions.length) {
  //       Swal.fire('At least one question is needed', 'error');
  //       return;
  //     }

  //     const isNoAnswer = payload.questions.some(
  //       (q: any) => !q.options.some((c: any) => c.correct)
  //     );
  //     if (isNoAnswer) {
  //       Swal.fire('Select at least one option is correct', 'error');
  //       return;
  //     }

  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: 'Do you want to create Assessment!',
  //       icon: 'warning',
  //       confirmButtonText: 'Yes',
  //       showCancelButton: true,
  //       cancelButtonColor: '#d33',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.openPreviewModal(payload);
  //       }
  //     });
  //   } else {
  //     Swal.fire('Please fill all mandatory fields', 'error');
  //   }
  // }
  save() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    // console.log("this.questionFormTab3",this.questionFormTab3)

    if (this.questionFormTab3.valid) {
      const payload = {
        name: this.questionFormTab3.value.name,
        totalMarks: this.questionFormTab3.value.totalMarks,
        timer: this.questionFormTab3.value.timer,
        retake: this.questionFormTab3.value.retake,
        passingCriteria: this.questionFormTab3.value.passingCriteria,
        scoreAlgorithm: this.questionFormTab3.value.scoreAlgorithm,
        resultAfterFeedback: this.questionFormTab3.value.resultAfterFeedback,
        assessmentEvaluationType: this.questionFormTab3.value.assessmentEvaluationType,
        status: this.dialogStatus ? 'approved' : 'open',
        companyId: userId,
        questions: this.questionFormTab3.value.questions.map((q: any) => ({
          questionType: q.questionType,
          questionText: q.questionText,
          questionscore: q.questionscore,
          options: q.options || [],
          textAnswer: q.textAnswer || '',
          textareaAnswer: q.textareaAnswer || '',
          trueFalseAnswer: q.trueFalseAnswer || null,
          numberAnswer: q.numberAnswer || '',
          fillBlankAnswer: q.fillBlankAnswer || '',
          // fileAnswer:q.fileAnswer||null,
          fileAnswer: q.questionType === 'file' ? q.fileAnswer : null,
          fileSize: q.questionType === 'file' ? q.fileSize : null,
        })),
      };

      // console.log("payload", payload);
      if (this.totalmarks != this.questionFormTab3.value.totalMarks) {
        // console.log("this.totalmarks",this.totalmarks)
        // console.log("this.questionFormTab3.value.totalMarks",this.questionFormTab3.value.totalMarks)
        Swal.fire('Allotted marks and total marks should be equal', 'error');
        return;
      }

      if (!payload.questions.length) {
        Swal.fire('At least one question is needed', 'error');
        return;
      }

      const isNoAnswer = payload.questions.some(
        (q: any) =>
          q.questionType === 'mcq' || q.questionType === 'radio'
            ? !q.options.some((c: any) => c.correct)
            : false
      );

      if (isNoAnswer) {
        Swal.fire('Select at least one option as correct', 'error');
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
        if (this.dialogRef) {
          this.dialogRef.close();
        }
        if (!this.dialogStatus) {
          window.history.back();
        }
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (this.isValidExcelFile(file)) {
      this.readExcelFile(file);
    } else if (fileName.endsWith('.pdf')) {
      // console.log("fileName.endsWith('.pdf')",fileName.endsWith('.pdf'))
      this.readPdfFile(file);
    } else if (fileName.endsWith('.docx')) {
      this.readDocxFile(file);
    }
    else {
      console.warn('Invalid file type. Please select an Excel or PDF file.');
    }
  }

  isValidExcelFile(file: File): boolean {
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    return allowedExtensions.some((ext) => fileName.endsWith(ext));
  }


  readExcelFile(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const arrayBuffer: ArrayBuffer = e.target.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = Array.from(data).map(byte => String.fromCharCode(byte));
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // console.log('Parsed Excel Data:', jsonData);
      this.processExcelData(jsonData);
    };
    fileReader.readAsArrayBuffer(file);
  }

  processExcelData(data: any[]) {
    while (this.questions.length !== 0) {
      this.questions.removeAt(0);
    }
    this.totalmarks = 0;

    data.forEach((row: any, index: number) => {
      const questionType = (row['Type'] || 'mcq').toLowerCase();
      const questionText = row['Question'] || '';
      const score = row['Score'] || 1;
      this.totalmarks += score;
      this.calculateTotalMarks();
      const questionFormGroup = this.addQuestion(questionType, questionText, score);
      questionFormGroup.patchValue({ questionText });

      if (['mcq', 'radio'].includes(questionType)) {
        const optionsArray = questionFormGroup.get('options') as FormArray;
        while (optionsArray.length !== 0) {
          optionsArray.removeAt(0);
        }

        for (let i = 1; i <= 4; i++) {
          const optionText = row[`Option ${i} Text`] || '';
          const optionCorrect = row[`Option ${i} Correct`] === true;

          if (optionText.trim() !== '') {
            optionsArray.push(this.formBuilder.group({
              text: optionText,
              correct: optionCorrect
            }));
          }
        }
      }

      if (questionType === 'text') {
        questionFormGroup.patchValue({ textAnswer: row['Answer'] || '' });
      } else if (questionType === 'textarea') {
        questionFormGroup.patchValue({ textareaAnswer: row['Answer'] || '' });
      } else if (questionType === 'fillBlanks') {
        questionFormGroup.patchValue({ fillBlankAnswer: row['Answer'] || '' });
      }
      // else if (questionType === 'trueFalse') {
      //   questionFormGroup.patchValue({ trueFalseAnswer: row['Answer'] === 'true'|| });
      // } 
      else if (questionType === 'number') {
        questionFormGroup.patchValue({ numberAnswer: row['Answer'] || null });
      } else if (questionType === 'angularEditor') {
        questionFormGroup.patchValue({ angularEditorAnswer: row['Answer'] || '' });
      }

      questionFormGroup.get('questionscore')?.valueChanges.subscribe(() => {
        this.calculateTotalMarks();
      });

      this.questions.push(questionFormGroup);
    });
  }

  readPdfFile(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = async (e: any) => {
      const typedarray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => (item as any).str).join(' ');
        fullText += pageText + ' ';
      }

      // console.log("Raw extracted text:", fullText);
      const parsedData = this.parsePdfTextToJson(fullText);
      // console.log('Parsed PDF Data:', parsedData);
      this.processExcelData(parsedData);
    };

    fileReader.readAsArrayBuffer(file);
  }

  readDocxFile(file: File): void {
    const reader = new FileReader();

    reader.onload = async (event: any) => {
      const arrayBuffer = event.target.result;
      const mammoth = await import('mammoth');
      // console.log("mammoth",mammoth)

      mammoth.extractRawText({ arrayBuffer }).then(result => {
        const plainText = result.value;
        // console.log("Extracted DOCX Text with line breaks preserved:", plainText);

        const parsedData = this.parseDocxTextToJson(plainText);
        // console.log("Parsed DOCX Data:", parsedData);
        this.processExcelData(parsedData);
      });
    };

    reader.readAsArrayBuffer(file);
  }

  parsePdfTextToJson(text: string): any[] {
    const cleanedText = text.replace(/\s+/g, ' ').trim();

    const questionRegex = /(What|Which|Who|How|When)[^?]+\?[^A-Za-z0-9]+(mcq|text|textarea|radio)\s+(\d+)\s+([^]+?)(?=(What|Which|Who|How|When|$))/gi;

    const questions = [];
    let match;

    while ((match = questionRegex.exec(cleanedText)) !== null) {
      const questionText = match[0].match(/^(What|Which|Who|How|When)[^?]+\?/i)?.[0] || '';
      const type = match[2].toLowerCase();
      const score = parseInt(match[3], 10);
      const rest = match[4].trim().split(/\s+/);

      const result: any = {
        Question: questionText.trim(),
        Type: type,
        Score: score
      };

      const options = [];
      let i = 0;
      let optionIndex = 1;
      let foundAnswer = false;

      while (i < rest.length) {
        if (rest[i].toLowerCase() === 'answer') {
          result['Answer'] = rest[i + 1];
          foundAnswer = true;
          break;
        }

        result[`Option ${optionIndex} Text`] = rest[i];
        result[`Option ${optionIndex} Correct`] = rest[i + 1]?.toLowerCase() === 'true';
        optionIndex++;
        i += 2;
      }

      if (!foundAnswer) {
        result['Answer'] = rest[rest.length - 1];
      }

      questions.push(result);
    }

    return questions;
  }


  parseDocxTextToJson(text: string): any[] {
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line =>
        line.length > 0 &&
        line.toLowerCase() !== 'question' &&
        line.toLowerCase() !== 'type' &&
        line.toLowerCase() !== 'score' &&
        !line.toLowerCase().startsWith('option') &&
        line.toLowerCase() !== 'answer'
      );

    const questions = [];
    const LINES_PER_QUESTION = 12;

    for (let i = 0; i + LINES_PER_QUESTION - 1 < lines.length; i += LINES_PER_QUESTION) {
      const result: any = {
        Question: lines[i],
        Type: lines[i + 1],
        Score: parseInt(lines[i + 2], 10),
        'Option 1 Text': lines[i + 3],
        'Option 1 Correct': lines[i + 4].toLowerCase() === 'true',
        'Option 2 Text': lines[i + 5],
        'Option 2 Correct': lines[i + 6].toLowerCase() === 'true',
        'Option 3 Text': lines[i + 7],
        'Option 3 Correct': lines[i + 8].toLowerCase() === 'true',
        'Option 4 Text': lines[i + 9],
        'Option 4 Correct': lines[i + 10].toLowerCase() === 'true',
        Answer: lines[i + 11]
      };

      questions.push(result);
    }

    return questions;
  }



}
