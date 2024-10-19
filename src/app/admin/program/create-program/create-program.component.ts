import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramKit } from '@core/models/course.model';
import { CertificateService } from '@core/service/certificate.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormService } from '@core/service/customization.service';
import { Subscription } from 'rxjs';
import { StudentsService } from 'app/admin/students/students.service';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss']
})
export class CreateProgramComponent {
  breadcrumbs: any[] =[]
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '12rem',
    minHeight: '5rem',
    placeholder: 'Description',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
   
   
    toolbarHiddenButtons: [
      [
        'customClasses',
        'strikeThrough',
        'removeFormat',
        'toggleEditorMode',
        'subscript',
        'superscript',
        'indent',
        'outdent',
         'insertOrderedList',
         'insertUnorderedList',
        'heading',
        'fontName'
      ]
    ]
  };
  

  files: any[] = [];

  coreProgramCards: { coreProgramName: string; coreProgramCode: string }[] = [{ coreProgramName: '', coreProgramCode: '' }];
  electiveProgramCards: { electiveProgramName: any; electiveProgramCode: string }[] = [{ electiveProgramName: null, electiveProgramCode: '' }];

  programFormGroup: FormGroup;
  editPermission: any;
  isSubmitted = false;
  image_link: any;
  uploadedImage: any;
  uploaded: any;
  programList: any;
  subscribeParams: any;
  courseId!: string;
  course: any;
  programKits!: ProgramKit[];
  isEditable = false;
  public Editor: any = ClassicEditor;
  thumbnail: any;
  forms!: any[];
  studentId: any;
  configuration: any;
  configurationSubscription!: Subscription;
  defaultCurrency: string = '';
  certificates: any;
  storedItems: string | null;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    public utils: UtilsService,
    private courseService: CourseService,
    private certificateService: CertificateService,
    private router: Router,
    private classService: ClassService,
    private activatedRoute: ActivatedRoute,
    private studentsService: StudentsService,
    private cd: ChangeDetectorRef,
    private formService: FormService
  ) {

    this.storedItems = localStorage.getItem('activeBreadcrumb');
    if (this.storedItems) {
     this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
     this.breadcrumbs = [
       {
         title: '', 
         items: [this.storedItems],  
         active: 'Create Program',  
       },
     ];
   }
    let urlPath = this.router.url.split('/')
    this.editPermission = urlPath.includes('edit-program');
    this.subscribeParams = this.activatedRoute.params.subscribe((params: any) => {
      this.courseId = params.id;

    });
    this.programFormGroup = this.fb.group({
      deliveryMode: ["", []],
      electiveCourseCount: ["", [Validators.required, ...this.utils.validators.electiveCourseCount]],
      course: ["", [Validators.required]],
      sessionStartDate: ["", [Validators.required, ...this.utils.validators.dob]],
      sessionStartTime: ["", ],
      duration: ["", []],
      courseFee: ["", [Validators.required, ...this.utils.validators.fee]],
      learningOutcomes: ["", []],
      attendees: ["", []],
      prerequisites: ["", []],
      sessionEndDate: ["", [Validators.required, ...this.utils.validators.dob]],
      sessionEndTime: ["", []],
      programCode: ["", [Validators.required]],
      coreCourseCount: ["", [Validators.required, ...this.utils.validators.coreCourseCount]],
      image_link: ["", []],
      programKit: ["", []],
      currency: ["USD", [Validators.required, ...this.utils.validators.currency]],
      corePrograms: this.fb.array([]),
      electivePrograms: this.fb.array([]),
      certificate_temp: [null, [Validators.required]],

    });
    if (this.editPermission === true) {
      this.breadcrumbs = [
        {
          title: 'Edit Program',
          items: [this.storedItems],
          active: 'Edit Program',
        },
      ];
    }

  }
  get corePrograms(): FormArray {
    return this.programFormGroup.get('corePrograms') as FormArray;
  }


  ngOnInit() {
    this.getProgramKits();
    this.getCurrency();
    this.getAllCertificates();

    if (this.editPermission) {
      this.getData()
    }
    this.addCoreCard();
    this.addElectiveCard();
    this.getProgramList();
    this.getForms();
  }
  getForms(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.formService
      .getAllForms(userId,'Program Creation Form')
      .subscribe((forms) => {
        this.forms = forms;
      });
  }

  labelStatusCheck(labelName: string): any {
    if (this.forms && this.forms.length > 0) {
      const status = this.forms[0]?.labels?.filter(
        (v: any) => v?.name === labelName
      );
      if (status && status.length > 0) {
        return status[0]?.checked;
      }
    }
    return false;
    this.loadData();

  }

  addCoreCard(): void {
    this.corePrograms.push(
      this.fb.group({
        coreProgramName: ["", []],
        coreProgramCode: ["", []],
        coreProgramDescription: ["", []],
      })
    );
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
        this.programFormGroup.patchValue({
          currency: this.defaultCurrency,
        })
      }
    });
  }

  addElectiveCard(): void {
    this.electivePrograms.push(
      this.fb.group({
        electiveProgramName: [null, []],
        electiveProgramCode: ["", []],
        electiveProgramDescription: ["", []],
      })
    );
  }
  get electivePrograms(): FormArray {
    return this.programFormGroup.get('electivePrograms') as FormArray;
  }



  deleteCoreCard(index: number) {
    this.corePrograms.controls.splice(index, 1);
  }

  deleteElectiveCard(index: number) {
    this.electivePrograms.controls.splice(index, 1);
  }




  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
  }
  back() {

    window.history.back();
  }
  fileBrowseHandler(event: any) {
    const files = event.target.files;
    this.onFileDropped(files);
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Selected format doesn't support. Only JPEG, PNG, JPG, and JFIF formats are allowed.!`,
      });
      return;
    }
  
    this.thumbnail = file
    const formData = new FormData();
    formData.append('files', this.thumbnail);
  this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) =>{

    this.image_link = data.data.thumbnail;
      this.uploaded=this.image_link.split('/')
      let image  = this.uploaded.pop();
      this.uploaded= image.split('\\');
      this.uploadedImage = this.uploaded.pop();
    })
  }

  save() {
    let certicate_temp_id = this.certificates.filter(
      (certificate: any) =>
        certificate.title === this.programFormGroup.value.certificate_temp
    );
    console.log("programFormGroup",this.programFormGroup.value)
    if (this.programFormGroup.valid) {
      let creator = JSON.parse(localStorage.getItem('user_data')!).user.name;
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      if (this.editPermission) {
        let payload = {
          title: this.programFormGroup.value.course,
          courseCode: this.programFormGroup.value.programCode,
          deliveryMode: this.programFormGroup.value.deliveryMode,
          coreCourseCount: this.programFormGroup.value.coreCourseCount,
          electiveCourseCount: this.programFormGroup.value.electiveCourseCount ? this.programFormGroup.value.electiveCourseCount : 0,
          sessionStartDate: this.programFormGroup.value.sessionStartDate == "Invalid date" ? null : this.programFormGroup.value.sessionStartDate,
          sessionEndDate: this.programFormGroup.value.sessionEndDate == "Invalid date" ? null : this.programFormGroup.value.sessionEndDate,
          sessionStartTime: this.programFormGroup.value.sessionStartTime,
          sessionEndTime: this.programFormGroup.value.sessionEndTime,
          duration: this.programFormGroup.value.duration,
          courseFee: this.programFormGroup.value.courseFee,
          currency: this.programFormGroup.value.currency,
          learningOutcomes: this.programFormGroup.value.learningOutcomes,
          attendees: this.programFormGroup.value.attendees,
          prerequisites: this.programFormGroup.value.prerequisites,
          coreprogramCourse: this.corePrograms.value,
          electiveprogramCourse: this.electivePrograms.value,
          certificate_template: this.programFormGroup.value.certificate_temp,
          certificate_template_id: certicate_temp_id[0].id,
          image_link: this.image_link,
          id: this.courseId,
          companyId:userId
        }

        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to update this program!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed){
            this.courseService.updateCourseProgram(this.courseId, payload).subscribe(
              (_res: any) => {
                Swal.fire({
                  title: 'Successful',
                  text: 'Program updated succesfully',
                  icon: 'success',
                });
                window.history.back();
              },
              (err: any) => {
                Swal.fire(
                  'Failed to update Program',
                  'error'
                );
              }
            );
          }
        });


      }
      else {
        let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        let payload = {
          title: this.programFormGroup.value.course,
          courseCode: this.programFormGroup.value.programCode,
          deliveryMode: this.programFormGroup.value.deliveryMode,
          coreCourseCount: this.programFormGroup.value.coreCourseCount,
          electiveCourseCount: this.programFormGroup.value.electiveCourseCount ? this.programFormGroup.value.electiveCourseCount : 0,
          sessionStartDate: this.programFormGroup.value.sessionStartDate ? this.programFormGroup.value.sessionStartDate : null,
          sessionEndDate: this.programFormGroup.value.sessionEndDate ? this.programFormGroup.value.sessionEndDate : null,
          sessionStartTime: this.programFormGroup.value.sessionStartTime,
          sessionEndTime: this.programFormGroup.value.sessionEndTime,
          duration: this.programFormGroup.value.duration,
          courseFee: this.programFormGroup.value.courseFee,
          currency: this.programFormGroup.value.currency,
          learningOutcomes: this.programFormGroup.value.learningOutcomes,
          attendees: this.programFormGroup.value.attendees,
          prerequisites: this.programFormGroup.value.prerequisites,
          coreprogramCourse: this.corePrograms.value,
          electiveprogramCourse: this.electivePrograms.value?this.electivePrograms.value: null,
          image_link: this.image_link,
          creator:creator,
          id: this.courseId,
          companyId:userId,
          certificate_template: this.programFormGroup.value.certificate_temp,
        certificate_template_id: certicate_temp_id[0].id,
        }

        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to create a program!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed){
            this.courseService.createCourseProgram(payload).subscribe(
              (res: any) => {
                Swal.fire({
                  title: 'Successful',
                  text: 'Program created succesfully',
                  icon: 'success',
                });
                this.router.navigate(['/admin/program/submitted-program/submitted-pending-program'])
              },
              (err: any) => {
                Swal.fire(
                  'Failed to create Program',
                  'error'
                );
              }
            );
          }
        });
      }
    }
    else {
      this.programFormGroup.markAllAsTouched();
      this.isSubmitted = true;
    }
  }
  getProgramList(filters?: any) {
    this.classService.getAllCoursesTitle('active').subscribe(
      (response: any) => {
        this.programList = response.reverse();
      },
      (error) => {
      }
    );
  }
  getProgramKits() {
    this.courseService.getProgramCourseKit().subscribe(
      (response: any) => {
        this.programKits = response.docs;
      },
      (error: any) => {
      }
    );
  }
  getData() {
    this.courseService.getProgramById(this.courseId).subscribe((response: any) => {
      this.course = response.data;
      this.image_link = this.course.image_link;
      this.uploaded = this.image_link?.split('/')
      let image  = this.uploaded?.pop();
      this.uploaded= image?.split('\\');
      this.uploadedImage = this.uploaded?.pop();
      this.programFormGroup.patchValue({
        course: this.course?.title,
        programCode: this.course?.courseCode,
        deliveryMode: this.course?.deliveryMode,
        coreCourseCount: this.course?.coreCourseCount,
        electiveCourseCount: this.course?.electiveCourseCount,
        sessionStartDate: `${moment(this.course?.sessionStartDate).format("YYYY-MM-DD")}`,
        sessionEndDate: `${moment(this.course?.sessionEndDate).format("YYYY-MM-DD")}`,
        sessionStartTime: this.course?.sessionStartTime,
        sessionEndTime: this.course?.sessionEndTime,
        duration: this.course?.duration,
        courseFee: this.course?.courseFee,
        currency: this.course?.currency,
        learningOutcomes: this.course?.learningOutcomes,
        attendees: this.course?.attendees,
        prerequisites: this.course?.prerequisites,
        electiveprogramCourse: this.course?.electiveprogramCourse,
        certificate_temp: this.course?.certificate_template,
      });

      const itemControls = response.data.coreprogramCourse.map((item: {
        _id: any; coreProgramName: any; coreProgramDescription: any;
      }) => {
        return this.fb.group({
          coreProgramName: [item?.coreProgramName.id],
          coreProgramDescription: [item?.coreProgramDescription],
        });
      });
      if (itemControls) {
        this.programFormGroup.setControl('corePrograms', this.fb.array(itemControls));
      }
      const electiveControls = response.data.electiveprogramCourse.map((item: {
        _id: any; electiveProgramName: any; electiveProgramDescription: any;
      }) => {
        return this.fb.group({
          electiveProgramName: [item?.electiveProgramName?.id],
          electiveProgramDescription: [item?.electiveProgramDescription],
        });
      });
      if (electiveControls) {
        this.programFormGroup.setControl('electivePrograms', this.fb.array(electiveControls));
      }

      this.cd.detectChanges();
    });

  }

  getAllCertificates() {
    this.certificateService.getAllCertificate().subscribe(
      (response: { data: { docs: any } }) => {
        this.certificates = response.data.docs;
      },
      () => {}
    );
  }
}
