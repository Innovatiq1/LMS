import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { QuestionService } from '@core/service/question.service';
import { AssessmentService } from '@core/service/assessment.service';
import { Any } from '@tensorflow/tfjs';
import { StudentsService } from 'app/admin/students/students.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-exam-manual-evaluation',
  templateUrl: './exam-manual-evaluation.component.html',
  styleUrls: ['./exam-manual-evaluation.component.scss']
})
export class ExamManualEvaluationComponent {
  rowData: any;
  rowId: string = '';
  response:any;
  getAssessmentCorrectAns:any;
  getAssessmentAnswer:any;
  // combinedAnswers: any[] = [];
  savedAnswers: any[] = [];
  originalAnswers: any[] = []; 
  isEdit:boolean=false;
  assessmentAnswerId:any;
  dataSourse:any;
  // constructor(private route: ActivatedRoute,private courseService: CourseService,private questionService: QuestionService,) {}
  breadscrums: any[] = [];
  manualReEvaluationDataId:any;

  courseId:any;
  examAssAnsId:any;
  examFirstAssAnsId:any;
  examQuestionId:any;
  examsTrainerQuestionsAnswer:any;
  examsStudentAnswers:any;
  combinedAnswers: any[] = [];
  assessmentAnswer:any;




  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private questionService: QuestionService,
    private quesAssessmentService:AssessmentService,
    private studentService: StudentsService,
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

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       console.log("params",params);
//       this.courseId = params['courseId'];
//       this.examAssAnsId=params['examAssAnsId'];
//       this.examFirstAssAnsId=params['examFirstAssAnsId'];
//       this.examQuestionId=params['examQuestionId']
//       this.isEdit = params['isEdit'] === 'true';
//     });
// console.log("this.courseId",this.courseId)
// console.log("this.examAssAnsId",this.examAssAnsId)
// console.log("this.examFirstAssAnsId",this.examFirstAssAnsId)
// console.log("this.examQuestionId",this.examQuestionId)
// console.log("this.isEdit",this.isEdit)

// if(this.isEdit)
// {
//   this.combineAnswers()
//   this.getEvaluatedDataByAssessmentId(this.examAssAnsId)
// }

//     // this.getCategories(this.rowId)

//   this.getExamQuestions();
//   this.getExamQuestionsAnswer();
//   this.getFirstExamQuestionsAnswer();
//   }

ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    console.log("params", params);
    this.courseId = params['courseId'];
    this.examAssAnsId = params['examAssAnsId'];
    this.examFirstAssAnsId = params['examFirstAssAnsId'];
    this.examQuestionId = params['examQuestionId'];
    this.isEdit = params['isEdit'] === 'true';

    // Make parallel API calls using forkJoin
    forkJoin([
      this.questionService.getAnswerQuestionById(this.examQuestionId),
      this.quesAssessmentService.getAnswerById(this.examAssAnsId)
    ]).subscribe(
      ([questionResponse, answerResponse]: any) => {
        this.examsTrainerQuestionsAnswer = questionResponse?.questions || [];
        this.assessmentAnswer = answerResponse?.assessmentAnswer;
        this.examsStudentAnswers = answerResponse?.assessmentAnswer?.answers || [];

        this.combineAnswers(); // Combine both answers into `combinedAnswers`

        if (this.isEdit) {
          this.getEvaluatedDataByAssessmentId(this.examAssAnsId); // Patch if edit mode
        }
      },
      error => {
        console.error('Error in loading questions or answers:', error);
      }
    );

    // Optional: load initial breadcrumb
    // const storedItems = localStorage.getItem('activeBreadcrumb');
    // if (storedItems) {
    //   const cleanedItem = storedItems.replace(/^"(.*)"$/, '$1');
    //   this.breadscrums = [
    //     {
    //       title: 'Blank',
    //       items: [cleanedItem],
    //       active: 'Manual Evaluation',
    //     },
    //   ];
    // }
  });
}
getExamQuestions(){
  this.questionService.getAnswerQuestionById(this.examQuestionId).subscribe((response: any) => {
    this.examsTrainerQuestionsAnswer=response?.questions;
    this.tryCombineAnswers();
    // console.log("responsequestions",response);

  })
}

getExamQuestionsAnswer(){
  this.quesAssessmentService.getAnswerById(this.examAssAnsId).subscribe((response:any)=>{
    this.assessmentAnswer=response?.assessmentAnswer;
    this.examsStudentAnswers=response?.assessmentAnswer?.answers;
    this.tryCombineAnswers();
// console.log("quesAssessmentAns",response)
  })
}
getFirstExamQuestionsAnswer(){
  this.quesAssessmentService.getAnswerById(this.examFirstAssAnsId).subscribe((response:any)=>{
    this.tryCombineAnswers();
    // console.log("quesAFirstssessmentAns",response)
  })
}


tryCombineAnswers() {
  // if (this.examsTrainerQuestionsAnswer?.questions && this.examsStudentAnswers?.answers) {
    this.combineAnswers();
  // }
}





combineAnswers() {
  const trainerQuestions = this.examsTrainerQuestionsAnswer || [];
  const studentAnswers = this.examsStudentAnswers|| [];
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
      correctFileName = question.fileAnswer[0]?.uploadedFileName || 'Correct File';
    } else {
      switch (question.questionType) {
        case 'mcq':
        case 'radio':
          const correctOption = question.options?.find((opt: any) => opt.correct);
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
    let studentAnswerText = studentAnswer?.selectedOptionText || 'Not Answered';
    let studentFileLink = '';
    let studentFileName = '';

    if (studentAnswer?.fileAnswer?.length) {
      studentFileLink = studentAnswer.fileAnswer[0]?.documentLink || '';
      studentFileName = studentAnswer.fileAnswer[0]?.uploadedFileName || 'Student File';
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
      remarks: ''
    };
  });

  // console.log('Combined answers:', this.combinedAnswers);
}


saveAnswers(){
let id=this.assessmentAnswer?._id;
  this.savedAnswers = this.combinedAnswers.map(answer => ({
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
    this.savedAnswers.reduce((total, answer) => total + Number(answer.assignedMarks || 0), 0)
  );
  const totalScore = this.savedAnswers.reduce((total, answer) => total + Number(answer.questionscore || 0), 0);
  const payload={
    answers:this.assessmentAnswer?.answers,
    assessmentAnswerId:this.assessmentAnswer?.assessmentAnswerId,
    assessmentEvaluationType:this.assessmentAnswer?.assessmentEvaluationType,
    companyId:this.assessmentAnswer?.companyId,
    courseId:this.assessmentAnswer?.courseId,
    evaluationStatus:"Completed",
    examAssessmentId:this.assessmentAnswer?.examAssessmentId?.id,
    isSubmitted:this.assessmentAnswer?.isSubmitted,
    score:score,
    studentClassId:this.assessmentAnswer?.studentClassId,
    studentId:this.assessmentAnswer?.studentId,
    studentView:this.assessmentAnswer?.studentView,
    totalScore:totalScore

  }

    const payload1={
    manuallyCorrected_Answers:this.savedAnswers,
    assessmentEvaluationType:this.response?.assessmentAnswer?.assessmentEvaluationType,
    score:score,
    examAssessmentId:this.assessmentAnswer?.examAssessmentId?.id,
    examAssessmentAnswerId:id,
  companyId:this.assessmentAnswer?.companyId,
  courseId:this.assessmentAnswer?.courseId,
  studentId:this.assessmentAnswer?.studentId,
  totalScore:totalScore,
  evaluationStatus:"completed",
  }

   if(!this.isEdit)
  {
  this.studentService.submitManualAssessmentAnswer(payload1).subscribe(
    (response: any) => {
      Swal.fire({
        title: 'Submitted!',
        text: 'Your Evaluated marks were submitted.',
        icon: 'success',
      }).then(() => {
        // this.updateAssessmentAnswer(assesmentId, payload1);
          this.quesAssessmentService.manualScoreUpdate(id,payload).subscribe((response)=>{
          // console.log("resole",response)
          })
        window.history.back(); 
      });

    },
    (error: any) => {
      console.error('Error:', error);
    }
  );
}
else{
  this.studentService.updateManualAssessmentAnswerById(this.manualReEvaluationDataId,payload1).subscribe((response)=>{

    Swal.fire({
      title: 'Submitted!',
      text: 'Your Evaluated marks were Updated Successfully.',
      icon: 'success',
    }).then(() => {
      // this.updateAssessmentAnswer(assesmentId, payload1);
      this.quesAssessmentService.manualScoreUpdate(id,payload).subscribe((response)=>{
        // console.log("resole",response)
        })
      window.history.back();
    });
  })
}

  // console.log("payloaddd",payload)
}








//   getCategories(id: string): void {

//     this.getCategoryByID(id);
//   }
//   getCategoryByID(id: string) {
//      this.courseService.getStudentClassById(id).subscribe((response: any) => {
//       // this.classDataById = response?._id;
//       this.response = response;
//       this.getAssessmentAnswer=response?.assessmentAnswer?.answers;
//       this.assessmentAnswerId=response?.assessmentAnswer?._id;


//       // if(this.isEdit){
//       //   this.getEvaluatedDataByAssessmentId(this.assessmentAnswerId);
//       // }
//       this.getAssessment(response?.assessmentAnswer?.assessmentId)

//     });
//   }

//   getAssessment(questionId: any) {
//     this.questionService.getQuestionsById(questionId).subscribe((response: any) => {
//       this.getAssessmentCorrectAns = response?.questions;

//       if (this.getAssessmentCorrectAns && this.getAssessmentAnswer) {
//         this.combineAnswers();

//         if (this.isEdit) {
//           this.getEvaluatedDataByAssessmentId(this.assessmentAnswerId);
//         }
//       }
//     });
//   }

// combineAnswers() {
//   this.combinedAnswers = this.getAssessmentCorrectAns.map((question: any) => {
//     const studentAnswer = this.getAssessmentAnswer.find((ans: any) =>
//       ans.questionText === question.questionText || question.questionText === null
//     );
//     let correctAnswerText = '';
//     let correctFileLink = '';
//     let correctFileName = '';

//     if (question.fileAnswer?.length) {
//       correctFileName = question.fileAnswer[0].uploadedFileName;
//       correctFileLink = question.fileAnswer[0].documentLink;
//     } else {
//       if (question.questionType === 'mcq' || question.questionType === 'radio') {
//         const correctOption = question.options.find((opt: any) => opt.correct);
//         correctAnswerText = correctOption?.text || '';
//       } else if (question.questionType === 'text') {
//         correctAnswerText = question.textAnswer;
//       } else if (question.questionType === 'textarea') {
//         correctAnswerText = question.textareaAnswer;
//       } else if (question.questionType === 'number') {
//         correctAnswerText = question.numberAnswer;
//       } else if (question.questionType === 'fillBlanks') {
//         correctAnswerText = question.fillBlankAnswer;
//       } else if (question.questionType === 'trueFalse') {
//         correctAnswerText = question.trueFalseAnswer ? 'True' : 'False';
//       }
//     }

//     let studentAnswerText = studentAnswer?.selectedOptionText || 'Not Answered';
//     let studentFileLink = '';
//     let studentFileName = '';

//     if (studentAnswer?.fileAnswer?.length) {
//       studentFileName = studentAnswer.fileAnswer[0].uploadedFileName;
//       studentFileLink = studentAnswer.fileAnswer[0].documentLink;
//     }

//     return {
//       questionText: question.questionText,
//       questionType: question.questionType,
//       studentAnswer: studentAnswerText,
//       studentFileLink,
//       studentFileName,
//       correctAnswer: correctAnswerText,
//       correctFileLink,
//       correctFileName,
//       questionscore: question?.questionscore || 0,
//       assignedMarks: 0,
//       remarks: ''
//     };
//   });

//   this.originalAnswers = JSON.parse(JSON.stringify(this.combinedAnswers));
// }

hasInvalidMarks(): boolean {
  return this.combinedAnswers.some(
    (item: any) => item.assignedMarks > item.questionscore
  );
}


// saveAnswers() {
//   this.savedAnswers = this.combinedAnswers.map(answer => ({
//     questionText: answer.questionText,
//     questionType: answer.questionType,
//     studentAnswer: answer.studentAnswer,
//     correctAnswer: answer.correctAnswer,
//     questionscore: answer.questionscore,
//     assignedMarks: answer.assignedMarks,
//     correctionStatus: answer.correctionStatus,
//     remarks: answer.remarks,
//   }));
//   // const score = this.savedAnswers.reduce((total, answer) => total + Number(answer.assignedMarks || 0), 0);
//   const score = Math.round(
//     this.savedAnswers.reduce((total, answer) => total + Number(answer.assignedMarks || 0), 0)
//   );
//   const totalScore = this.savedAnswers.reduce((total, answer) => total + Number(answer.questionscore || 0), 0);
//   const assesmentId=this.response?.assessmentAnswer?._id;
//   const payload={
//     manuallyCorrected_Answers:this.savedAnswers,
//     assessmentEvaluationType:this.response?.assessmentAnswer?.assessmentEvaluationType,
//     score:score,
//   assessmentId:this.response?.assessmentAnswer?.assessmentId,
//   companyId:this.response?.assessmentAnswer?.companyId,
//   courseId:this.response?.assessmentAnswer?.courseId,
//   is_tutorial:this.response?.assessmentAnswer?.is_tutorial,
//   studentId:this.response?.assessmentAnswer?.studentId,
//   totalScore:totalScore,
//   assessmentanswersId:this.response?.assessmentAnswer?._id,
//   evaluationStatus:"completed",

//   }
//   const payload1={
//     answers:this.response?.assessmentAnswer?.answers,
//     assessmentEvaluationType:this.response?.assessmentAnswer?.assessmentEvaluationType,
//     assessmentId:this.response?.assessmentAnswer?.assessmentId,
//     companyId:this.response?.assessmentAnswer?.companyId,
//     courseId:this.response?.assessmentAnswer?.courseId,
//     evaluationStatus:"completed",
//     is_course_completed:this.response?.assessmentAnswer?.is_course_completed,
//     is_exam_completed:this.response?.assessmentAnswer?.is_exam_completed,
//     is_tutorial:this.response?.assessmentAnswer?.is_tutorial,
//     score:score,
//   studentId:this.response?.assessmentAnswer?.studentId,
//   totalScore:totalScore,
//   }
//   if(!this.isEdit)
//   {
//   this.studentService.submitManualAssessmentAnswer(payload).subscribe(
//     (response: any) => {
//       // Swal.fire({
//       //   title: 'Submitted!',
//       //   text: 'Your Evaluated marks were submitted.',
//       //   icon: 'success',
//       // });
//       // this.updateAssessmentAnswer(assesmentId,payload1)
//       Swal.fire({
//         title: 'Submitted!',
//         text: 'Your Evaluated marks were submitted.',
//         icon: 'success',
//       }).then(() => {
//         // this.updateAssessmentAnswer(assesmentId, payload1);
//         window.history.back(); 
//       });

//     },
//     (error: any) => {
//       console.error('Error:', error);
//     }
//   );
// }
// else{
//   this.studentService.updateManualAssessmentAnswerById(this.manualReEvaluationDataId,payload).subscribe((response)=>{
//     // Swal.fire({
//     //   title: 'Submitted!',
//     //   text: 'Your Evaluated marks were Updated Successfully.',
//     //   icon: 'success',
//     // });
//     // this.updateAssessmentAnswer(assesmentId,payload1)
//     Swal.fire({
//       title: 'Submitted!',
//       text: 'Your Evaluated marks were Updated Successfully.',
//       icon: 'success',
//     }).then(() => {
//       // this.updateAssessmentAnswer(assesmentId, payload1);
//       window.history.back();
//     });
//   })
// }
// }



// updateAssessmentAnswer(id:any,payload:any){
//   this.studentService.updateSubmittedAssessment(id,payload).subscribe(
//     (response: any) => {
//       Swal.fire({
//         title: 'Submitted!',
//         text: 'Your answers were submitted.',
//         icon: 'success',
//       })

//     },
//     (error: any) => {
//       console.error('Error:', error);
//     }
//   );

// }

getEvaluatedDataByAssessmentId(id: any) {
  this.studentService.getManualExamAssessmentAnswerById(id).subscribe(
    (response: any) => {
      // console.log("getManualAssessmentAnswerById",response)
      this.dataSourse = response.data;
      this.manualReEvaluationDataId=response?.data[0]?._id;
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
// patchEvaluatedData() {
//   this.dataSourse[0].manuallyCorrected_Answers?.forEach((evaluatedItem: any) => {
//     const target = this.combinedAnswers.find(item =>
//       item.questionText === evaluatedItem.questionText
//     );
//     if (target) {
//       target.assignedMarks = evaluatedItem.assignedMarks ?? 0;
//       target.remarks = evaluatedItem.remarks ?? '';
//     }
//   });

//   this.originalAnswers = JSON.parse(JSON.stringify(this.combinedAnswers));
// }

patchEvaluatedData() {
  const evaluatedAnswers = this.dataSourse[0]?.manuallyCorrected_Answers || [];

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
}