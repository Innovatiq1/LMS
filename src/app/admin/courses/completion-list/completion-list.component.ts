import { MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import {
  ClassModel,
  Session,
  Student,
  StudentApproval,
  StudentPaginationModel,
} from 'app/admin/schedule-class/class.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import 'jspdf-autotable';
import { TableElement, TableExportUtil } from '@shared';
//import { jsPDF } from 'jspdf';
import DomToImage from 'dom-to-image';
import { number } from 'echarts';
import { StudentService } from '@core/service/student.service';
import { dA } from '@fullcalendar/core/internal-common';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AppConstants } from '@shared/constants/app.constants';
import { CertificateService } from '@core/service/certificate.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CourseService } from '@core/service/course.service';
import { AuthenService } from '@core/service/authen.service';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-completion-list',
  templateUrl: './completion-list.component.html',
  styleUrls: ['./completion-list.component.scss'],
})
export class CompletionListComponent {
  displayedColumns = [
    'Student',
    'email',
    'Course',
    'Fee Type',
    'Instructorfee',
    'Classstart',
    'Classend',
    'Registered Date',
    'Completed Date',
    'Exam Score',
    'Assessment Score',
    'actions',
    'view',
  ];

  breadscrums = [
    {
      title: 'Completion List',
      items: ['Registered Course'],
      active: 'Completion Course',
    },
  ];
  @ViewChild('certificateDialog') certificateDialog!: TemplateRef<any>;

  pdfData: any = [];
  dafaultGenratepdf: boolean = false;
  element: any;
  certifiacteUrl: boolean = false;

  dataSource: any;
  pageSizeArr = [10, 20];
  totalItems: any;
  studentPaginationModel: StudentPaginationModel;
  isLoading: boolean = true;
  searchTerm: string = '';
  @ViewChild(MatSort) matSort!: MatSort;
  commonRoles: any;
  certificateDetails: any;
  certificateUrl: any;
  isCertificate: boolean = false;
  certificateId: any;
  image_link: any;
  uploaded: any;
  uploadedImage: any;
  certificateForm!: FormGroup;

  

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
  thumbnail: any;
  studentData: any;
  dialogRef: any;
  isView = false;
  

  upload() {
    document.getElementById('input')?.click();
  }
  @ViewChild('backgroundTable') backgroundTable!: ElementRef;

  constructor(private classService: ClassService, private changeDetectorRef: ChangeDetectorRef,public router: Router, public dialog: MatDialog,
    private certificateService: CertificateService,  private sanitizer: DomSanitizer,private _activeRouter: ActivatedRoute,
    private courseService: CourseService,private fb: FormBuilder,
    private authenService: AuthenService) {
    this.studentPaginationModel = {} as StudentPaginationModel;
    let urlPath = this.router.url.split('/')
    this.certificateUrl = urlPath.includes('edit');
    this.isCertificate = this.certificateUrl;
    if(this.certificateUrl===true){
      this.isCertificate = true;
    }else{
      this.isCertificate = false;
    }
    
  }

  ngOnInit(): void {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    const subChildId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(viewAction.length >0){
      this.isView = true;
    }
    this.commonRoles = AppConstants
    this.getCompletedClasses();
      this.certificateForm = this.fb.group({
        text1: [''],
        image_link: ['']
      });

  }

  pageSizeChange($event: any) {
    this.studentPaginationModel.page = $event?.pageIndex + 1;
    this.studentPaginationModel.limit = $event?.pageSize;
    this.getCompletedClasses();
  }

  filterData() {
    if (this.searchTerm) {
      this.dataSource = this.dataSource?.filter(
        (item: any) => console.log(item.courseId?.title)
      );
    } else {
    }
  }
  performSearch() {
    if (this.searchTerm) {
      this.dataSource = this.dataSource?.filter(
        (item: any) => {
          const searchList = (
            item.classId.courseId?.title + item.studentId?.name
          ).toLowerCase();
          return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1;
        }
      );
    } else {
      this.getCompletedClasses();
    }
  }
  getCompletedClasses() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.classService
      .getSessionCompletedStudent(
        userId,
        this.studentPaginationModel.page,
        this.studentPaginationModel.limit
      )
      .subscribe(
        (response: { docs: any; page: any; limit: any; totalDocs: any }) => {
          this.isLoading = false;
          this.studentPaginationModel.docs = response.docs;
          this.studentPaginationModel.page = response.page;
          this.studentPaginationModel.limit = response.limit;
          this.totalItems = response.totalDocs;
          this.dataSource = response.docs;
          this.dataSource.sort = this.matSort;
          this.mapClassList();
        }
      );
  }

  getCertificates() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.classService
      .getSessionCompletedStudent(
        userId,1,
       this.studentPaginationModel.limit
      )
      .subscribe(
        (response: { docs: any; page: any; limit: any; totalDocs: any }) => {
          this.isLoading = false;
          this.studentPaginationModel.docs = response.docs;
          this.studentPaginationModel.page = response.page;
          this.studentPaginationModel.limit = response.limit;
          this.totalItems = response.totalDocs;
          this.dataSource = response.docs;
          this.dataSource.sort = this.matSort;
          this.mapClassList();
        }
      );
  }


  view(id: string) {
    this.router.navigate(['/admin/courses/student-courses/completed-courses/view-completion-list'], {
      queryParams: { id: id, status: 'completed' },
    });
  }
  mapClassList() {
    this.studentPaginationModel.docs.forEach((item: Student) => {
      const startDateArr: any = [];
      const endDateArr: any = [];
      item.classId.sessions.forEach(
        (session: {
          sessionStartDate: { toString: () => string | number | Date };
          sessionEndDate: { toString: () => string | number | Date };
        }) => {
          startDateArr.push(new Date(session.sessionStartDate.toString()));
          endDateArr.push(new Date(session.sessionEndDate.toString()));
        }
      );
      const minStartDate = new Date(Math.min.apply(null, startDateArr));
      const maxEndDate = new Date(Math.max.apply(null, endDateArr));
      item.classStartDate = !isNaN(minStartDate.valueOf())
        ? moment(minStartDate).format('YYYY-DD-MM')
        : '';
      item.classEndDate = !isNaN(maxEndDate.valueOf())
        ? moment(maxEndDate).format('YYYY-DD-MM')
        : '';
      item.registeredOn = item.registeredOn
        ? moment(item.registeredOn).format('YYYY-DD-MM')
        : '';
      item.studentId.name = `${item.studentId?.name} ${item.studentId?.last_name}`;
    });
  }

  getCurrentUserId(): string {
    return JSON.parse(localStorage.getItem('user_data')!).user.id;
  }

  complete(element: Student) {
    const item: StudentApproval = {
      approvedBy: this.getCurrentUserId(),
      approvedOn: moment().format('YYYY-MM-DD'),
      classId: element.classId._id,
      status: 'completed',
      studentId: element.studentId.id,
      session: [],
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.classService
          .saveApprovedClasses(element.id, item)
          .subscribe((response: any) => {
            Swal.fire({
              title: 'Success',
              text: 'Course approved successfully.',
              icon: 'success',
            });

            this.getCompletedClasses();
          });
        () => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
          });
        };
      }
    });
  }
  openCertificateInNewTab(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  getSessions(element: { classId: { sessions: any[] } }) {
    const sessions = element.classId?.sessions?.map((_: any, index: number) => {
      const session: Session = {} as Session;
      session.sessionNumber = index + 1;
      return session;
    });
    return sessions;
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [[[AppConstants.STUDENT_ROLE],'Email','Course',  [`${AppConstants.INSTRUCTOR_ROLE} Fee`], 'Start Date', 'End date','Registered Date','Completed Date']];
    const data = this.dataSource.map((user: any) => [
      user.studentId?.name,
      user.studentId?.email,
      user.courseId?.title,
      '$ '+user.classId?.instructorCost,
      user.classStartDate,
      user.classEndDate,
      user.registeredOn ,
     formatDate(new Date( user.updatedAt), 'yyyy-MM-dd', 'en') || '',
    ]);
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });
    doc.save('Student Completed-list.pdf');
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (user: any) => ({
        [AppConstants.STUDENT_ROLE]: user.studentId?.name,
        Email: user.studentId?.email,
        Course: user.courseId?.title,
        [`${AppConstants.INSTRUCTOR_ROLE} Fee`]:'$ '+ user.classId?.instructorCost,
        'Start Date': user.classStartDate,
        'End date': user.classEndDate,
        'Registered Date': user.registeredOn,
        'Completed Date': user.updatedAt,
        

        StartDate: user.classStartDate,
        EndDate: user.classEndDate,
      })
    );
    TableExportUtil.exportToExcel(exportData, 'Student Completed-list');
  }
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }




// Certificate preview Code 

  classId!: any;
  
  title: boolean = false;
  submitted: boolean = false;
  course: any;
  elements: any[] = [];


  
  private setBackgroundImage(imageUrl: string) {
    this.image_link = imageUrl; 
    this.backgroundTable.nativeElement.style.backgroundImage = `url(${imageUrl})`;
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(
        this.backgroundTable.nativeElement
      );
    }, 1000);
  }
  
  


imgUrl:any;

  openDialog(templateRef: any): void {
    this.certificateService.getCertificateById(this.studentData.courseId.certificate_template_id).subscribe((response: any) => {

      this.course = response;
      console.log("response===>",response)
      let imageUrl = this.course.image;
      imageUrl = imageUrl.replace(/\\/g, '/');
      imageUrl = encodeURI(imageUrl);
      this.imgUrl=imageUrl;
      // console.log("imageUrl==",this.course.image)

      this.certificateForm.patchValue({
        title: this.course.title,
      });
       // Update content based on type
      this.course.elements.forEach((element: any) => {
        if (element.type === 'UserName') {
          element.content = this.studentData.studentId?.name || 'Default Name';
        } else if (element.type === 'Course') {
          element.content = this.studentData.title || 'Default Course';
        } else if (element.type === 'Date') {
          element.content = this.studentData.updatedAt ? new Date(this.studentData.updatedAt).toLocaleDateString() : '--';
        }
      });
      this.elements = this.course.elements || [];
      this.setBackgroundImage(imageUrl);
    })
  
    this.dialogRef = this.dialog.open(templateRef, {
      width: '1000px',
      data: {   certificate:this.certificateDetails  },
    });    
}



// end of displaying the certificate 

generateCertificate(element: Student) {
  this.studentData = element;
  this.openDialog(this.certificateDialog);
  setTimeout(() => {
    this.copyPreviewToContentToConvert();
  }, 1000);
}
copyPreviewToContentToConvert() {
  const certificatePreview = document.querySelector('.certificate-preview') as HTMLElement;
  const contentToConvert = document.getElementById('contentToConvert') as HTMLElement;

  if (certificatePreview && contentToConvert) {
    contentToConvert.innerHTML = certificatePreview.innerHTML;
    contentToConvert.style.backgroundImage = certificatePreview.style.backgroundImage;
    contentToConvert.style.backgroundSize = certificatePreview.style.backgroundSize;
    contentToConvert.style.backgroundPosition = certificatePreview.style.backgroundPosition;
    contentToConvert.style.backgroundRepeat = certificatePreview.style.backgroundRepeat;
    contentToConvert.style.border = certificatePreview.style.border;

  }
}

generateCertificatePDF(): void {
  const data = document.querySelector('.certificate-preview') as HTMLElement;
  html2canvas(data, {
    scale: 2,
    useCORS: true, 
    backgroundColor: null, 
  }).then((canvas) => {
    const imgWidth = 210; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const contentDataURL = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const position = 0;
    
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

    
    const pdfBlob = pdf.output('blob');

    this.update(pdfBlob);
  });
}


update(pdfBlob: Blob) {
  Swal.fire({
    title: 'Certificate Generating...',
    text: 'Please wait...',
    allowOutsideClick: false,
    timer: 24000,
    timerProgressBar: true,
  });

  this.dafaultGenratepdf = true;
  this.copyPreviewToContentToConvert();

  var convertIdDynamic = 'contentToConvert';
  this.genratePdf3(convertIdDynamic, this.studentData?.studentId._id, this.studentData?.courseId._id, pdfBlob);

  this.dialogRef.close();
}

genratePdf3(convertIdDynamic: any, memberId: any, memberProgrmId: any, pdfBlob: Blob) {
  // console.log('convertIdDynamic - ', convertIdDynamic, 'memberId -', memberId, 'memberProgrmId', memberProgrmId);

  setTimeout(() => {
    const dashboard = document.getElementById(convertIdDynamic);
    if (dashboard != null) {
      // Upload the Blob
      const randomString = this.generateRandomString(10);
      const pdfData = new File([pdfBlob], randomString + 'courseCertificate.pdf', { type: 'application/pdf' });

      this.classService.uploadFileApi(pdfData).subscribe((data: any) => {
        let objpdf = {
          pdfurl: data.inputUrl,
          memberId: memberId,
          CourseId: memberProgrmId,
        };
        this.updateCertificte(objpdf);
      });

      this.dafaultGenratepdf = false;
    }
  }, 1000);
}

 
generateRandomString(length: number) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}


updateCertificte(objpdf: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to create certificate!',
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed) {
      this.classService.updateCertificateUser(objpdf).subscribe(
        (response) => {
          if (response.data.certifiacteUrl) {
            this.certifiacteUrl = true;
          }
          this.changeDetectorRef.detectChanges();
          this.getCertificates();
          Swal.fire({
            title: 'Updated',
            text: 'Certificate Created successfully',
            icon: 'success',
          });
        },
        (err) => {}
      );
    }
  });
}

}
