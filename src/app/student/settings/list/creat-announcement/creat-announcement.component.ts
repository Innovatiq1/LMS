import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CourseTitleModel } from '@core/models/class.model';
import { AdminService } from '@core/service/admin.service';
import { AnnouncementService } from '@core/service/announcement.service';
import { UtilsService } from '@core/service/utils.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormService } from '@core/service/customization.service';


@Component({
  selector: 'app-creat-announcement',
  templateUrl: './creat-announcement.component.html',
  styleUrls: ['./creat-announcement.component.scss']
})
export class CreatAnnouncementComponent {
  breadscrums = [
    {
      title: 'Create Announcement',
      items: ['Announcement'],
      active: 'Create Announcement',
    },
  ];
  create = true;
  status = true;
  isChecked = false;
  instructors = false;
  id: any;
  editUrl: any;
  viewUrl: any;
  inProgress = false;
  announcementForm: FormGroup
  courseList!: CourseTitleModel[];
  isLoading = false;
  announcementData: any[] = [];
  currentId: string;
  collegeReviewList: any;
  announcementList: any;
  isSubmitted = false;
  error: any;
  res: any;
  isEditable = false;
  public Editor: any = ClassicEditor;
  mode: string = 'editUrl';
  userTypeNames: any;
  forms!: any[];

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
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

  toggleStatus() {
    this.status = !this.status;
  }
  ngOnInit() {
    this.getAllUserTypes();
    forkJoin({
      courses: this.classService.getAllCoursesTitle('active'),

    }).subscribe((response: { courses: CourseTitleModel[]; }) => {
      this.courseList = response.courses;
      ////this.instructorList = response.instructors;
      //this.labList = response.labs;
      //this.cd.detectChanges();
    });



  }

  back() {
    this.create = true;
  }
  test(event: any) {
  }
cancel(){
  window.history.back();
}


  constructor(private router: Router, public classService: ClassService, public utils: UtilsService, private formBuilder: FormBuilder,
    private formService: FormService,
    private announcementService: AnnouncementService,private adminService: AdminService,) {
      this.forms = [];
    let urlPath = this.router.url.split('/')
    this.editUrl = urlPath.includes('edit-announcement');
    this.viewUrl = urlPath.includes('view-announcement');

    this.currentId = urlPath[urlPath.length - 1];

    if (this.editUrl === true) {
      this.breadscrums = [
        {
          title: 'Edit Announcement',
          items: ['Announcement'],
          active: 'Edit Announcement',
        },
      ];
    }
    else if(this.viewUrl===true){
      this.breadscrums = [
        {
          title:'View Announcement',
          items: ['Announcement'],
          active: 'View Announcement',
        },
      ];
    }

    // if (this.editUrl) {
      this.getAnnouncementList()

    // }

    this.announcementForm = this.formBuilder.group({
      subject: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]/)]),
      details: new FormControl('', [Validators.required, ...this.utils.validators.noLeadingSpace]),
      announcementFor: new FormControl('', [Validators.required,]),
      'isActive': [true],
    });
    this.getForms();
  }
  student1(event: any) {

  }



  saveAnnouncement() {
    this.inProgress = true;
    if (!this.editUrl) {
      if (this.announcementForm.valid) {
        const formData = this.announcementForm.getRawValue();

        let payload = {
          subject: formData?.subject,
          details: formData?.details.replace(/<\/?span[^>]*>/g, ""),
          announcementFor: formData?.announcementFor.toString().replace(',',' / '),
          isActive: formData?.isActive,
        }
        // 
        Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create announcement!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.announcementService.makeAnnouncement(payload).subscribe(
          (res) => {
            Swal.fire({
              title: 'Successful',
              text: "Announcement Created Successfully",
              icon: 'success',
            });
            this.router.navigateByUrl('/student/settings/announcement')
            // this.router.navigateByUrl(['/admin/announcement/list'])
          },
          (err) => {
            Swal.fire(
              'Create Announcement failed',
              'error'
            );
          },
          () => {
          }
        );
      }
    });
        
      }
      else {
        this.isSubmitted = true;
      }
    } else {

      if (this.announcementForm.valid) {

        let payload = {
          subject: this.announcementForm.value?.subject,
          details: this.announcementForm.value?.details.replace(/<\/?span[^>]*>/g, ""),
          announcementFor: this.announcementForm.value?.announcementFor.toString().replace(',',' / '),
          isActive: this.announcementForm.value?.isActive,
        }

        Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this announcement!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.announcementService.updateAnnouncement(payload, this.currentId).subscribe(
          (res) => {
            Swal.fire({
              title: 'Successful',
              text: 'Updated Announcement Successfully',
              icon: 'success',
            });
            this.router.navigateByUrl('/student/settings/announcement')

          },
          (err) => {
            Swal.fire(
              'Failed to Update',
              'error'
            );
          },
          () => {
          }
        );  
      }
    });
        
      }
      else {
        this.isSubmitted = true;
      }
    }


  }


  isInputReadonly(): boolean {
    return this.mode === 'viewUrl'; // If mode is 'viewUrl', return true (readonly); otherwise, return false (editable).
  }
  isInputDisabled(): boolean {
    return this.mode === 'viewUrl'; // If mode is 'viewUrl', return true (disabled); otherwise, return false (enabled).
  }
  student(event: any) {
    this.isChecked = event.target.checked
  }
  instructor(event: any) {
    this.instructors = event.target.checked
  }


  getAnnouncementList(filter?: any) {
    this.isLoading = true;
    this.announcementService.getAnnouncementList(filter).subscribe(response => {
      this.isLoading = false;
      this.announcementList = response.data.data;
      let data = this.announcementList.find((id: any) => id._id === this.currentId);
      // console.log(data,"data")
      if (data) {

        let anuFor:any =[];
        anuFor.push(data.announcementFor)
       let anuce = anuFor.map((res:any) => res).toString().replace(' / ',',').split(',');
      //  anuFor = [];
      //  anuFor.push(anuce);
      //  console.log("var",anuce)
        this.announcementForm.patchValue({
          subject: data?.subject,
          details: data?.details,
          announcementFor: anuce,
        });
      }
    }, error => {
      this.isLoading = false;

    });
  }

  getAllUserTypes(filters?: any) {
    this.adminService.getUserTypeList({ 'allRows':true }).subscribe(
      (response: any) => {
        this.userTypeNames = response;
      },
      (error) => {
      }
    );
  }

  getForms(): void {
    this.formService.getAllForms('Announcement Form').subscribe(forms => {
      this.forms = forms;
    });
  }

  labelStatusCheck(labelName: string): any {
    if (this.forms && this.forms.length > 0) {
      const status = this.forms[0]?.labels?.filter((v:any) => v?.name === labelName);
      if (status && status.length > 0) {
        return status[0]?.checked;
      }
    }
    return false;
  }
}
