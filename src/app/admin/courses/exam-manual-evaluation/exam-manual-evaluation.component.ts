import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { QuestionService } from '@core/service/question.service';
import { AssessmentService } from '@core/service/assessment.service';
import { Any } from '@tensorflow/tfjs';
import { StudentsService } from 'app/admin/students/students.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { SettingsService } from '@core/service/settings.service';
@Component({
  selector: 'app-exam-manual-evaluation',
  templateUrl: './exam-manual-evaluation.component.html',
  styleUrls: ['./exam-manual-evaluation.component.scss'],
})
export class ExamManualEvaluationComponent {
  rowData: any;
  rowId: string = '';
  response: any;
  getAssessmentCorrectAns: any;
  getAssessmentAnswer: any;
  // combinedAnswers: any[] = [];
  savedAnswers: any[] = [];
  originalAnswers: any[] = [];
  isEdit: boolean = false;
  assessmentAnswerId: any;
  dataSourse: any;
  // constructor(private route: ActivatedRoute,private courseService: CourseService,private questionService: QuestionService,) {}
  breadscrums: any[] = [];
  manualReEvaluationDataId: any;

  courseId: any;
  examAssAnsId: any;
  examFirstAssAnsId: any;
  examQuestionId: any;
  examsTrainerQuestionsAnswer: any; 
    evaluationStatus:boolean = false
  examsStudentAnswers: any;
  combinedAnswers: any[] = [];
  showGrade: boolean = false;
  assessmentAnswer: any;

  actualScore: number = 0;
  currentPercentage: number = 0;
  totalScore: number = 0;
  gradeDataset: any = [];
  gradeInfo: any = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private questionService: QuestionService,
    private quesAssessmentService: AssessmentService,
    private studentService: StudentsService,
    private SettingService: SettingsService
  ) {
    const storedItems = localStorage.getItem('activeBreadcrumb');
    if (storedItems) {
      const cleanedItem = storedItems.replace(/^"(.*)"$/, '$1');
      this.breadscrums = [
        {
          title: 'Blank',
          items: [cleanedItem],
          active: 'Manual Evaluation',
        },
      ];
    }
  }

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe(params => {
  //     console.log("params", params);
  //     this.courseId = params['courseId'];
  //     this.examAssAnsId = params['examAssAnsId'];
  //     this.examFirstAssAnsId = params['examFirstAssAnsId'];
  //     this.examQuestionId = params['examQuestionId'];
  //     this.isEdit = params['isEdit'] === 'true';
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.courseId = params['courseId'];
      this.examAssAnsId = params['examAssAnsId'];
      this.examFirstAssAnsId = params['examFirstAssAnsId'];
      this.examQuestionId = params['examQuestionId'];
      this.isEdit = params['isEdit'] === 'true';

      forkJoin([
        this.questionService.getAnswerQuestionById(this.examQuestionId),
        this.quesAssessmentService.getAnswerById(this.examAssAnsId),
      ]).subscribe(
        ([questionResponse, answerResponse]: any) => {
          this.examsTrainerQuestionsAnswer = questionResponse?.questions || [];
          this.assessmentAnswer = answerResponse?.assessmentAnswer;
          this.examsStudentAnswers =
            answerResponse?.assessmentAnswer?.answers || [];

          this.combineAnswers();

          if (this.isEdit) {
            this.getEvaluatedDataByAssessmentId(this.examAssAnsId);
          }
        },
        (error) => {
          console.error('Error in loading questions or answers:', error);
        }
      );
    });
    this.getExamQuestionsAnswer();
  }
  getExamQuestions() {
    this.questionService
      .getAnswerQuestionById(this.examQuestionId)
      .subscribe((response: any) => {
        this.examsTrainerQuestionsAnswer = response?.questions;
        this.tryCombineAnswers();
      });
  }

  getExamQuestionsAnswer() {
    this.quesAssessmentService
      .getAnswerById(this.examAssAnsId)
      .subscribe((response: any) => { 

        this.assessmentAnswer = response?.assessmentAnswer;
        this.examsStudentAnswers = response?.assessmentAnswer?.answers;
         

          if(response.assessmentAnswer.evaluationStatus.toLowerCase() == "completed"){
        this.evaluationStatus = true
      }else{ 
        this.evaluationStatus = false
      }
        this.actualScore = response.assessmentAnswer.score;
        this.totalScore = response.assessmentAnswer.totalScore;  

      
        this.GradeCalculate();

        this.tryCombineAnswers();
        // console.log("quesAssessmentAns",response)
      });
  }
  getFirstExamQuestionsAnswer() {
    this.quesAssessmentService
      .getAnswerById(this.examFirstAssAnsId)
      .subscribe((response: any) => {
        this.tryCombineAnswers();
      });
  }
  tryCombineAnswers() {
    // if (this.examsTrainerQuestionsAnswer?.questions && this.examsStudentAnswers?.answers) {
    this.combineAnswers();
    // }
  }
  combineAnswers() {
    const trainerQuestions = this.examsTrainerQuestionsAnswer || [];
    const studentAnswers = this.examsStudentAnswers || [];
    this.combinedAnswers = trainerQuestions.map((question: any) => {
      const studentAnswer = studentAnswers.find(
        (ans: any) => ans.questionText === question.questionText
      );

      // Determine correct answer
      let correctAnswerText = '';
      let correctFileLink = '';
      let correctFileName = '';

      if (question?.fileAnswer?.length) {
        correctFileLink = question.fileAnswer[0]?.documentLink || '';
        correctFileName =
          question.fileAnswer[0]?.uploadedFileName || 'Correct File';
      } else {
        switch (question.questionType) {
          case 'mcq':
          case 'radio':
            const correctOption = question.options?.find(
              (opt: any) => opt.correct
            );
            correctAnswerText = correctOption?.text || '';
            break;
          case 'text':
            correctAnswerText = question.textAnswer;
            break;
          case 'textarea':
            correctAnswerText = question.textareaAnswer;
            break;
          case 'fillBlanks':
            correctAnswerText = question.fillBlankAnswer;
            break;
          case 'number':
            correctAnswerText = question.numberAnswer;
            break;
          case 'trueFalse':
            correctAnswerText = question.trueFalseAnswer ? 'True' : 'False';
            break;
        }
      }

      // Student answer details
      let studentAnswerText =
        studentAnswer?.selectedOptionText || 'Not Answered';
      let studentFileLink = '';
      let studentFileName = '';

      if (studentAnswer?.fileAnswer?.length) {
        studentFileLink = studentAnswer.fileAnswer[0]?.documentLink || '';
        studentFileName =
          studentAnswer.fileAnswer[0]?.uploadedFileName || 'Student File';
      }

      return {
        questionText: question.questionText,
        questionType: question.questionType,
        correctAnswer: correctAnswerText,
        correctFileLink,
        correctFileName,

        studentAnswer: studentAnswerText,
        studentFileLink,
        studentFileName,

        questionscore: question?.questionscore || 0,
        assignedMarks: 0,
        remarks: '',
      };
    });

    // console.log('Combined answers:', this.combinedAnswers);
  }

  saveAnswers() {
    const totalAssignedMarks = this.combinedAnswers.reduce(
      (total, answer) => total + Number(answer.assignedMarks || 0),
      0
    );
    const totalScore1 = this.combinedAnswers.reduce(
      (total, answer) => total + Number(answer.questionscore || 0),
      0
    );
    if (totalAssignedMarks > totalScore1) {
      Swal.fire({
        title: 'Error!',
        text: 'Manually entered marks is more than the total marks.',
        icon: 'error',
      });
      return;
    }

    let id = this.assessmentAnswer?._id;
    this.savedAnswers = this.combinedAnswers.map((answer) => ({
      questionText: answer.questionText,
      questionType: answer.questionType,
      studentAnswer: answer.studentAnswer,
      correctAnswer: answer.correctAnswer,
      questionscore: answer.questionscore,
      assignedMarks: answer.assignedMarks,
      correctionStatus: answer.correctionStatus,
      remarks: answer.remarks,
    }));
    // const score = this.savedAnswers.reduce((total, answer) => total + Number(answer.assignedMarks || 0), 0);
    const score = Math.round(
      this.savedAnswers.reduce(
        (total, answer) => total + Number(answer.assignedMarks || 0),
        0
      )
    );
    const totalScore = this.savedAnswers.reduce(
      (total, answer) => total + Number(answer.questionscore || 0),
      0
    );
    const payload = {
      answers: this.assessmentAnswer?.answers,
      assessmentAnswerId: this.assessmentAnswer?.assessmentAnswerId,
      assessmentEvaluationType: this.assessmentAnswer?.assessmentEvaluationType,
      companyId: this.assessmentAnswer?.companyId,
      courseId: this.assessmentAnswer?.courseId,
      evaluationStatus: 'Completed',
      examAssessmentId: this.assessmentAnswer?.examAssessmentId?.id,
      isSubmitted: this.assessmentAnswer?.isSubmitted,
      score: score,
      studentClassId: this.assessmentAnswer?.studentClassId,
      studentId: this.assessmentAnswer?.studentId,
      studentView: this.assessmentAnswer?.studentView,
      totalScore: totalScore,
    };

    const payload1 = {
      manuallyCorrected_Answers: this.savedAnswers,
      assessmentEvaluationType:
        this.response?.assessmentAnswer?.assessmentEvaluationType,
      score: score,
      examAssessmentId: this.assessmentAnswer?.examAssessmentId?.id,
      examAssessmentAnswerId: id,
      companyId: this.assessmentAnswer?.companyId,
      courseId: this.assessmentAnswer?.courseId,
      studentId: this.assessmentAnswer?.studentId,
      totalScore: totalScore,
      evaluationStatus: 'completed',
    };

    if (!this.isEdit) {
      this.studentService.submitManualAssessmentAnswer(payload1).subscribe(
        (response: any) => {
          Swal.fire({
            title: 'Submitted!',
            text: 'Your Evaluated marks were submitted.',
            icon: 'success',
          }).then(() => {
            // this.updateAssessmentAnswer(assesmentId, payload1);
            this.quesAssessmentService
              .manualScoreUpdate(id, payload)
              .subscribe((response) => {
                // console.log("resole",response)
              });
            window.history.back();
          });
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    } else {
      this.studentService
        .updateManualAssessmentAnswerById(
          this.manualReEvaluationDataId,
          payload1
        )
        .subscribe((response) => {
          Swal.fire({
            title: 'Submitted!',
            text: 'Your Evaluated marks were Updated Successfully.',
            icon: 'success',
          }).then(() => {
            // this.updateAssessmentAnswer(assesmentId, payload1);
            this.quesAssessmentService
              .manualScoreUpdate(id, payload)
              .subscribe((response) => {
                // console.log("resole",response)
              });
            window.history.back();
          });
        });
    }
  }

  LiveUpdatedGrade() {  


   
      this.evaluationStatus = true 

        if(this.actualScore == null || this.totalScore == null){ 
           this.evaluationStatus = false
        }
    const TotalassignMart = this.combinedAnswers.reduce(
      (acc, curr) => acc + curr.assignedMarks,
      0
    );
    let calculatePercent = (TotalassignMart / this.totalScore) * 100;
    if (calculatePercent <= 100) {
      this.currentPercentage = Number.isNaN(calculatePercent)
        ? 0
        : Number(calculatePercent.toFixed(2));
      let count = 0;
      for (let i = 0; i < this.gradeDataset.length; i++) {
        const max = this.gradeDataset[i].PercentageRange.split('-')[0];
        const min = this.gradeDataset[i].PercentageRange.split('-')[1];
        if (calculatePercent >= max && calculatePercent <= min) {
          this.gradeInfo = this.gradeDataset[i];
          break;
        }
        count += 1;
      }
      if (count === this.gradeDataset.length) {
        const sorted = this.gradeDataset.sort((a: any, b: any) => {
          const numA = parseInt(a.PercentageRange.split('-')[0]);
          const numB = parseInt(b.PercentageRange.split('-')[0]);
          return numA - numB;
        });
        this.gradeInfo = sorted[0];
      }
    }
  }

  hasInvalidMarks(): boolean {
    return this.combinedAnswers.some(
      (item: any) => item.assignedMarks > item.questionscore
    );
  }

  getEvaluatedDataByAssessmentId(id: any) {
    this.studentService.getManualExamAssessmentAnswerById(id).subscribe(
      (response: any) => {
        // console.log("getManualAssessmentAnswerById",response)
        this.dataSourse = response.data;
        this.manualReEvaluationDataId = response?.data[0]?._id;
        if (this.combinedAnswers.length > 0) {
          this.patchEvaluatedData();
        }
        if (this.isEdit) {
          this.patchEvaluatedData();
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  patchEvaluatedData() {
    const evaluatedAnswers =
      this.dataSourse[0]?.manuallyCorrected_Answers || [];

    this.combinedAnswers = this.combinedAnswers.map((item) => {
      const matched = evaluatedAnswers.find(
        (evalItem: any) => evalItem.questionText === item.questionText
      );

      if (matched) {
        return {
          ...item,
          assignedMarks: matched.assignedMarks,
          remarks: matched.remarks,
        };
      }

      return item;
    });

    // console.log("Patched Combined Answers:", this.combinedAnswers);
  }

  cancelChanges() {
    this.combinedAnswers = JSON.parse(JSON.stringify(this.originalAnswers));
    window.history.back();
  }

  GradeCalculate() {
    let calculatePercent = (this.actualScore / this.totalScore) * 100;
    this.currentPercentage = Number.isNaN(calculatePercent)
      ? 0
      : Number(calculatePercent.toFixed(2));

    const getCompanyId: any = localStorage.getItem('userLogs');
    const parseid = JSON.parse(getCompanyId);
    this.SettingService.gradeFetch(parseid.companyId).subscribe({
      next: (res: any) => {
        if (res.response != null) {
          if (res.response!.gradeList!.length != 0) {
            this.gradeDataset = [];
            this.gradeDataset.push(...res.response!.gradeList);
            let count = 0;
            for (let i = 0; i < this.gradeDataset.length; i++) {
              const max = this.gradeDataset[i].PercentageRange.split('-')[0];
              const min = this.gradeDataset[i].PercentageRange.split('-')[1];
              if (calculatePercent >= max && calculatePercent <= min) {
                this.gradeInfo = this.gradeDataset[i];
                break;
              }
              count += 1;
            }
            console.log(count, this.gradeDataset.length);
            if (count === this.gradeDataset.length) {
              const sorted = this.gradeDataset.sort((a: any, b: any) => {
                const numA = parseInt(a.PercentageRange.split('-')[0]);
                const numB = parseInt(b.PercentageRange.split('-')[0]);
                return numA - numB;
              });
              this.gradeInfo = sorted[0];
            }
            this.showGrade = true;
          } else {
            this.showGrade = false;
          }
        }
      },
      error: (err) => {},
    });
  }
}
