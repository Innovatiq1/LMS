//Working for generating multiple certificate
import { MatTableDataSource } from '@angular/material/table';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { AssessmentService } from '@core/service/assessment.service';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { UtilsService } from '@core/service/utils.service';
import { SettingsService } from '@core/service/settings.service';
@Component({
  selector: 'app-completion-list',
  templateUrl: './completion-list.component.html',
  styleUrls: ['./completion-list.component.scss'],
})
export class CompletionListComponent {
  displayedColumns = [
    'select',
    'Student',
    'email',
    'Course',
    'Fee Type',
    // 'Instructorfee',
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
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  pdfData: any = [];
  dafaultGenratepdf: boolean = false;
  element: any;
  certifiacteUrl: boolean = false;
  isGeneratingCertificates = false;
  dataSource: any;
  pageSizeArr = this.utils.pageSizeArr;
  totalItems: any;
  studentPaginationModel: StudentPaginationModel;
  coursePaginationModel!: Partial<CoursePaginationModel>;
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
  selection = new SelectionModel<any>(true, []);
  selectedRows: any[] = [];
  actualScore: number = 0;
  currentPercentage: number = 0;
  totalScore: number = 0;
  gradeDataset: any = [];
  gradeInfo: any = null;
  showGrade: boolean = false;

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
        'fontName',
      ],
    ],
  };
  thumbnail: any;
  studentData: any;
  dialogRef: any;
  isView = false;
  filterName: any;
  userGroupIds: any;

  upload() {
    document.getElementById('input')?.click();
  }
  @ViewChild('backgroundTable') backgroundTable!: ElementRef;
  constructor(
    private classService: ClassService,
    private changeDetectorRef: ChangeDetectorRef,
    public router: Router,
    public dialog: MatDialog,
    private certificateService: CertificateService,
    private sanitizer: DomSanitizer,
    private _activeRouter: ActivatedRoute,
    private courseService: CourseService,
    private fb: FormBuilder,
    private authenService: AuthenService,
    private assessmentService: AssessmentService,
    private SettingService: SettingsService,
    public utils: UtilsService
  ) {
    this.studentPaginationModel = {} as StudentPaginationModel;
    this.coursePaginationModel = {};
    let urlPath = this.router.url.split('/');
    this.certificateUrl = urlPath.includes('edit');
    this.isCertificate = this.certificateUrl;
    if (this.certificateUrl === true) {
      this.isCertificate = true;
    } else {
      this.isCertificate = false;
    }
  }

  ngOnInit(): void {
    const roleDetails = this.authenService.getRoleDetails()[0].menuItems;
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId = urlPath[urlPath.length - 2];
    const subChildId = urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter(
      (item: any) => item.id == childId
    );
    let subChildData = childData[0].children.filter(
      (item: any) => item.id == subChildId
    );
    let actions = subChildData[0].actions;
    let viewAction = actions.filter((item: any) => item.title == 'View');

    if (viewAction.length > 0) {
      this.isView = true;
    }
    this.commonRoles = AppConstants;
    this.getCompletedClasses();
    this.certificateForm = this.fb.group({
      text1: [''],
      image_link: [''],
    });
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getCompletedClasses();
  }

  filterData() {
    if (this.searchTerm) {
      this.dataSource = this.dataSource?.filter((item: any) =>
        console.log(item.courseId?.title)
      );
    } else {
    }
  }
  performSearch() {
    this.paginator.pageIndex = 0;
    this.coursePaginationModel.page = 1;

    this.changeDetectorRef.detectChanges();

    this.getCompletedClasses();
  }
  getCompletedClasses() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let filterProgram = this.filterName;
    const payload = { ...this.coursePaginationModel, title: filterProgram };

    if (this.userGroupIds) {
      payload.userGroupId = this.userGroupIds;
    }
    this.classService
      .getSessionsCompletedStudent(userId, payload)
      .subscribe(
        (response: { docs: any; page: any; limit: any; totalDocs: any }) => {
          // console.log("dataSourseee",response)
          this.isLoading = false;
          this.dataSource = response.docs;
          this.coursePaginationModel.docs = response.docs;
          this.coursePaginationModel.page = response.page;
          this.coursePaginationModel.limit = response.limit;
          this.totalItems = response.totalDocs;

          this.dataSource.sort = this.matSort;
          this.mapClassList();
        }
      );
  }
  getCompletedList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let limit = this.coursePaginationModel?.limit ?? 10;
    this.classService
      .getSessionCompletedStudent(userId, 1, limit)
      .subscribe(
        (response: { docs: any; page: any; limit: any; totalDocs: any }) => {
          this.isLoading = false;
          this.coursePaginationModel.docs = response.docs;
          this.coursePaginationModel.page = response.page;
          this.coursePaginationModel.limit = response.limit;
          this.totalItems = response.totalDocs;
          this.dataSource = response.docs;
          this.dataSource.sort = this.matSort;
          this.mapClassList();
        }
      );
  }

  getCertificates() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let limit = this.coursePaginationModel?.limit ?? 10;
    this.classService
      .getSessionCompletedStudent(userId, 1, limit)
      .subscribe(
        (response: { docs: any; page: any; limit: any; totalDocs: any }) => {
          this.isLoading = false;
          this.coursePaginationModel.docs = response.docs;
          this.coursePaginationModel.page = response.page;
          this.coursePaginationModel.limit = response.limit;
          this.totalItems = response.totalDocs;
          this.dataSource = response.docs;
          this.dataSource.sort = this.matSort;
          this.mapClassList();
        }
      );
  }

  view(id: string) {
    this.router.navigate(
      [
        '/admin/courses/student-courses/course-completed-courses/view-completion-list',
      ],
      {
        queryParams: { id: id, status: 'completed' },
      }
    );
  }
  mapClassList() {
    if (Array.isArray(this.coursePaginationModel?.docs)) {
      this.coursePaginationModel.docs.forEach((item: any) => {
        const startDateArr: any = [];
        const endDateArr: any = [];
        item?.classId?.sessions.forEach(
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
    const headers = [
      [
        [AppConstants.STUDENT_ROLE],
        'Email',
        'Course',
        // [`${AppConstants.INSTRUCTOR_ROLE} Fee`],
        'Start Date',
        'End date',
        'Registered Date',
        'Completed Date',
      ],
    ];
    const data = this.dataSource.map((user: any) => [
      user.studentId?.name,
      user.studentId?.email,
      user.courseId?.title,
      '$ ' + user.classId?.instructorCost,
      user.classStartDate,
      user.classEndDate,
      user.registeredOn,
      formatDate(new Date(user.updatedAt), 'yyyy-MM-dd', 'en') || '',
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
        // [`${AppConstants.INSTRUCTOR_ROLE} Fee`]:
        // '$ ' + user.classId?.instructorCost,
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
  }

  imgUrl: any;

  openDialog(templateRef: any): void {
    this.certificateService
      .getCertificateById(this.studentData.courseId.certificate_template_id)
      .subscribe((response: any) => {
        this.course = response;
        let imageUrl = this.course.image;
        imageUrl = imageUrl.replace(/\\/g, '/');
        imageUrl = encodeURI(imageUrl);
        this.imgUrl = imageUrl;
        // console.log("imageUrl==",this.course.image)

        this.certificateForm.patchValue({
          title: this.course.title,
        });
        // Update content based on type
        this.course.elements.forEach((element: any) => {
          if (element.type === 'UserName') {
            element.content =
              this.studentData.studentId?.name || 'Default Name';
          } else if (element.type === 'Course') {
            element.content =
              this.studentData.title ||
              this.studentData?.courseId?.title ||
              'Default Course';
          } else if (element.type === 'Grade' && this.showGrade === true) {
            element.content = this.gradeInfo!.grade;
          } else if (element.type === 'GPA' && this.showGrade === true) {
            element.content = this.gradeInfo!.gpa;
          } else if (element.type === 'Grade Term' && this.showGrade === true) {
            element.content = this.gradeInfo!.gradeTerm;
          } else if (element.type === 'Percentage' && this.showGrade === true) {
            element.content = this.gradeInfo.PercentageRange;
          } else if (element.type === 'Date') {
            element.content = this.studentData.updatedAt
              ? new Date(this.studentData.updatedAt).toLocaleDateString()
              : '--';
          }
        });
        this.elements = this.course.elements || [];
        this.setBackgroundImage(imageUrl);
      });

    this.dialogRef = this.dialog.open(templateRef, {
      width: '1000px',
      data: { certificate: this.certificateDetails },
    });
  }

  // end of displaying the certificate

  generateCertificate(element: Student) {
    this.studentData = element;

    this.actualScore = this.studentData.assessmentanswers.score;
    this.totalScore = this.studentData.assessmentanswers.totalScore;
    this.GradeCalculate();
    this.openDialog(this.certificateDialog);
    setTimeout(() => {
      this.copyPreviewToContentToConvert();
    }, 1000);
  }
  copyPreviewToContentToConvert() {
    const certificatePreview = document.querySelector(
      '.certificate-preview'
    ) as HTMLElement;
    const contentToConvert = document.getElementById(
      'contentToConvert'
    ) as HTMLElement;

    if (certificatePreview && contentToConvert) {
      contentToConvert.innerHTML = certificatePreview.innerHTML;
      contentToConvert.style.backgroundImage =
        certificatePreview.style.backgroundImage;
      contentToConvert.style.backgroundSize =
        certificatePreview.style.backgroundSize;
      contentToConvert.style.backgroundPosition =
        certificatePreview.style.backgroundPosition;
      contentToConvert.style.backgroundRepeat =
        certificatePreview.style.backgroundRepeat;
      contentToConvert.style.border = certificatePreview.style.border;
    }
  }

  GradeCalculate() {
    let calculatePercent = (this.actualScore / this.totalScore) * 100;
    this.currentPercentage = Number.isNaN(calculatePercent)
      ? 0
      : Math.floor(calculatePercent);

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
          }
          this.showGrade = true;
        } else {
          this.showGrade = false;
        }
      },
      error: (err) => {},
    });
  }

  // generateCertificatePDF(): void {
  //   const data = document.querySelector('.certificate-preview') as HTMLElement;
  //   html2canvas(data, {
  //     scale: 3,
  //     useCORS: true,
  //     backgroundColor: null,
  //   }).then((canvas) => {
  //     const imgWidth = 210;
  //     const pageHeight=297;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     const contentDataURL = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const position = 0;

  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

  //     if (imgHeight > pageHeight) {
  //       let remainingHeight = imgHeight;
  //       let yPosition = position;

  //       while (remainingHeight > 0) {
  //         remainingHeight -= pageHeight;
  //         yPosition = Math.max(yPosition + pageHeight, pageHeight);
  //         pdf.addPage();
  //         pdf.addImage(contentDataURL, 'PNG', 0, yPosition, imgWidth, imgHeight);
  //       }
  //     }

  //     pdf.save('certificate.pdf')
  //     // const pdfBlob = pdf.output('blob');

  //     // this.update(pdfBlob);
  //     this.dialogRef.close();
  //   });
  // }
  generateCertificatePDF(): void {
    const data = document.querySelector('.certificate-preview') as HTMLElement;

    html2canvas(data, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
    }).then((canvas) => {
      const imgWidth = 216;
      const pageHeight = 279;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', [216, imgHeight]);
      const position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      if (imgHeight > pageHeight) {
        let remainingHeight = imgHeight;
        let yPosition = position;

        while (remainingHeight > 0) {
          remainingHeight -= pageHeight;
          yPosition = Math.max(yPosition + pageHeight, pageHeight);
          pdf.addPage();
          pdf.addImage(
            contentDataURL,
            'PNG',
            0,
            yPosition,
            imgWidth,
            imgHeight
          );
        }
      }

      // pdf.save('certificate.pdf');
      const pdfBlob = pdf.output('blob');

      this.update(pdfBlob);
      this.dialogRef.close();
    });
  }

  // update(pdfBlob: Blob) {
  //   Swal.fire({
  //     title: 'Certificate Generating...',
  //     text: 'Please wait...',
  //     allowOutsideClick: false,
  //     timer: 24000,
  //     timerProgressBar: true,
  //   });

  //   this.dafaultGenratepdf = true;
  //   this.copyPreviewToContentToConvert();

  //   var convertIdDynamic = 'contentToConvert';
  //   this.genratePdf3(
  //     convertIdDynamic,
  //     this.studentData?.studentId._id,
  //     this.studentData?.courseId._id,
  //     pdfBlob
  //   );

  //   this.dialogRef.close();
  // }

  update(pdfBlob: Blob) {
    let countdown = 60;

    Swal.fire({
      title: 'Certificate Generating...',
      html: `<p>Please wait...<br>Time remaining: <strong>${countdown}</strong> seconds</p>`,
      allowOutsideClick: false,
      timer: countdown * 1000,
      timerProgressBar: true,
      didOpen: () => {
        const content = Swal.getHtmlContainer();
        const countdownElement = content?.querySelector('strong');

        // Update countdown every second
        const interval = setInterval(() => {
          countdown--;
          if (countdownElement) {
            countdownElement.textContent = `${countdown}`;
          }
          // Stop interval when countdown reaches zero
          if (countdown <= 0) {
            clearInterval(interval);
          }
        }, 1000);
      },
    });
    this.dafaultGenratepdf = true;
    this.copyPreviewToContentToConvert();

    const convertIdDynamic = 'contentToConvert';
    this.genratePdf3(
      convertIdDynamic,
      this.studentData?.studentId._id,
      this.studentData?.courseId._id,
      pdfBlob
    );

    this.dialogRef.close();
  }

  genratePdf3(
    convertIdDynamic: any,
    memberId: any,
    memberProgrmId: any,
    pdfBlob: Blob
  ) {
    // console.log('convertIdDynamic - ', convertIdDynamic, 'memberId -', memberId, 'memberProgrmId', memberProgrmId);

    setTimeout(() => {
      const dashboard = document.getElementById(convertIdDynamic);
      if (dashboard != null) {
        // Upload the Blob
        const randomString = this.generateRandomString(10);
        const pdfData = new File(
          [pdfBlob],
          randomString + 'courseCertificate.pdf',
          { type: 'application/pdf' }
        );

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
    }, 10000);
  }

  generateRandomString(length: number) {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: CourseModel) =>
          this.selection.select(row)
        );
  }

  updateSelectedRows() {
    this.selectedRows = this.selection.selected;
  }

  toggleRowSelection(row: any): void {
    this.selection.toggle(row);
    this.updateSelectedRows();
  }

  isAnyRowSelected(): boolean {
    return this.selection.hasValue();
  }

  //   enableMultipleCertificates() {
  //   if (this.selectedRows.length === 0) {
  //     return;
  //   }

  //   // Show confirmation popup before starting the countdown
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you want to generate certificates for the selected students?',
  //     icon: 'warning',
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No',
  //     showCancelButton: true,
  //     cancelButtonColor: '#d33',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // User confirmed, start countdown and certificate generation
  //       let countdown = 90; // Countdown time in seconds

  //       Swal.fire({
  //         title: 'Certificate Generating...',
  //         html: `<p>Please wait...<br>Time remaining: <strong>${countdown}</strong> seconds</p>`,
  //         allowOutsideClick: false,
  //         timer: countdown * 1000,
  //         timerProgressBar: true,
  //         didOpen: () => {
  //           const content = Swal.getHtmlContainer();
  //           const countdownElement = content?.querySelector('strong');

  //           // Start countdown timer
  //           const interval = setInterval(() => {
  //             countdown--;
  //             if (countdownElement) {
  //               countdownElement.textContent = `${countdown}`;
  //             }
  //             if (countdown <= 0) {
  //               clearInterval(interval);
  //             }
  //           }, 1000);
  //         },
  //       });

  //       this.isGeneratingCertificates = true;
  //       let alreadyIssuedCount = 0;
  //       let successfulCount = 0;

  //       const promises = this.selectedRows.map((row: any) => {
  //         if (!row.certificate) {
  //           return this.generateCertificateForRow(row)
  //             .then(() => {
  //               successfulCount++;
  //             })
  //             .catch(() => {
  //               console.log(`Failed to generate certificate for student ID: ${row.studentId._id}`);
  //             });
  //         } else {
  //           alreadyIssuedCount++;
  //           console.log(`Certificate already issued for student ID: ${row.studentId._id}`);
  //           return Promise.resolve();
  //         }
  //       });

  //       Promise.all(promises)
  //         .then(() => {
  //           this.isGeneratingCertificates = false;
  //           const certificate = successfulCount > 1 ? 'certificates' : 'certificate';
  //           let message = '';
  //           if (successfulCount > 0) {
  //             message = `${successfulCount} ${certificate} generated successfully!`;
  //           }

  //           if (alreadyIssuedCount > 0) {
  //             const alreadyCount = alreadyIssuedCount > 1 ? 'certificates are ' : 'certificate is';
  //             const text = successfulCount > 0 ? 'For other' : '';
  //             message += ` ${text} selected course ${alreadyCount} already Issued`;
  //           }

  //           Swal.fire({
  //             title: 'Certificate Generation',
  //             text: message,
  //             icon: successfulCount > 0 ? 'success' : 'warning',
  //           }).then(() => {
  //             this.clearSelection();
  //             this.getCompletedList();
  //           });
  //         })
  //         .catch(() => {
  //           this.isGeneratingCertificates = false; // Stop the spinner even if there's an error
  //         });
  //     }
  //   });
  // }

  enableMultipleCertificates() {
    if (this.selectedRows.length === 0) {
      return;
    }

    let countdown = 60;

    const SwalInstance = Swal.fire({
      title: 'Certificate Generating...',
      html: `<p>Please wait...<br>Time remaining: <strong>${countdown}</strong> seconds</p>`,
      allowOutsideClick: false,
      timer: countdown * 1000,
      timerProgressBar: true,
      didOpen: () => {
        const content = Swal.getHtmlContainer();
        const countdownElement = content?.querySelector('strong');
        const interval = setInterval(() => {
          countdown--;
          if (countdownElement) {
            countdownElement.textContent = `${countdown}`;
          }
          if (countdown <= 0) {
            clearInterval(interval);
          }
        }, 1000);
      },
    });

    let alreadyIssuedCount = 0;
    let successfulCount = 0;

    const promises = this.selectedRows.map((row: any) => {
      if (!row.certificate) {
        return this.generateCertificateForRow(row)
          .then(() => {
            successfulCount++;
          })
          .catch(() => {
            console.log(
              `Failed to generate certificate for student ID: ${row.studentId._id}`
            );
          });
      } else {
        alreadyIssuedCount++;
        console.log(
          `Certificate already issued for student ID: ${row.studentId._id}`
        );
        return Promise.resolve();
      }
    });

    Promise.all(promises)
      .then(() => {
        Swal.close();

        const certificate =
          successfulCount > 1 ? 'certificates' : 'certificate';
        let message = '';
        if (successfulCount > 0) {
          message = `${successfulCount} ${certificate} generated successfully!`;
        }

        if (alreadyIssuedCount > 0) {
          const alreadyCount =
            alreadyIssuedCount > 1 ? 'certificates are ' : 'certificate is';
          const text = successfulCount > 0 ? 'For other' : '';
          message += ` ${text} selected course ${alreadyCount} already Issued`;
        }

        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to generate certificates for the selected students?',
          icon: 'warning',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Certificate Generation',
              text: message,
              icon: successfulCount > 0 ? 'success' : 'warning',
            }).then(() => {
              this.clearSelection();
              this.getCompletedList();
            });
          } else {
            Swal.fire('Cancelled', 'No certificates were generated.', 'info');
          }
        });
      })
      .catch(() => {
        this.isGeneratingCertificates = false;
        Swal.fire(
          'Error',
          'Failed to generate some certificates. Please try again.',
          'error'
        );
      });
  }

  generateCertificateForRow(row: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.certificateService
        .getCertificateById(row.courseId.certificate_template_id)
        .subscribe(
          (response: any) => {
            this.course = response;
            this.updateCertificateElements(row);
            const uniqueContainerId = `hidden-certificate-preview-${row.id}`;
            this.renderHiddenCertificatePreview(uniqueContainerId);
            this.generatePDFForRow(row, uniqueContainerId)
              .then(resolve)
              .catch(reject);
          },
          (error) => {
            console.error('Error fetching certificate template:', error);
            reject();
          }
        );
    });
  }

  updateCertificateElements(row: any) {
    let imageUrl = this.course.image;
    imageUrl = imageUrl.replace(/\\/g, '/');
    imageUrl = encodeURI(imageUrl);
    this.imgUrl = imageUrl;
    this.image_link = imageUrl;

    this.course.elements.forEach((element: any) => {
      if (element.type === 'UserName') {
        element.content = row.studentId?.name || 'Default Name';
      } else if (element.type === 'Course') {
        element.content = row.courseId.title || 'Default Course';
      } else if (element.type === 'Date') {
        element.content = row.updatedAt
          ? new Date(row.updatedAt).toLocaleDateString()
          : '--';
      }
      //  else if (element.type === 'Signature') {
      //   element.imageUrl = row.signatureUrl || 'default-signature.png'; // Assuming `signatureUrl` is a field in the row
      // }
    });

    this.elements = [...this.course.elements];
  }

  renderHiddenCertificatePreview(uniqueContainerId: string) {
    const hiddenContainer = document.createElement('div');
    hiddenContainer.id = uniqueContainerId;
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.top = '-9999px';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.classList.add('hidden-certificate-preview');

    document.body.appendChild(hiddenContainer);

    hiddenContainer.innerHTML = `
    <div
      class="certificate-canvas"
      style="background-image: url('${this.image_link}'); 
             margin: 0 auto; 
             background-repeat: no-repeat; 
             background-position: center right; 
             background-size: 100% 100%; 
             border: 0.5px solid lightgray; 
             height: 700px; 
             width: 700px; 
             position: relative;"
    >
      ${this.elements
        .map(
          (element) => `
        <div 
          style="display: flex; 
                 justify-content: ${element.alignment}; 
                 position: absolute; 
                 top: ${element.top}px; 
                 left: ${element.left + 15}px;
                 font-family: ${element.fontStyle}
                 "
        >
          <div style="font-size: ${element.fontSize}px; color: ${
            element.color
          };">
            ${
              element.type === 'Logo'
                ? `<img src="${element.imageUrl}" style="max-width: ${element.width}px; height: ${element.height}px;">`
                : ''
            }
           
          </div>
          <div style="font-size: ${element.fontSize}px; color: ${
            element.color
          };">
             
            ${
              element.type === 'Signature'
                ? `<img src="${element.imageUrl}" style="max-width: ${element.width}px; height: auto">`
                : element.content
            }
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;
  }

  // generatePDFForRow(row: any, containerId: string): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       const data = document.getElementById(containerId) as HTMLElement;

  //       if (!data) {
  //         console.error('Certificate preview element not found');
  //         reject();
  //         return;
  //       }

  //       html2canvas(data, {
  //         scale: 3,
  //         useCORS: true,
  //         backgroundColor: null,
  //       }).then((canvas) => {
  //         const imgWidth = 210;
  //         const pageHeight = 297;
  //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //         const contentDataURL = canvas.toDataURL('image/png');

  //         const pdf = new jsPDF('p', 'mm', 'a4');
  //         const position = 0;

  //         pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

  //         if (imgHeight > pageHeight) {
  //           let remainingHeight = imgHeight;
  //           let yPosition = position;

  //           while (remainingHeight > 0) {
  //             remainingHeight -= pageHeight;
  //             yPosition = Math.max(yPosition + pageHeight, pageHeight);
  //             pdf.addPage();
  //             pdf.addImage(contentDataURL, 'PNG', 0, yPosition, imgWidth, imgHeight);
  //           }
  //         }
  //         //  pdf.save('certificate.pdf');

  //         const pdfBlob = pdf.output('blob');

  //         this.uploadGeneratedPDF(row, pdfBlob)
  //           .then(() => {
  //             document.body.removeChild(data);
  //             resolve();
  //           })
  //           .catch((error) => {
  //             document.body.removeChild(data);
  //             reject();
  //           });
  //       }).catch((error) => {
  //         console.error('Error generating PDF:', error);
  //         reject();
  //       });
  //     }, 1000);
  //   });
  // }
  generatePDFForRow(row: any, containerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = document.getElementById(containerId) as HTMLElement;

        if (!data) {
          console.error('Certificate preview element not found');
          reject();
          return;
        }

        html2canvas(data, {
          scale: 3,
          useCORS: true,
          backgroundColor: null,
        })
          .then((canvas) => {
            const imgWidth = 216;
            const pageHeight = 279;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const contentDataURL = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', [216, imgHeight]);
            const position = 0;

            pdf.addImage(
              contentDataURL,
              'PNG',
              0,
              position,
              imgWidth,
              imgHeight
            );

            if (imgHeight > pageHeight) {
              let remainingHeight = imgHeight;
              let yPosition = position;

              while (remainingHeight > 0) {
                remainingHeight -= pageHeight;
                yPosition = Math.max(yPosition + pageHeight, pageHeight);
                pdf.addPage();
                pdf.addImage(
                  contentDataURL,
                  'PNG',
                  0,
                  yPosition,
                  imgWidth,
                  imgHeight
                );
              }
            }
            // If you want to save the file locally for testing, uncomment this line
            //  pdf.save('certificate.pdf');

            const pdfBlob = pdf.output('blob');

            this.uploadGeneratedPDF(row, pdfBlob)
              .then(() => {
                document.body.removeChild(data);
                resolve();
              })
              .catch((error) => {
                document.body.removeChild(data);
                reject();
              });
          })
          .catch((error) => {
            console.error('Error generating PDF:', error);
            reject();
          });
      }, 10000);
    });
  }

  uploadGeneratedPDF(row: any, pdfBlob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const randomString = this.generateRandomString(10);
      const pdfData = new File(
        [pdfBlob],
        randomString + 'courseCertificate.pdf',
        { type: 'application/pdf' }
      );

      this.classService.uploadFileApi(pdfData).subscribe(
        (data: any) => {
          let objpdf = {
            pdfurl: data.inputUrl,
            memberId: row.studentId._id,
            CourseId: row.courseId._id,
          };

          this.classService.updateCertificateUser(objpdf).subscribe(
            () => {
              // this.getCompletedClasses();
              resolve();
            },
            (err) => {
              console.error('Error updating certificate:', err);
              reject();
            }
          );
        },
        (err) => {
          console.error('Error uploading PDF:', err);
          reject();
        }
      );
    });
  }

  // enableExam() {
  //   if (this.selectedRows.length === 0) {
  //     console.log('No rows selected');
  //     return;
  //   }

  //   let examAlreadyAssigned = false;

  //   this.selectedRows.forEach((row: any) => {
  //     if (row.isExamAssigned || row.examassessmentanswers?.answers?.length === 0) {
  //       examAlreadyAssigned = true;
  //     }
  //   });
  //   if (examAlreadyAssigned) {
  //     Swal.fire({
  //       title: 'Warning',
  //       text: 'Exam already enabled for one or more selected records.',
  //       icon: 'warning'
  //     });
  //     return;
  //   }

  //   this.selectedRows.forEach((row: any) => {
  //     const isExamAssessmentEmpty = Object.keys(row.examassessmentanswers).length === 0;

  //     if (isExamAssessmentEmpty && row.assessmentanswers && !row.isExamAssigned) {
  //       const studentClassId = row._id;
  //       const studentId = row.studentId._id;
  //       const examAssessmentId = row.courseId.exam_assessment;
  //       const assessmentAnswerId = row.assessmentanswers.id;
  //       const courseId = row.courseId._id;
  //       let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;

  //       const requestBody = {
  //         studentId,
  //         examAssessmentId,
  //         assessmentAnswerId,
  //         studentClassId,
  //         companyId,
  //         courseId
  //       };

  //       this.assessmentService.assignExamAssessment(requestBody).subscribe(
  //         (response: any) => {
  //           Swal.fire({
  //             title: 'Assigned!',
  //             text: 'Exam Assigned Successfully!',
  //             icon: 'success'
  //           });
  //           this.clearSelection();
  //         }
  //       );
  //     } else {
  //       // console.log(`Exam not enabled for row with student ID: ${row.studentId._id} - Conditions not met.`);
  //       Swal.fire({
  //         title: 'Warning',
  //         text: 'The exam is already enabled for selected courses.',
  //         icon: 'warning'
  //       });
  //       return;
  //     }
  //   });

  // }
  enableExam() {
    if (this.selectedRows.length === 0) {
      return;
    }

    let examsEnabledCount = 0;
    let alreadyAssignedCount = 0;

    const promises = this.selectedRows.map((row: any) => {
      const isExamAssessmentEmpty =
        Object.keys(row.examassessmentanswers || {}).length === 0;
      if (
        row.isExamAssigned ||
        row.examassessmentanswers?.answers?.length === 0
      ) {
        alreadyAssignedCount++;
        return Promise.resolve();
      }

      if (
        isExamAssessmentEmpty &&
        row.assessmentanswers &&
        !row.isExamAssigned
      ) {
        const studentClassId = row._id;
        const studentId = row.studentId._id;
        const examAssessmentId = row.courseId.exam_assessment;
        const assessmentAnswerId = row.assessmentanswers.id;
        const courseId = row.courseId._id;
        let companyId = JSON.parse(localStorage.getItem('user_data')!).user
          .companyId;

        const requestBody = {
          studentId,
          examAssessmentId,
          assessmentAnswerId,
          studentClassId,
          companyId,
          courseId,
        };

        return this.assessmentService
          .assignExamAssessment(requestBody)
          .toPromise()
          .then(() => {
            examsEnabledCount++;
          })
          .catch((error) => {
            console.log('Failed to assign exam for row:', row, error);
          });
      } else {
        alreadyAssignedCount++;
        return Promise.resolve();
      }
    });

    Promise.all(promises)
      .then(() => {
        let message = '';
        if (examsEnabledCount > 0) {
          const enabledText = examsEnabledCount > 1 ? 'exams' : 'exam';
          message += `${examsEnabledCount} ${enabledText} enabled successfully! `;
        }

        if (alreadyAssignedCount > 0) {
          const alreadyText =
            alreadyAssignedCount > 1 ? 'exams are' : 'exam is';
          message += `${
            examsEnabledCount > 0 ? 'For other' : ''
          } selected ${alreadyText} already enabled.`;
        }

        Swal.fire({
          title: 'Enable Exams',
          text: message,
          icon: examsEnabledCount > 0 ? 'success' : 'warning',
        }).then(() => {
          this.clearSelection();
          this.getCompletedList();
        });
      })
      .catch((error) => {
        console.log('Error enabling exams:', error);
        Swal.fire({
          title: 'Error',
          text: 'There was an error enabling exams.',
          icon: 'error',
        });
      });
  }

  clearSelection() {
    this.selection.clear();
    this.updateSelectedRows();
  }

  evaluateRow(row: any, isEdit: boolean) {
    console.log('Evaluating row:', row, 'isEdit:', isEdit);
    this.router.navigate(['/admin/courses/manual-evaluation'], {
      queryParams: {
        id: row?._id,
        isEdit: isEdit,
      },
    });
  }
}
