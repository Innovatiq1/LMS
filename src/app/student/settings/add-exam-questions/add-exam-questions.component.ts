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
import { Subscription, timer } from 'rxjs';
import * as XLSX from 'xlsx';
import { StudentsService } from 'app/admin/students/students.service';
import { SettingsService } from '@core/service/settings.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestPreviewComponent } from '@shared/components/test-preview/test-preview.component';
import { CommonService } from '@core/service/common.service';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';

@Component({
  selector: 'app-add-exam-questions',
  templateUrl: './add-exam-questions.component.html',
  styleUrls: ['./add-exam-questions.component.scss']
})
export class AddExamQuestionsComponent implements OnInit, OnDestroy {
  draftSubscription: Subscription | null = null;
  @Input() formType: string = '';
  @Input() approved: boolean = false;
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
  showDropdown = false;
  questionFormTab2: FormGroup;
  editUrl: any;
  questionId!: string;
  subscribeParams: any;
  studentId: any;
  dataSource: any;
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
  scoreAlgo: any;
  timerValues: any;
  draftId!: string;
  dialogStatus: boolean = false;
  showVideoAnalyzer: boolean = false;
  totalmarks=0;
  fileSizeDataAlgo: any;
  violation_list: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
  filteredQuestionTypes: any[] = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data11: any,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private studentsService: StudentsService,
    private SettingsService: SettingsService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private courseService: CourseService,
    @Optional() private dialogRef: MatDialogRef<AddExamQuestionsComponent>,
    private authenService: AuthenService,
  ) {
    if (data11) {
      this.dialogStatus = true;
    }
    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit-questions');

    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.questionId = params.id;
      }
    );

    const roleDetails = this.authenService.getRoleDetails()[0].settingsMenuItems
    const parentId = `student/settings/configuration`;
    const childId = "all-questions";

    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    this.showVideoAnalyzer = actions.some((item: any) => item.title == 'Proctoring' && item.checked);

    this.questionFormTab2 = this.formBuilder.group({
      name: ['', Validators.required],
      timer: [],
      retake: [],
      passingCriteria: ['', Validators.required],
      videoAnalyzerReq: [false, Validators.required],
      violoation_limit: [5, Validators.required],
      // scoreAlgorithm: [, [Validators.required, Validators.min(0.1)]],
      totalMarks: ['', Validators.required],
      allottedMarks: [{ value: '', disabled: true }],
      scoreAlgorithm: [''],
      fileSizeAlgorithm: [''],
      selectedQuestionType: [''],
      newQuestionText: [''],
      assessmentEvaluationType: ['', Validators.required],
      questions: this.formBuilder.array([]),
    });
    if (!this.editUrl) {
      // for (let index = 0; index < 5; index++) {
      //   const question = this.addQuestion();
      //   this.questions.push(question);
      // }
    } else {
      this.getData();
      this.getTimer()
      this.getRetakes()

    }
  }

  ngOnInit(): void {
    this.getAllPassingCriteria();
    this.getAllscoreAlgo();
    this.getAllTimesAlgo();
    this.getAllFileSizeAlgo();

    if (this.formType === 'Exam' || this.formType === 'Create') {
      this.startAutoSave();
    }
    if (!this.editUrl) {
      this.draftId = this.commonService.generate4DigitId();
    }
    this.questionFormTab2.get('selectedQuestionType')?.valueChanges.subscribe((value) => {
      if (value !== 'file') {
        this.questionFormTab2.get('fileSizeAlgorithm')?.setValue('');
      }
    });
    this.loadData()

    // this.questionFormTab2.get('selectedQuestionType')?.valueChanges.subscribe((value) => {
    //   if (value === 'file' && this.questionFormTab2.get('videoAnalyzerReq')?.value === true) {
    //     this.questionFormTab2.get('selectedQuestionType')?.setValue('');
    //   }
    // });
  
    // this.questionFormTab2.get('videoAnalyzerReq')?.valueChanges.subscribe((enabled: boolean) => {
    //   if (enabled) {
    //     // Remove 'file' from the options
    //     this.filteredQuestionTypes = this.questionTypes.filter(q => q.value !== 'file');
    //     if (this.questionFormTab2.get('selectedQuestionType')?.value === 'file') {
    //       this.questionFormTab2.get('selectedQuestionType')?.setValue('');
    //     }
    //   } else {
    //     this.filteredQuestionTypes = [...this.questionTypes];
    //   }
    // });
  
    // // Initialize filteredQuestionTypes on load
    // const isAnalyzerEnabled = this.questionFormTab2.get('videoAnalyzerReq')?.value;
    // this.filteredQuestionTypes = isAnalyzerEnabled
    //   ? this.questionTypes.filter(q => q.value !== 'file')
    //   : [...this.questionTypes];
    this.questionFormTab2.get('selectedQuestionType')?.valueChanges.subscribe((value) => {
      if (value !== 'file') {
        this.questionFormTab2.get('fileSizeAlgorithm')?.setValue('');
      }
    });
  
    // Subscribe to changes of both relevant controls
    this.questionFormTab2.get('videoAnalyzerReq')?.valueChanges.subscribe(() => {
      this.updateQuestionTypeOptions();
    });
  
    this.questionFormTab2.get('assessmentEvaluationType')?.valueChanges.subscribe(() => {
      this.updateQuestionTypeOptions();
    });
  
    this.questionFormTab2.get('selectedQuestionType')?.valueChanges.subscribe((value) => {
      const isVideoAnalyzerEnabled = this.questionFormTab2.get('videoAnalyzerReq')?.value;
      const isSystematicEval = this.questionFormTab2.get('assessmentEvaluationType')?.value === 'Systematic';
  
      if (value === 'file' && (isVideoAnalyzerEnabled || isSystematicEval)) {
        this.questionFormTab2.get('selectedQuestionType')?.setValue('');
      }
    });
  
    // Initial load
    this.updateQuestionTypeOptions();
  }

  updateQuestionTypeOptions(): void {
    const isVideoAnalyzerEnabled = this.questionFormTab2.get('videoAnalyzerReq')?.value;
    const isSystematicEval = this.questionFormTab2.get('assessmentEvaluationType')?.value === 'Systematic';
  
    if (isVideoAnalyzerEnabled || isSystematicEval) {
      this.filteredQuestionTypes = this.questionTypes.filter(q => q.value !== 'file');
      if (this.questionFormTab2.get('selectedQuestionType')?.value === 'file') {
        this.questionFormTab2.get('selectedQuestionType')?.setValue('');
      }
    } else {
      this.filteredQuestionTypes = [...this.questionTypes];
    }
  }
  
  startAutoSave() {
    setTimeout(() => {
      if (!this.draftSubscription) {
        this.draftSubscription = timer(0, 30000).subscribe(() => {
          // this.saveDraft();
        });
      }
    }, 30000);
  }
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  ngOnDestroy() {
    if (this.draftSubscription) {
      this.draftSubscription.unsubscribe(); // Unsubscribe to stop auto-save
      this.draftSubscription = null;
    }
  }
  saveDraft(data?: string) {
    const formValues = this.questionFormTab2.value;
    const isFormEmpty = !formValues.name &&
      !formValues.timer &&
      !formValues.retake &&
      !formValues.passingCriteria &&
      !formValues.scoreAlgorithm

    if (isFormEmpty && data) {
      // If the form is empty, do not make the API call
      Swal.fire({
        title: 'Warning',
        text: 'Please fill in at least one field to save as draft.',
        icon: 'warning',
      });
      return; // Exit the function early
    }

    if (!isFormEmpty) {
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      const payload = {
        draftId: this.draftId,
        name: this.questionFormTab2.value.name,
        timer: this.questionFormTab2.value.timer,
        retake: this.questionFormTab2.value.retake,
        passingCriteria: this.questionFormTab2.value.passingCriteria,
        scoreAlgorithm: this.questionFormTab2.value.scoreAlgorithm,
        videoAnalyzerReq: this.showVideoAnalyzer ? this.questionFormTab2.value.videoAnalyzerReq : false,
        violoation_limit: this.showVideoAnalyzer ? this.questionFormTab2.value.violoation_limit : null,
        status: 'draft',
        companyId: userId,
        questions: this.questionFormTab2.value.questions.map((v: any) => ({
          options: v.options,
          questionText: v.questionText,
        })),
      };
      this.questionService.createAnswerQuestion(payload).subscribe(
        (res: any) => {
          if (data) {
            Swal.fire({
              title: 'Successful',
              text: 'Exam Questions drafted successfully',
              icon: 'success',
            });
            window.history.back();
          }
        },
      );
    }
  }
  loadData() {
    this.studentId = localStorage.getItem('id')
    this.studentsService.getStudentById(this.studentId).subscribe(res => {
    })
  }
  getAllPassingCriteria() {
    this.SettingsService.getPassingCriteria().subscribe((response: any) => {
      this.dataSource = response.data.docs;
    })
  }
  getAllscoreAlgo() {
    this.SettingsService.getScoreAlgorithm().subscribe((response: any) => {
      this.scoreAlgo = response.data.docs;
    })
  }
  getAllFileSizeAlgo() {
    this.SettingsService.getFileSizeAlgorithm().subscribe((response: any) => {
      this.fileSizeDataAlgo = response.data.docs;
    })
  }
  getAllTimesAlgo() {
    this.SettingsService.getTimeAlgorithm().subscribe((response: any) => {
      this.timerValues = response.data.docs;
    })
  }
  getTimer(): any {
    this.configurationSubscription = this.studentsService.configuration$.subscribe(configuration => {
      this.configuration = configuration;
      const examTimerConfig = this.configuration.find((v: any) => v.field === 'examTimer')
      if (examTimerConfig) {
        this.defaultTimer = examTimerConfig.value;
        this.questionFormTab2.patchValue({
          timer: this.defaultTimer,
        })
      }
    });
  }

  getRetakes(): any {
    this.configurationSubscription = this.studentsService.configuration$.subscribe(configuration => {
      this.configuration = configuration;
      const config = this.configuration.find((v: any) => v.field === 'examAssessment')
      if (config) {
        this.defaultRetake = config.value;
        this.questionFormTab2.patchValue({
          retake: this.defaultRetake,
        })
      }
    });
  }
  getData() {
    if (this.questionId) {
      this.questionService.getAnswerQuestionById(this.questionId).subscribe((response: any) => {
          if (response && response.questions) {
            this.questionFormTab2.patchValue({
              name: response.name,
              totalMarks: response.totalMarks,
              passingCriteria: String(response?.passingCriteria),
              retake: String(response?.retake),
              scoreAlgorithm: response?.scoreAlgorithm,
              videoAnalyzerReq: response?.videoAnalyzerReq,
              violoation_limit: response?.violoation_limit,
              timer: response?.timer,
              assessmentEvaluationType: response?.assessmentEvaluationType,
            });

            // const questionsArray = this.questionFormTab2.get(
            //   'questions'
            // ) as FormArray;
            // while (questionsArray.length !== 0) {
            //   questionsArray.removeAt(0);
            // }

            // response.questions.forEach((question: any) => {
            //   if (question.questionText.trim() !== '') {
            //     const questionGP = this.addQuestion("xyz","hhh",1);
            //     questionGP.patchValue({
            //       questionText: question.questionText,
            //     });

            //     const optionsArray = questionGP.get('options') as FormArray;
            //     optionsArray.clear();
            //     question.options.forEach((option: any) => {
            //       optionsArray.push(
            //         this.formBuilder.group({
            //           text: option.text,
            //           correct: option.correct,
            //         })
            //       );
            //     });
            const questionsArray = this.questionFormTab2.get('questions') as FormArray;
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
                questionsArray.push(questionGP);
              }
            });
          }
        });
    }
  }

  
  // addQuestion(type: string, text: string, questionscore: any, fileSize?: any) {
  //   const questionGroup = this.formBuilder.group({
  //     questionType: [type, Validators.required],
  //     questionText: [text, Validators.required],
  //     questionscore: [questionscore, Validators.required],
  //     isSelected: [false],
  //     options: this.formBuilder.array([]),
  //     textAnswer: [''],
  //     textareaAnswer: [''],
  //     trueFalseAnswer: [null],
  //     numberAnswer: [''],
  //     fillBlankAnswer: [''],
  //     angularEditorAnswer: [''],
  //     fileSize: [fileSize || null],
  //     // fileAnswer: [null]
  //     fileAnswer: this.formBuilder.group({
  //       documentName: [''],
  //       uploadedFileName: [''],
  //       documentLink: ['']
  //     }),
  //   });

  //   if (type === 'mcq' || type === 'checkbox' || type === 'radio') {
  //     const optionsArray = questionGroup.get('options') as FormArray;
  //     for (let i = 0; i < 4; i++) {
  //       optionsArray.push(
  //         this.formBuilder.group({
  //           text: ['', Validators.required],
  //           correct: [false],
  //         })
  //       );
  //     }
  //   }
  //   return questionGroup;
  // }
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
      fileAnswer: this.formBuilder.group({
        documentName: [''],
        uploadedFileName: [''],
        documentLink: ['']
      }),
    });
  
    // Add validators dynamically based on type
    switch (type) {
      case 'text':
        questionGroup.get('textAnswer')?.setValidators([Validators.required]);
        break;
      case 'textarea':
        questionGroup.get('textareaAnswer')?.setValidators([Validators.required]);
        break;
      case 'number':
        questionGroup.get('numberAnswer')?.setValidators([Validators.required]);
        break;
      case 'fillBlanks':
        questionGroup.get('fillBlankAnswer')?.setValidators([Validators.required]);
        break;
      case 'trueFalse':
        questionGroup.get('trueFalseAnswer')?.setValidators([Validators.required]);
        break;
      case 'file':
        questionGroup.get('fileAnswer.documentName')?.setValidators([Validators.required]);
        break;
      case 'mcq':
      case 'radio':
        const optionsArray = questionGroup.get('options') as FormArray;
        for (let i = 0; i < 4; i++) {
          optionsArray.push(
            this.formBuilder.group({
              text: ['', Validators.required],
              correct: [false],
            })
          );
        }
        break;
    }
  
    return questionGroup;
  }
  

  // addAdditionalQuestion() {
  //   const question = this.addQuestion();
  //   this.questions.push(question);
  // }
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
    const selectedType = this.questionFormTab2.get('selectedQuestionType')?.value;
    const questionText = this.questionFormTab2.get('newQuestionText')?.value;
    const questionscore = this.questionFormTab2.get('scoreAlgorithm')?.value;
    const selectedFileSize = this.questionFormTab2.get('fileSizeAlgorithm')?.value;
    this.totalmarks = this.totalmarks + questionscore;
    const question = this.addQuestion(selectedType, questionText, questionscore, selectedFileSize);
    question.get('questionscore')?.valueChanges.subscribe(() => {
      this.calculateTotalMarks();
    });
    this.questions.push(question);
    this.questionFormTab2.patchValue({ newQuestionText: '' });
     this.calculateTotalMarks();
  }

  calculateTotalMarks() {
    this.totalmarks = this.questions.controls.reduce((sum, q) => {
      const score = q.get('questionscore')?.value || 0;
      return sum + Number(score);
    }, 0);
    this.questionFormTab2.get('allottedMarks')?.setValue(this.totalmarks);
  }

  onFileChoosed(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;
    // console.log("file",file)
    const question = this.questions.at(index);
    const allowedFileSizeMB = question.get('fileSize')?.value; 
    // console.log("allowedFileSizeMB",allowedFileSizeMB)
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
  getLastQuestionId() {
    const lastIndex = this.questions.controls.length - 1;
    return lastIndex > -1 ? this.questions.at(lastIndex).value.tempId : 0;
  }
  deleteSelectedQuestions(){}

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
    return this.questionFormTab2.get('questions') as FormArray;
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
          (this.questionFormTab2.get('questions') as FormArray)?.at(
            questionIndex
          ) as FormGroup
        )?.get('options') as FormArray
      ).at(index) as FormGroup;
      if (index != optionIndex && option.get('correct')) {
        option.patchValue({ correct: false });
      }
    }
  }

  save() {
    if (this.questionFormTab2.valid) {
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      const payload = {
        name: this.questionFormTab2.value.name,
        totalMarks: this.questionFormTab2.value.totalMarks,
        timer: this.questionFormTab2.value.timer,
        retake: this.questionFormTab2.value.retake,
        passingCriteria: this.questionFormTab2.value.passingCriteria,
        scoreAlgorithm: this.questionFormTab2.value.scoreAlgorithm,
        videoAnalyzerReq: this.showVideoAnalyzer ? this.questionFormTab2.value.videoAnalyzerReq : false,
        violoation_limit: this.showVideoAnalyzer ? this.questionFormTab2.value.violoation_limit : null,
        status: this.dialogStatus ? 'approved' : 'open',
        companyId: userId,
        assessmentEvaluationType: this.questionFormTab2.value.assessmentEvaluationType,
        // questions: this.questionFormTab2.value.questions.map((v: any) => ({
        //   options: v.options,
        //   questionText: v.questionText,
        // })),
        questions: this.questionFormTab2.value.questions.map((q: any) => ({
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
      // console.log("payload",payload)
      if (this.totalmarks != this.questionFormTab2.value.totalMarks) {
        // console.log("this.totalmarks",this.totalmarks)
        // console.log("this.questionFormTab3.value.totalMarks",this.questionFormTab3.value.totalMarks)
        Swal.fire('Allotted marks and total marks should be equal', 'error');
        return;
      }

      if (!payload.questions.length) {
        Swal.fire('At least one question is needed', 'error');
        return;
      }

      // const isNoAnswer = payload.questions.some(
      //   (q: any) => !q.options.some((c: any) => c.correct)
      // );
      const isNoAnswer = payload.questions.some(
        (q: any) =>
          q.questionType === 'mcq' || q.questionType === 'radio'
            ? !q.options.some((c: any) => c.correct)
            : false
      );
      if (isNoAnswer) {
        Swal.fire('Select at least one option is correct', 'error');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create Exam Assessment!',
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
        this.updateAssessmentAction(payload);
      }
    });
  }

  updateAssessmentAction(payload: any) {
    this.questionService.updateAnswerQuestions(payload).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Successful',
          text: 'Question Updated successfully',
          icon: 'success',
        });
        if (!this.approved) {
          window.history.back();
        }
      },
      (err: any) => {
        Swal.fire('Failed to update Question', 'error');
      }
    );
  }

  createAssesment(payload: any) {
    this.questionService.createAnswerQuestion(payload).subscribe(
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

  update() {
    if (this.questionFormTab2.valid) {
      if (this.editUrl) {
        this.updateExamAssessment();
      } else {
        this.save();
      }
    } else {
      this.questionFormTab2.markAllAsTouched();
    }
  }

  updateExamAssessment() {
    if (this.questionFormTab2.valid) {
      const formData = this.questionFormTab2.value;
      
      const isNoAnswer = formData.questions.some(
        (q: any) => !q.options.some((c: any) => c.correct)
      );
      // console.log("isNoAnswer",isNoAnswer)
      if (isNoAnswer) {
        Swal.fire('Select at least one option is correct', 'error');
        return;
      }
      const payload = { ...formData, id: this.questionId };
      if (!this.showVideoAnalyzer) {
        payload.videoAnalyzerReq = false;
        payload.violoation_limit = null;
      }
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.openPreviewModal(payload, true)
        }
      });
    }
  }

  approve() {
    const payload = {
      status: 'approved',
      id: this.questionId,
    }
    this.questionService.updateExamQuestions(payload).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Successful',
          text: 'Exam Assessment approved successfully',
          icon: 'success',
        });
        window.history.back();
      },
      (err: any) => {
        Swal.fire('Failed to update Question', 'error');
      }
    );
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];

  //   if (file && !this.isValidExcelFile(file)) {
  //     Swal.fire({
  //       title: 'Invalid File',
  //       text: 'Please select a valid Excel file with .xlsx or .xls extension.',
  //       icon: 'error',
  //     });
  //     return;
  //   }
  //   const reader: FileReader = new FileReader();

  //   reader.onload = (e: any) => {
  //     const data: string = e.target.result;
  //     const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });

  //     const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];

  //     const excelData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });
  //     this.processExcelData(excelData);
  //   };

  //   reader.readAsBinaryString(file);
  // }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (this.isValidExcelFile(file)) {
      this.readExcelFile(file);
    } 
    // else if (fileName.endsWith('.pdf')) {
    //   // console.log("fileName.endsWith('.pdf')",fileName.endsWith('.pdf'))
    //   this.readPdfFile(file);
    // }
     else if (fileName.endsWith('.docx')) {
      this.readDocxFile(file);
    }
    else {
      console.warn('Invalid file type. Please select an Excel or PDF file.');
    }
  }
  isValidExcelFile(file: File): boolean {
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    return allowedExtensions.some(ext => fileName.endsWith(ext));
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
  // processExcelData(data: any[]) {
  //   while (this.questions.length !== 0) {
  //     this.questions.removeAt(0);
  //   }

  //   data.forEach((row: any, index: number) => {
  //     const question = this.addQuestion("xyz","ggf",2);
  //     question.patchValue({
  //       questionText: row["Question Text"],
  //     });

  //     const optionsArray = question.get('options') as FormArray;
  //     while (optionsArray.length !== 0) {
  //       optionsArray.removeAt(0);
  //     }
  //     for (let i = 1; i <= 4; i++) {
  //       const optionText = row[`Option ${i} Text`];
  //       const optionCorrect = row[`Option ${i} Correct`];
  //       if (optionText.trim() !== '') {
  //         optionsArray.push(
  //           this.formBuilder.group({
  //             text: optionText,
  //             correct: optionCorrect,
  //           })
  //         );
  //       }
  //       if (optionText.trim() === '' || i === 4) {
  //         break;
  //       }
  //     }

  //     this.questions.push(question);
  //   });
  // }
}
