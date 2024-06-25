import { MatTableDataSource } from '@angular/material/table';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, ViewChild } from '@angular/core';
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
//import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TableElement, TableExportUtil } from '@shared';
import { jsPDF } from 'jspdf';
import DomToImage from 'dom-to-image';
import { number } from 'echarts';
import { StudentService } from '@core/service/student.service';
import { dA } from '@fullcalendar/core/internal-common';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AppConstants } from '@shared/constants/app.constants';
import { CertificateService } from '@core/service/certificate.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-completion-list',
  templateUrl: './completion-list.component.html',
  styleUrls: ['./completion-list.component.scss'],
})
export class CompletionListComponent {
  displayedColumns = [
    // 'select',
    'Student',
    'email',
    'Course',
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
  // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  commonRoles: any;
  certificateDetails: any;
  upload() {
    document.getElementById('input')?.click();
  }
  @ViewChild('backgroundTable') backgroundTable!: ElementRef;

  constructor(private classService: ClassService, public router: Router, public dialog: MatDialog,
    private certificateService: CertificateService,  private sanitizer: DomSanitizer) {
    this.studentPaginationModel = {} as StudentPaginationModel;
  }

  ngOnInit(): void {
    this.commonRoles = AppConstants
    this.getCompletedClasses();
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

        // item.classId.courseId?.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // this.getCompletedClasses();
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

        // item.classId.courseId?.title.toLowerCase().includes(this.searchTerm.toLowerCase())
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

  view(id: string) {
    this.router.navigate(['/admin/courses/view-completion-list'], {
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
              // confirmButtonColor: '#d33',
            });

            this.getCompletedClasses();
          });
        () => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
            // confirmButtonColor: '#d33',
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

  // openDialog(event: { title: any; extendedProps: { [x: string]: any; }; }) {
  //   console.log("event",event);
  //   this.dialog.open(EventDetailDialogComponent, {
  //     width: '700px',
  //     data: {
  //       title: event.title,
  //       sessionStartTime: event.extendedProps['sessionStartTime'],
  //       sessionEndTime: event.extendedProps['sessionEndTime'],
  //       courseCode: event.extendedProps['courseCode'],
  //       status: event.extendedProps['status'],
  //       sessionStartDate: event.extendedProps['sessionStartDate'],
  //       sessionEndDate: event.extendedProps['sessionEndDate'],
  //       deliveryType: event.extendedProps['deliveryType'],
  //       instructorCost: event.extendedProps['instructorCost']
  //     }
  //   });
  // }
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
    //const columnWidths = [60, 80, 40];
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];

    // Add a page to the document (optional)
    //doc.addPage();

    // Generate the table using jspdf-autotable
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });

    // Save or open the PDF
    doc.save('Student Completed-list.pdf');
  }

  exportExcel() {
    //k//ey name with space add in brackets
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
  // generateCertificate(element: Student) {
  //   Swal.fire({
  //     // title: "Updated",
  //     // text: "Course Kit updated successfully",
  //     // icon: "success",
  //     title: 'Certificate Generating...',
  //     text: 'Please wait...',
  //     allowOutsideClick: false,
  //     timer: 24000,
  //     timerProgressBar: true,
  //   });
  //   this.dafaultGenratepdf = true;
  //   this.pdfData = [];
  //   let pdfObj = {
  //     title: element?.courseId?.title,
  //     name: element?.studentId?.name,
  //     //project_week: project_week,
  //     completdDate: moment().format('DD ddd MMM YYYY'),
  //   };
  //   this.pdfData.push(pdfObj);
  //   var convertIdDynamic = 'contentToConvert';
  //   const dashboard = document.getElementById('contentToConvert');
  //   //this.generatePdf1(dashboard, element?.studentId._id, element?.courseId._id,"course");
  //   this.genratePdf3(
  //     convertIdDynamic,
  //     element?.studentId._id,
  //     element?.courseId._id
  //   );
  // }
  generateCertificate(element: Student) {
    Swal.fire({
      // title: "Updated",
      // text: "Course Kit updated successfully",
      // icon: "success",
      title: 'Certificate Generating...',
      text: 'Please wait...',
      allowOutsideClick: false,
      timer: 24000,
      timerProgressBar: true,
    });
    if(element){
      console.log("pp", element)
    this.certificateService.getCertificateById(element.courseId.certificate_template_id).subscribe((response: any) => {
    this.certificateDetails = response;
    console.log("PVK", this.certificateDetails)
    let imageUrl;
    imageUrl = response.image.replace(/\\/g, '/');
    imageUrl = encodeURI(imageUrl);
    this.setBackgroundImage(imageUrl);
 
  })
    }
       
   
    this.dafaultGenratepdf = true;
    this.pdfData = [];
    let pdfObj = {
      title: element?.courseId?.title,
      name: element?.studentId?.name,
      //project_week: project_week,
      completdDate: moment().format('DD ddd MMM YYYY'),
    };
    this.pdfData.push(pdfObj);
    var convertIdDynamic = 'contentToConvert';
    const dashboard = document.getElementById('contentToConvert');
    //this.generatePdf1(dashboard, element?.studentId._id, element?.courseId._id,"course");
    this.genratePdf3(
      convertIdDynamic,
      element?.studentId._id,
      element?.courseId._id
    );
  }
  private setBackgroundImage(imageUrl: string) {  
    this.backgroundTable.nativeElement.style.backgroundImage = `url("${imageUrl}")`;
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(this.backgroundTable.nativeElement);
    }, 1000);
  }
 
  genratePdf3(convertIdDynamic: any, memberId: any, memberProgrmId: any) {
    this.dafaultGenratepdf = true;
    setTimeout(() => {
      const dashboard = document.getElementById(convertIdDynamic);
      if (dashboard != null) {
        const dashboardHeight = dashboard.clientHeight;
        const dashboardWidth = dashboard.clientWidth;
 
        const options = {
          background: 'white',
          width: dashboardWidth,
          height: dashboardHeight,
        };
 
        DomToImage.toPng(dashboard, options).then((imgData) => {
          const doc = new jsPDF(
            dashboardWidth > dashboardHeight ? 'l' : 'p',
            'mm',
            [dashboardWidth, dashboardHeight]
          );
          const imgProps = doc.getImageProperties(imgData);
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
 
          doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          const currentDateTime = moment();
          const randomString = this.generateRandomString(10);
 
 
          const pdfData = new File(
            [doc.output('blob')],
            randomString + 'courseCertificate.pdf',
            {
              type: 'application/pdf',
            }
          );
          this.classService.uploadFileApi(pdfData).subscribe(
            (data: any) => {
              let objpdf = {
                pdfurl: data.inputUrl,
                memberId: memberId,
                CourseId: memberProgrmId,
              };
              this.updateCertificte(objpdf);
            },
            (err) => {}
          );
        });
        this.dafaultGenratepdf = false;
      }
    }, 1000);
  }
  // genratePdf3(convertIdDynamic: any, memberId: any, memberProgrmId: any) {
  //   this.dafaultGenratepdf = true;
  //   setTimeout(() => {
  //     const dashboard = document.getElementById(convertIdDynamic);
  //     if (dashboard != null) {
  //       const dashboardHeight = dashboard.clientHeight;
  //       const dashboardWidth = dashboard.clientWidth;

  //       const options = {
  //         background: 'white',
  //         width: dashboardWidth,
  //         height: dashboardHeight,
  //       };

  //       DomToImage.toPng(dashboard, options).then((imgData) => {
  //         const doc = new jsPDF(
  //           dashboardWidth > dashboardHeight ? 'l' : 'p',
  //           'mm',
  //           [dashboardWidth, dashboardHeight]
  //         );
  //         const imgProps = doc.getImageProperties(imgData);
  //         const pdfWidth = doc.internal.pageSize.getWidth();
  //         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //         doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //         const currentDateTime = moment();
  //         const randomString = this.generateRandomString(10);


  //         const pdfData = new File(
  //           [doc.output('blob')],
  //           randomString + 'courseCertificate.pdf',
  //           {
  //             type: 'application/pdf',
  //           }
  //         );
  //         this.classService.uploadFileApi(pdfData).subscribe(
  //           (data: any) => {
  //             let objpdf = {
  //               pdfurl: data.inputUrl,
  //               memberId: memberId,
  //               CourseId: memberProgrmId,
  //             };
  //             this.updateCertificte(objpdf);
  //           },
  //           (err) => {}
  //         );
  //       });
  //       this.dafaultGenratepdf = false;
  //     }
  //   }, 1000);
  // }
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

  // Example: Generate a random string of length 10

  //c//onsole.log(randomString);

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

            this.getCompletedClasses();
            //let certifiacteUrl =response.data.certifiacteUrl
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
