import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { QuestionService } from '@core/service/question.service';
import { Any } from '@tensorflow/tfjs';
import { StudentsService } from 'app/admin/students/students.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-manual-evaluation',
  templateUrl: './manual-evaluation.component.html',
  styleUrls: ['./manual-evaluation.component.scss']
})
export class ManualEvaluationComponent {
  rowData: any;
  rowId: string = '';
  response:any;
  getAssessmentCorrectAns:any;
  getAssessmentAnswer:any;
  combinedAnswers: any[] = [];
  savedAnswers: any[] = [];
  originalAnswers: any[] = []; 
  isEdit:boolean=false;
  assessmentAnswerId:any;
  dataSourse:any;
  // constructor(private route: ActivatedRoute,private courseService: CourseService,private questionService: QuestionService,) {}
  breadscrums: any[] = [];
  manualReEvaluationDataId:any;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private questionService: QuestionService,
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
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.rowId = params['id'];
      this.isEdit = params['isEdit'] === 'true'; 
    });

    
    this.getCategories(this.rowId)

    
    
  }

  getCategories(id: string): void {
    
    this.getCategoryByID(id);
  }
  getCategoryByID(id: string) {
     this.courseService.getStudentClassById(id).subscribe((response: any) => {
      // this.classDataById = response?._id;
      this.response = response;
      this.getAssessmentAnswer=response?.assessmentAnswer?.answers;
      this.assessmentAnswerId=response?.assessmentAnswer?._id;
      

      // if(this.isEdit){
      //   this.getEvaluatedDataByAssessmentId(this.assessmentAnswerId);
      // }
      this.getAssessment(response?.assessmentAnswer?.assessmentId)
    
    });
  }

  getAssessment(questionId: any) {
    this.questionService.getQuestionsById(questionId).subscribe((response: any) => {
      this.getAssessmentCorrectAns = response?.questions;
     
      if (this.getAssessmentCorrectAns && this.getAssessmentAnswer) {
        this.combineAnswers();
        
        if (this.isEdit) {
          this.getEvaluatedDataByAssessmentId(this.assessmentAnswerId);
        }
      }
    });
  }
  
combineAnswers() {
  this.combinedAnswers = this.getAssessmentCorrectAns.map((question: any) => {
    const studentAnswer = this.getAssessmentAnswer.find((ans: any) =>
      ans.questionText === question.questionText || question.questionText === null
    );
    let correctAnswerText = '';
    let correctFileLink = '';
    let correctFileName = '';

    if (question.fileAnswer?.length) {
      correctFileName = question.fileAnswer[0].uploadedFileName;
      correctFileLink = question.fileAnswer[0].documentLink;
    } else {
      if (question.questionType === 'mcq' || question.questionType === 'radio') {
        const correctOption = question.options.find((opt: any) => opt.correct);
        correctAnswerText = correctOption?.text || '';
      } else if (question.questionType === 'text') {
        correctAnswerText = question.textAnswer;
      } else if (question.questionType === 'textarea') {
        correctAnswerText = question.textareaAnswer;
      } else if (question.questionType === 'number') {
        correctAnswerText = question.numberAnswer;
      } else if (question.questionType === 'fillBlanks') {
        correctAnswerText = question.fillBlankAnswer;
      } else if (question.questionType === 'trueFalse') {
        correctAnswerText = question.trueFalseAnswer ? 'True' : 'False';
      }
    }

    let studentAnswerText = studentAnswer?.selectedOptionText || 'Not Answered';
    let studentFileLink = '';
    let studentFileName = '';

    if (studentAnswer?.fileAnswer?.length) {
      studentFileName = studentAnswer.fileAnswer[0].uploadedFileName;
      studentFileLink = studentAnswer.fileAnswer[0].documentLink;
    }

    return {
      questionText: question.questionText,
      questionType: question.questionType,
      studentAnswer: studentAnswerText,
      studentFileLink,
      studentFileName,
      correctAnswer: correctAnswerText,
      correctFileLink,
      correctFileName,
      questionscore: question?.questionscore || 0,
      assignedMarks: 0,
      remarks: ''
    };
  });

  this.originalAnswers = JSON.parse(JSON.stringify(this.combinedAnswers));
}

hasInvalidMarks(): boolean {
  return this.combinedAnswers.some(
    (item: any) => item.assignedMarks > item.questionscore
  );
}


saveAnswers() {
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
  const assesmentId=this.response?.assessmentAnswer?._id;
  const payload={
    manuallyCorrected_Answers:this.savedAnswers,
    assessmentEvaluationType:this.response?.assessmentAnswer?.assessmentEvaluationType,
    score:score,
  assessmentId:this.response?.assessmentAnswer?.assessmentId,
  companyId:this.response?.assessmentAnswer?.companyId,
  courseId:this.response?.assessmentAnswer?.courseId,
  is_tutorial:this.response?.assessmentAnswer?.is_tutorial,
  studentId:this.response?.assessmentAnswer?.studentId,
  totalScore:totalScore,
  assessmentanswersId:this.response?.assessmentAnswer?._id,
  evaluationStatus:"completed",

  }
  const payload1={
    answers:this.response?.assessmentAnswer?.answers,
    assessmentEvaluationType:this.response?.assessmentAnswer?.assessmentEvaluationType,
    assessmentId:this.response?.assessmentAnswer?.assessmentId,
    companyId:this.response?.assessmentAnswer?.companyId,
    courseId:this.response?.assessmentAnswer?.courseId,
    evaluationStatus:"completed",
    is_course_completed:this.response?.assessmentAnswer?.is_course_completed,
    is_exam_completed:this.response?.assessmentAnswer?.is_exam_completed,
    is_tutorial:this.response?.assessmentAnswer?.is_tutorial,
    score:score,
  studentId:this.response?.assessmentAnswer?.studentId,
  totalScore:totalScore,
  }
  if(!this.isEdit)
  {
  this.studentService.submitManualAssessmentAnswer(payload).subscribe(
    (response: any) => {
      // Swal.fire({
      //   title: 'Submitted!',
      //   text: 'Your Evaluated marks were submitted.',
      //   icon: 'success',
      // });
      // this.updateAssessmentAnswer(assesmentId,payload1)
      Swal.fire({
        title: 'Submitted!',
        text: 'Your Evaluated marks were submitted.',
        icon: 'success',
      }).then(() => {
        this.updateAssessmentAnswer(assesmentId, payload1);
        window.history.back(); 
      });
      
    },
    (error: any) => {
      console.error('Error:', error);
    }
  );
}
else{
  this.studentService.updateManualAssessmentAnswerById(this.manualReEvaluationDataId,payload).subscribe((response)=>{
    // Swal.fire({
    //   title: 'Submitted!',
    //   text: 'Your Evaluated marks were Updated Successfully.',
    //   icon: 'success',
    // });
    // this.updateAssessmentAnswer(assesmentId,payload1)
    Swal.fire({
      title: 'Submitted!',
      text: 'Your Evaluated marks were Updated Successfully.',
      icon: 'success',
    }).then(() => {
      this.updateAssessmentAnswer(assesmentId, payload1);
      window.history.back();
    });
  })
}
}



updateAssessmentAnswer(id:any,payload:any){
  this.studentService.updateSubmittedAssessment(id,payload).subscribe(
    (response: any) => {
      Swal.fire({
        title: 'Submitted!',
        text: 'Your answers were submitted.',
        icon: 'success',
      })
     
    },
    (error: any) => {
      console.error('Error:', error);
    }
  );

}

getEvaluatedDataByAssessmentId(id: any) {
  this.studentService.getManualAssessmentAnswerById(id).subscribe(
    (response: any) => {
      this.dataSourse = response.data;
      this.manualReEvaluationDataId=response?.data[0]?._id;
      if (this.combinedAnswers.length > 0) {
        this.patchEvaluatedData();
      }
      //  if (this.isEdit) {
      //   this.patchEvaluatedData();
      // }
      
    },
    (error: any) => {
      console.error('Error:', error);
    }
  );
}
patchEvaluatedData() {
  this.dataSourse[0].manuallyCorrected_Answers?.forEach((evaluatedItem: any) => {
    const target = this.combinedAnswers.find(item =>
      item.questionText === evaluatedItem.questionText
    );
    if (target) {
      target.assignedMarks = evaluatedItem.assignedMarks ?? 0;
      target.remarks = evaluatedItem.remarks ?? '';
    }
  });

  this.originalAnswers = JSON.parse(JSON.stringify(this.combinedAnswers));
}



cancelChanges() {
  this.combinedAnswers = JSON.parse(JSON.stringify(this.originalAnswers));
  window.history.back();
}

}

