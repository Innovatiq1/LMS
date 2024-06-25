import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from '@angular/forms';
import { Assessment, ExamAssessment, Certificate, CourseKit, CourseUploadData, Feedback, FundingGrant, Instructor, MainCategory, SubCategory, Survey } from '@core/models/course.model';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { CourseService } from '@core/service/course.service';
import { forkJoin } from 'rxjs';
import { CertificateService } from '@core/service/certificate.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { InstructorService } from '@core/service/instructor.service';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { QuestionService } from '@core/service/question.service';
import { SurveyService } from 'app/admin/survey/survey.service';
import { FormService  } from '@core/service/customization.service';
import { Subscription } from 'rxjs';
import { StudentsService } from 'app/admin/students/students.service';
import { UtilsService } from '@core/service/utils.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
})
export class AddCourseComponent implements OnInit {
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  mainCategoryControl!: FormControl;
  bulkUploadData: CourseUploadData[] = [];
  subCategoryControl!: FormControl;
  course_duration_in_days!:number;
  training_hours!:number;
  fee!:number;
  currencyControl!: FormControl;
  pdu_technical!:number;
  pdu_leadership!:number;
  image_link: any;
  uploadedImage: any;
  uploaded: any;
  fundingGrant!: FormControl;
  fundingGrants!: FundingGrant[];
  // survey!: Survey[];
  // surveyCategoryControl!: FormControl;
  instuctorCategoryControl!: FormControl;
  courseKitCategoryControl!: FormControl;
  assessmentControl!: FormControl;
  assessmentExamControl!: FormControl;
  feedbackControl!: FormControl;
  certificatesCategoryControl!: FormControl;
  // instructors!: Instructor[];
  courseKits!: CourseKit[];
  courseKits1:any
  assessments!: Assessment[];
  exam_assessments!: ExamAssessment[];
  feedbacks!: Feedback[];
  // certificates!:Certificate[];
  next = true;
  isSubmitted=false;
  isWbsSubmitted=false;
  courseAdded=false;
  disableNextBtn: any;
  firstFormGroup: FormGroup;
  isEditable = false;
  editUrl: any;
  viewUrl: any;
  course:any;
  courseId!: string;
  subscribeParams: any;
  mode: string = 'editUrl';
  public Editor: any = ClassicEditor;
  thumbnail: any;
  // instructorList: any = [];
  forms!: any[];
  isPaid = false;
  studentId: any;
  configuration: any;
  configurationSubscription!: Subscription;
  defaultCurrency: string = '';
  booleanOpt: any[] = [{code: true, label: "Yes"},{code: false, label: "No"}]
  examTypes: any[] = [ { code: 'after', label: 'After Assessment' }, { code: 'direct', label: 'Direct' } ];

  breadscrums = [
    {
      title:'Create Course',
      items: ['Course'],
      active: 'Create Course',
    },
  ];
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    sanitize: false,
    toolbarHiddenButtons: [
      ['strikethrough']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  vendors: any;
  certificates: any;

  constructor(private router: Router,private fb: FormBuilder, private _formBuilder: FormBuilder,
    private courseService: CourseService,
    private certificateService:CertificateService,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private instructorService: InstructorService,
    private questionService: QuestionService,
    public surveyService: SurveyService,
    private formService: FormService,
    private studentsService: StudentsService,
    public utils: UtilsService
    ) {
      let urlPath = this.router.url.split('/')
    this.editUrl = urlPath.includes('edit-course');
    this.viewUrl = urlPath.includes('view-course');

    if(this.editUrl===true){
      this.breadscrums = [
        {
          title:'Edit Course',
          items: ['Course'],
          active: 'Edit Course',
        },
      ];
    }
    else if(this.viewUrl===true){
      this.breadscrums = [
        {
          title:'View Course',
          items: ['Course'],
          active: 'View Course',
        },
      ];
    }

      this.firstFormGroup = this._formBuilder.group({
        title: ['', [Validators.required,Validators.pattern(/^[a-zA-Z ]/)]],
        courseCode: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]/)]],
        main_category: ['', [Validators.required]],
        sub_category: ['', [Validators.required]],
        fee: new FormControl('',[Validators.pattern(/^\d+(\.\d+)?$/)]),
        currency_code: new FormControl('',),
        course_duration_in_days: new FormControl('',[Validators.min(1),Validators.pattern(/^\d+(\.\d+)?$/)]),
        training_hours: new FormControl('',[Validators.pattern(/^\d+(\.\d+)?$/)]),
        skill_connect_code: new FormControl('',[Validators.pattern(/^[a-zA-Z0-9]/)]),
        course_description: new FormControl('',[ Validators.maxLength(100)]),
        course_detailed_description: new FormControl('',[]),
        sessionStartDate: new FormControl('',[]),
        sessionStartTime: new FormControl('',[]),
        sessionEndDate: new FormControl('',[]),
        sessionEndTime: new FormControl('',[]),
        pdu_technical: new FormControl('',[Validators.pattern(/^\d+(\.\d+)?$/)]),
        pdu_leadership: new FormControl('',[Validators.pattern(/^\d+(\.\d+)?$/)]),
        pdu_strategic: new FormControl('',[Validators.pattern(/^\d+(\.\d+)?$/)]),
        image_link: new FormControl('', [Validators.maxLength(255)]),
        website_link: new FormControl('', [Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/)]),
        funding_grant: new FormControl('',[Validators.required]),
        // survey: new FormControl('',[Validators.required]),
        id: new FormControl(''),
        feeType: new FormControl('',[Validators.required]),

        // course_instructor: new FormControl('', [Validators.required]),
        // assign_exam: new FormControl('', []),
        assessment: new FormControl('', [Validators.required, ...this.utils.validators.noLeadingSpace,...this.utils.validators.assessment]),
        exam_assessment: new FormControl('', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.e_assessment]),
        survey: new FormControl('', [Validators.required]),
        course_kit: new FormControl('', [Validators.required]),
        vendor: new FormControl('',[ Validators.maxLength(100)]),
        isFeedbackRequired: new FormControl(null, [Validators.required]),
        examType: new FormControl(null, [Validators.required]),
        certificate_temp: new FormControl(null, [Validators.required]),
      });
      // this.secondFormGroup = this._formBuilder.group({

      // // certificates: new FormControl('',[Validators.required]),
      // });
      this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
        this.courseId = params.id;
      });
      if(this.editUrl || this.viewUrl){
      this.getData();
      }


  }
  getAllVendors(){
    this.courseService.getVendor().subscribe((response:any) =>{
     this.vendors = response.reverse();
     
    })
  }

  ngOnInit(): void {
    this.getAllCertificates();
    this.getCurrency();
    this. getAllVendors();
    this.mainCategoryControl = this.firstFormGroup.get('main_category') as FormControl;
    this.subCategoryControl = this.firstFormGroup.get('sub_category') as FormControl;
    this.currencyControl = this.firstFormGroup.get('currency_code') as FormControl;
    this.fundingGrant = this.firstFormGroup.get('funding_grant') as FormControl;
    // this.surveyCategoryControl = this.secondFormGroup.get('survey') as FormControl;
    // this.instuctorCategoryControl = this.secondFormGroup.get('course_instructor') as FormControl;
    this.courseKitCategoryControl = this.firstFormGroup.get('course_kit') as FormControl;
    this.assessmentControl = this.firstFormGroup.get('assessment') as FormControl;
    this.assessmentExamControl = this.firstFormGroup.get('exam_assessment') as FormControl;
    this.feedbackControl = this.firstFormGroup.get('survey') as FormControl;
    // this.certificatesCategoryControl = this.secondFormGroup.get('certificates') as FormControl;
    // // this.setMainCategoryControlState();
    // this.setSubCategoryControlState();
    // this.setCurrencyControlState();
    // this.setFundingControlState();
    // this.setSurveyControlState();
    // this.setInstructorControlState();
    // this.setCourseKitControlState();
    // this.setCertificatesControlState();
    this.getForms();
    if(!this.editUrl){
      this.setup();
    }
    if(this.viewUrl){
      this.mode = 'viewUrl';
      this.config ={
        editable : false,
        enableToolbar: false,
        showToolbar: false,
      }
    }

    let payload = {
      type: 'Instructor',
    };

    this.loadData();

    // this.instructorService.getInstructor(payload).subscribe((res) => {
    //   this.instructorList = res;
    //   console.log(
    //     'instructor',
    //     this.instructorList
    //   );

    // });

// this.getCourseKits();
}

isInputReadonly(): boolean {
  return this.mode === 'viewUrl'; // If mode is 'viewUrl', return true (readonly); otherwise, return false (editable).
}
isInputDisabled(): boolean {
  return this.mode === 'viewUrl'; // If mode is 'viewUrl', return true (disabled); otherwise, return false (enabled).
}

// setMainCategoryControlState(): void {
//   if (this.mode === 'viewUrl') {
//     this.mainCategoryControl.disable({ emitEvent: false }); // Disable the control when in viewUrl mode.
//   } else {
//     this.mainCategoryControl.enable({ emitEvent: false }); // Enable the control for other modes.
//   }
// }
// setSubCategoryControlState(): void {
//   if (this.mode === 'viewUrl') {
//     this.subCategoryControl.disable({ emitEvent: false }); // Disable the control when in viewUrl mode.
//   } else {
//     this.subCategoryControl.enable({ emitEvent: false }); // Enable the control for other modes.
//   }
// }
// setCurrencyControlState(): void {
//   if (this.mode === 'viewUrl') {
//     this.currencyControl.disable({ emitEvent: false }); // Disable the control when in viewUrl mode.
//   } else {
//     this.currencyControl.enable({ emitEvent: false }); // Enable the control for other modes.
//   }
// }
// setFundingControlState(): void {
//   if (this.mode === 'viewUrl') {
//     this.fundingGrant.disable({ emitEvent: false }); // Disable the control when in viewUrl mode.
//   } else {
//     this.fundingGrant.enable({ emitEvent: false }); // Enable the control for other modes.
//   }
// }
// setSurveyControlState(): void {
//   if (this.mode === 'viewUrl') {
//     this.surveyCategoryControl.disable({ emitEvent: false }); // Disable the control when in viewUrl mode.
//   } else {
//     this.surveyCategoryControl.enable({ emitEvent: false }); // Enable the control for other modes.
//   }
// }
// setInstructorControlState(): void {
//   if (this.mode === 'viewUrl') {
//     this.instuctorCategoryControl.disable({ emitEvent: false }); // Disable the control when in viewUrl mode.
//   } else {
//     this.instuctorCategoryControl.enable({ emitEvent: false }); // Enable the control for other modes.
//   }
// }
// setCourseKitControlState(): void {
//   if (this.mode === 'viewUrl') {
//     this.courseKitCategoryControl.disable({ emitEvent: false }); // Disable the control when in viewUrl mode.
//   } else {
//     this.courseKitCategoryControl.enable({ emitEvent: false }); // Enable the control for other modes.
//   }
// }
// setCertificatesControlState(): void {
//   if (this.mode === 'viewUrl') {
//     this.certificatesCategoryControl.disable({ emitEvent: false }); // Disable the control when in viewUrl mode.
//   } else {
//     this.certificatesCategoryControl.enable({ emitEvent: false }); // Enable the control for other modes.
//   }
// }

getForms(): void {
  let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.formService.getAllForms(userId,'Course Creation Form').subscribe(forms => {
    this.forms = forms;
  });
}
getAllCertificates(){
  this.certificateService.getAllCertificate().subscribe((response: { data: { docs: any; }; }) =>{
   this.certificates = response.data.docs;
   console.log("ertificate",this.certificates.title)
 
  }, () => {
  });
}

loadData(){
  this.studentId = localStorage.getItem('id')
  this.studentsService.getStudentById(this.studentId).subscribe(res => {
  })
}

getCurrency() : any {
  this.configurationSubscription = this.studentsService.configuration$.subscribe(configuration => {
    this.configuration = configuration;
    const config = this.configuration.find((v:any)=>v.field === 'currency')
    if (config) {
      this.defaultCurrency = config.value;
      this.firstFormGroup.patchValue({
        currency_code: this.defaultCurrency,
      })
    }
  });
}

mainCategoryChange(): void {
    this.subCategories = this.allSubCategories.filter(
      (item) => item.main_category_id === this.firstFormGroup.controls['main_category'].value
    );
}

onFileUpload(event:any) {
  const file = event.target.files[0];

  this.thumbnail = file
  const formData = new FormData();
  formData.append('files', this.thumbnail);
this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) =>{
  this.image_link = data.data.thumbnail;
  this.uploaded=this.image_link?.split('/')
  let image  = this.uploaded?.pop();
  this.uploaded= image?.split('\\');
  this.uploadedImage = this.uploaded?.pop();

})
  // this.certificateService.uploadCourseThumbnail(formData).subscribe((response:any) => {
  //   this.image_link = response.image_link;
  //   console.log("imagesss",this.image_link)
  //   this.uploaded=this.image_link.split('/')
  //   this.uploadedImage = this.uploaded.pop();
  //   console.log("uploaded",this.uploadedImage)
  //   this.firstFormGroup.patchValue({
  //     // image_link: response,
  //   });
  // });
}


  onFileChange(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        const data = new Uint8Array(e?.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length > 1) {
          this.bulkUploadData = jsonData.slice(1).map((row: any) => {

            const [
              title,
              courseCode,
              mainCategory,
              subCategory,
              duration,
              hours,
              fee,
              currency_code,
              skillConnectCode,
              courseDescription,
              courseDetailedDescription,
              pdu_technical,
              pdu_leadership,
              pdu_strategic,
              funding_grant,
              surveyDetail,
              assignInstructors,
              assignCourseKit,
              assignAssessment,
              assignExamAssessment,
              assignFeedback,
              vendor
            ] = row as string[];

            const mainCategoryObj = this.mainCategories.find((i) => {
              return mainCategory === i.category_name

            })

            if (mainCategoryObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Main category ',
                icon: 'error',
              });
            }

            const subCategoryObj = this.subCategories.find((i) => {
              return subCategory === i.category_name
            })

            if (subCategoryObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Sub category',
                icon: 'error',
              });
            }

            const fundingGrantObj = this.fundingGrants.find((i) => {
              return funding_grant === i.grant_type

            })

            if (fundingGrantObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Funding grant',
                icon: 'error',
              });
            }

            // const instructorObj = this.instructors.find((i) => {
            //   return assignInstructors === i.user_id?.name + ' ' + i.user_id?.last_name;
            // });

            // if (instructorObj === undefined) {
            //   Swal.fire({
            //     title: 'Error',
            //     text: 'Cannot find Instructor',
            //     icon: 'error',
            //   });
            // }

            const courseKitObj = this.courseKits.find((i) => {
              return assignCourseKit === i.name
            })

            if (courseKitObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Coursekit',
                icon: 'error',
              });
            }

            const assessmentObj = this.assessments.find((i) => {
              return assignAssessment === i.name
            })

            if (assessmentObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Assessment',
                icon: 'error',
              });
            }

            const assessmentExamObj = this.exam_assessments.find((i) => {
              return assignExamAssessment === i.name
            })

            if (assessmentExamObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Exam Assessment',
                icon: 'error',
              });
            }

            const feedbackObj = this.feedbacks.find((i) => {
              return assignFeedback === i.name
            })

            if (feedbackObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Feedback Questionnaire',
                icon: 'error',
              });
            }
            const uploadData: CourseUploadData = {
              title,
              courseCode,
              main_category: mainCategoryObj?.id,
              sub_category: subCategoryObj?.id,
              course_duration_in_days: parseInt(duration),
              training_hours: parseInt(hours),
              fee: parseInt(fee),
              currency_code: parseInt(currency_code),
              skill_connect_code: skillConnectCode,
              course_description: courseDescription,
              course_detailed_description: courseDetailedDescription,
              pdu_technical: parseInt(pdu_technical),
              pdu_leadership: parseInt(pdu_leadership),
              pdu_strategic: parseInt(pdu_strategic),
              funding_grant: [fundingGrantObj!.id],
              // course_instructor: [instructorObj!.id],
              assessment: [assessmentObj!.id],
              exam_assessment: [assessmentExamObj!.id],
              survey: [feedbackObj!.id],
              course_kit: [courseKitObj!.id],
              vendor: vendor,
            };
            return uploadData;
          });
        }
      } catch (error) {
        // console.error('Error reading file:', error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  }
  save() {
    let certicate_temp_id = this.certificates.filter((certificate: any) => 
    certificate.title === this.firstFormGroup.value.certificate_temp 
  );
  console.log(certicate_temp_id,"temp");
    if(this.firstFormGroup.valid){
    const courseData = this.firstFormGroup.value;
    let creator = JSON.parse(localStorage.getItem('user_data')!).user.name;
    let payload = {
      title: courseData?.title,
      courseCode: courseData?.courseCode,
      main_category: courseData?.main_category,
      sub_category: courseData?.sub_category,
      course_duration_in_days: courseData?.course_duration_in_days,
      training_hours:courseData?.training_hours,
      fee:courseData?.fee,
      currency_code:courseData?.currency_code,
      skill_connect_code:courseData?.skill_connect_code,
      course_description:courseData?.course_description,
      sessionStartDate: courseData?.sessionStartDate == "Invalid date" ? null : courseData.sessionStartDate,
      sessionEndDate: courseData?.sessionEndDate == "Invalid date" ? null : courseData.sessionEndDate,
      sessionStartTime: courseData?.sessionStartTime,
      sessionEndTime: courseData?.sessionEndTime,
      course_detailed_description:courseData?.course_detailed_description,
      pdu_technical:courseData?.pdu_technical,
      pdu_leadership:courseData?.pdu_leadership,
      pdu_strategic:courseData?.pdu_strategic,
      funding_grant:courseData?.funding_grant,
      feeType:courseData?.feeType,
      // survey:courseData?.survey,
      // course_instructor:courseData?.course_instructor,
      assessment:courseData?.assessment,
      exam_assessment: courseData?.exam_assessment,
      survey:courseData?.survey,
      course_kit:courseData?.course_kit,
      vendor:courseData?.vendor,
      // certificates:courseData?.certificates,
      image_link:this.image_link,
      creator:creator,
      id:this.courseId,
      isFeedbackRequired: courseData?.isFeedbackRequired,
      examType: courseData?.examType,
      certificate_template:courseData?.certificate_temp,
      certificate_template_id:certicate_temp_id[0].id,
    }
    
        this.firstFormGroup.value?.course_kit?.map((item:any) => item.id);
    this.firstFormGroup.value?.assessment
    this.firstFormGroup.value?.exam_assessment
    this.firstFormGroup.value?.survey

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to update this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.updateCourse(payload).subscribe((response:any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Course saved successfully',
            icon: 'success',
          });
          window.history.back();
          // this.router.navigate(['/admin/courses/all-courses'])
        });
      }
    });
  }  else {
    this.firstFormGroup.markAsUntouched();
    this.isWbsSubmitted = true;
  }
 
  }
  onSelect(event: any){
    if(event.value == 'paid'){
     this.isPaid = true;
    }else if (event.value == 'free'){
     this.isPaid = false;
    }
   }
  setup() {
    forkJoin({
      mainCategory: this.courseService.getMainCategories(),
      subCategory: this.courseService.getSubCategories(),
      fundingGrant: this.courseService.getFundingGrant(),
      // survey: this.courseService.getSurvey(),
      // instructor: this.courseService.getInstructors(),
      courseKit: this.courseService.getCourseKit(),
      assessment: this.questionService.getQuestionJson({ status: 'approved' }),
      exam_assessment: this.questionService.getExamQuestionJson(),
      survey: this.surveyService.getSurvey(),
      // certificates: this.certificateService.getcertificateBuilders(),

    }).subscribe((response: {
      assessment: any; exam_assessment:any; survey: any; mainCategory: any; subCategory: any; fundingGrant: any; courseKit: { docs: any; };
}) => {
      this.mainCategories = response.mainCategory;
      this.allSubCategories = response.subCategory;
      this.fundingGrants = response.fundingGrant.reverse();
      // this.survey = response.survey;
      // this.instructors = response.instructor;
      this.courseKits = response.courseKit?.docs;
      this.assessments = response.assessment.data.docs;
      this.exam_assessments = response.exam_assessment.data.docs;
      this.feedbacks = response.survey.data.docs;
      // this.certificates = response.certificates.data.docs;
    });

  }

  onSubmit() {
    console.log('Form Value', this.firstFormGroup.value);
  }


  submit() {
    let certicate_temp_id = this.certificates.filter((certificate: any) => 
    certificate.title === this.firstFormGroup.value.certificate_temp 
  );
  console.log(certicate_temp_id,"temppppp");
    if(this.firstFormGroup.valid){
      const courseData = this.firstFormGroup.value;
      let creator = JSON.parse(localStorage.getItem('user_data')!).user.name;
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      let payload = {
        title: courseData.title,
        courseCode: courseData?.courseCode,
        main_category: courseData?.main_category,
        sub_category: courseData?.sub_category,
        course_duration_in_days: courseData?.course_duration_in_days,
        training_hours:courseData?.training_hours,
        fee:courseData?.fee,
        currency_code:courseData?.currency_code,
        skill_connect_code:courseData?.skill_connect_code,
        course_description:courseData?.course_description,
        sessionStartDate: courseData?.sessionStartDate == "Invalid date" ? null : courseData.sessionStartDate,
        sessionEndDate: courseData?.sessionEndDate == "Invalid date" ? null : courseData.sessionEndDate,
        sessionStartTime: courseData?.sessionStartTime,
        sessionEndTime: courseData?.sessionEndTime,
        course_detailed_description:courseData?.course_detailed_description,
        pdu_technical:courseData?.pdu_technical,
        pdu_leadership:courseData?.pdu_leadership,
        pdu_strategic:courseData?.pdu_strategic,
        funding_grant:courseData?.funding_grant,
        // survey:courseData?.survey,
        // course_instructor:courseData?.course_instructor,
        assessment:courseData?.assessment,
        exam_assessment:courseData?.exam_assessment,
        survey:courseData?.survey,
        course_kit:courseData?.course_kit,
        // certificates:courseData?.certificates,
        image_link:this.image_link,
        vendor: courseData?.vendor,
        creator:creator,
        website_link:courseData?.website_link,
        feeType:courseData?.feeType,
        isFeedbackRequired: courseData?.isFeedbackRequired,
        examType: courseData?.examType,
        certificate_template:courseData?.certificate_temp,
        certificate_template_id:certicate_temp_id[0].id,
        companyId:userId
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to create a course!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed){
          this.courseService.saveCourse(payload).subscribe((response: any) => {
            Swal.fire({
              title: 'Successful',
              text: 'Course created successfully',
              icon: 'success',
            });
            this.courseAdded=true;
            this.router.navigate(['/admin/courses/submitted-courses/pending-courses'])

          });
        }
      });
  } else {
    this.firstFormGroup.markAllAsTouched(); 
    this.isWbsSubmitted = true;
  }
  }
  getData() {
    forkJoin({
      mainCategory: this.courseService.getMainCategories(),
      subCategory: this.courseService.getSubCategories(),
      // survey: this.courseService.getSurvey(),
      fundingGrant: this.courseService.getFundingGrant(),
      courseKit: this.courseService.getCourseKit(),
      assessment: this.questionService.getQuestionJson({ status: 'approved' }),
      survey: this.surveyService.getSurvey(),
      course: this.courseService.getCourseById(this.courseId),
      exam_assessment: this.questionService.getExamQuestionJson(),
      // instructor: this.courseService.getInstructors(),
      // certificates: this.certificateService.getcertificateBuilders()
    }).subscribe((response: any) => {
      this.mainCategories = response.mainCategory;
      this.fundingGrants = response.fundingGrant;
      this.courseKits = response.courseKit?.docs;
      this.assessments = response.assessment?.data.docs;
      this.exam_assessments = response.exam_assessment.data.docs;
      this.feedbacks = response.survey?.data.docs;
      // this.survey = response.survey;
      this.allSubCategories = response.subCategory;
      this.course = response.course;
      // this. = response.assign_exam;
      // this.instructors = response.instructor;
      // this.surveys = response.surveys.data.docs;
      // this.certificates = response.certificates.data.docs;
      this.image_link = this.course.image_link;
      this.uploaded=this.image_link?.split('/')
      let image  = this.uploaded?.pop();
      this.uploaded= image?.split('\\');
      this.uploadedImage = this.uploaded?.pop();
      let sub_categoryId = this.course?.sub_category?.id;
      let categoryId = this.course?.main_category?.id;
      let fundingGrantId = this.course?.funding_grant?.id;
      let courseKitId = this.course?.course_kit?.map((item: { id: any; }) => item?.id) || [];
      let assessmentId = this.course?.assessment?.id;
      let exam_assessmentId = this.course?.exam_assessment?.id;
      let feedbackId = this.course?.survey?.id;
      if(this.course?.feeType == 'paid'){
        this.isPaid = true;
      }
      this.firstFormGroup.patchValue({
        currency_code: this.course.currency_code ? this.course.currency_code: null,
        training_hours: this.course?.training_hours?.toString(),
        title: this.course?.title,
        feeType:this.course?.feeType,
        courseCode: this.course?.courseCode,
        main_category: categoryId,
        sub_category: sub_categoryId,
        course_description:this.course?.course_description,
        course_detailed_description:this.course?.course_detailed_description,
        skill_connect_code: this.course?.skill_connect_code,
        fee: this.course?.fee?.toString(),
        sessionStartDate: `${moment(this.course?.sessionStartDate).format("YYYY-MM-DD")}`,
        sessionEndDate: `${moment(this.course?.sessionEndDate).format("YYYY-MM-DD")}`,
        sessionStartTime: this.course?.sessionStartTime,
        sessionEndTime: this.course?.sessionEndTime,
        course_duration_in_days: this.course?.course_duration_in_days?.toString(),
        website_link: this.course?.website_link,
        funding_grant: fundingGrantId,
        // assign_exam: this.assign_exam?.assign_exam,
        // certificates: this.course?.certificates,
        // survey: this.course?.survey?.id,
        id: this.course?.id,
        pdu_technical: this.course?.pdu_technical?.toString(),
        pdu_leadership: this.course?.pdu_leadership?.toString(),
        pdu_strategic: this.course?.pdu_strategic?.toString(),
        // course_instructor: this.course?.course_instructor?.id,
        course_kit: courseKitId,
        assessment: assessmentId,
        exam_assessment: exam_assessmentId,
        survey: feedbackId,
        uploadedImage:this.course?.image_link,
        vendor: this.course?.vendor,
        isFeedbackRequired: this.course?.isFeedbackRequired,
        examType: this.course?.examType,
        certificate_temp:this.course?.certificate_template ,
      });
      this.mainCategoryChange();
      this.cd.detectChanges();
    });


}

cancel() {

  window.history.back();
}

labelStatusCheck(labelName: string): any {
  // if (this.forms) {
  //   const  status = this.forms[0]?.labels?.filter((v : any) => v?.name === labelName)
  //   return status[0]?.checked
  // }
  if (this.forms && this.forms.length > 0) {
    const status = this.forms[0]?.labels?.filter((v:any) => v?.name === labelName);
    if (status && status.length > 0) {
      return status[0]?.checked;
    }
  }
  return false;
}

}
