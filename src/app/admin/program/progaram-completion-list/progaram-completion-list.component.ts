import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { Student, StudentApproval, StudentPaginationModel } from '@core/models/class.model';
import { UtilsService } from '@core/service/utils.service';
import { TableElement } from '@shared/TableElement';
import { TableExportUtil } from '@shared/tableExportUtil';
import { ClassService } from 'app/admin/schedule-class/class.service';
import 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import DomToImage from 'dom-to-image';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-progaram-completion-list',
  templateUrl: './progaram-completion-list.component.html',
  styleUrls: ['./progaram-completion-list.component.scss']
})
export class ProgaramCompletionListComponent {
  displayedColumns = [
    // 'select',
    'Student Name',
    'email',
    'Program Name',
    'Class Start Date',
    'Class End Date',
    'Registered Date',
    'Completed Date',
    'actions',
    'view'
  ];
  breadscrums = [
    {
      items: ['Registered Program'],
      active: 'Completed Program',
    },
  ];
  dataSource: any;
  completionList: any;
  pageSizeArr = this.utils.pageSizeArr;
  totalItems: any;
  studentPaginationModel: StudentPaginationModel;
  isLoading: any;
  searchTerm: string = '';
  dafaultGenratepdf: boolean = false;
  element: any;
  certificateUrl: boolean = false;
  pdfData: any = [];
  commonRoles: any;


  constructor(private classService: ClassService, private utils: UtilsService, public dialog: MatDialog) {


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
  upload() {
    document.getElementById('input')?.click();
  }

  getCompletedClasses() {
    this.classService
      .getProgramCompletedStudent(this.studentPaginationModel.page, this.studentPaginationModel.limit)
      .subscribe((response: { docs: any; page: any; limit: any; totalDocs: any; }) => {
        this.isLoading = false;
        this.studentPaginationModel.docs = response.docs;
        this.studentPaginationModel.page = response.page;
        this.studentPaginationModel.limit = response.limit;
        this.totalItems = response.totalDocs;
        this.dataSource = response.docs;
        console.log("dataSource: ", this.dataSource);
      })
  }
  getCurrentUserId(): string {
    return JSON.parse(localStorage.getItem("user_data")!).user.id;
  }

  changeStatus(element: Student) {
    let item: StudentApproval = {
      approvedBy: this.getCurrentUserId(),
      approvedOn: moment().format("YYYY-MM-DD"),
      classId: element.classId._id,
      status: "completed",
      studentId: element.studentId.id,
      session: []
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this program!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.classService.saveApprovedProgramClasses(element.id, item).subscribe((response: any) => {
          Swal.fire({
            title: 'Success',
            text: 'Program approved successfully.',
            icon: 'success',
            // confirmButtonColor: '#526D82',
          });

          this.getCompletedClasses();
        });
        () => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
            // confirmButtonColor: '#526D82',
          });
        };
      }
    });


  }
  performSearch() {
    if (this.searchTerm) {
      this.dataSource = this.dataSource?.filter((item: any) => {
        const searchList = (item.program_name + item.studentId?.name).toLowerCase()
        return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1
      }


        // item.classId.courseId?.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.getCompletedClasses();

    }
  }
  // exportExcel() {
  //   //k//ey name with space add in brackets
  //  const exportData: Partial<TableElement>[] =
  //     this.dataSource.map((x: { program_name: any; student_name: any; classStartDate: string | number | Date; classEndDate: string | number | Date; registeredOn: string | number | Date; })=>({
  //       "Program Name": x.program_name,
  //       "Student Name": x.student_name,
  //       'Class Start Date': formatDate(new Date(x.classStartDate), 'yyyy-MM-dd', 'en') || '',
  //       'Class End Date': formatDate(new Date(x.classEndDate), 'yyyy-MM-dd', 'en') || '',
  //       'Registered Date': formatDate(new Date(x.registeredOn), 'yyyy-MM-dd', 'en') || '',
  //     }));

  //   TableExportUtil.exportToExcel(exportData, 'excel');
  // }
  generateCertificate(element: Student) {
    Swal.fire({
      title: 'Certificate Generating...',
      text: 'Please wait...',
      allowOutsideClick: false,
      timer: 40000,
      timerProgressBar: true,
    });
    this.dafaultGenratepdf = true;
    this.pdfData = [];
    let pdfObj = {
      title: element?.programId?.title,
      name: element?.studentId
        ?.name,
      completdDate: moment().format('DD ddd MMM YYYY'),
    }
    this.pdfData.push(pdfObj);
    var convertIdDynamic = 'contentToConvert'
    const dashboard = document.getElementById('contentToConvert');
    this.genratePdf3(convertIdDynamic, element?.studentId._id, element?.programId._id);
  }

  genratePdf3(convertIdDynamic: any, memberId: any, memberProgrmId: any) {
    this.dafaultGenratepdf = true;
    setTimeout(() => {
      const dashboard = document.getElementById(convertIdDynamic);
      if (dashboard != null) {
        const dashboardHeight = dashboard.clientHeight;
        const dashboardWidth = dashboard.clientWidth;
        const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };
        DomToImage.toPng(dashboard, options).then((imgData) => {
          const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
          const imgProps = doc.getImageProperties(imgData);
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          const currentDateTime = moment();
          const randomString = this.generateRandomString(10);
          const pdfData = new File([doc.output("blob")], randomString + "programCertificate.pdf", {
            type: "application/pdf",
          });

          this.classService.uploadFileApi(pdfData).subscribe((data: any) => {
            let objpdf = {
              pdfurl: data.inputUrl,
              memberId: memberId,
              CourseId: memberProgrmId,
            };

            this.updateCertificate(objpdf)


          }, (err) => {

          }
          )
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

  openCertificateInNewTab(url: string) {
    console.log(url);
    if (url) {
      window.open(url, '_blank');
    }
  }
  updateCertificate(objpdf: any) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create certificate!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.classService.updateProgramCertificateUser(objpdf).subscribe(
          (response) => {
            if (response.data.certificateUrl) {
              this.certificateUrl = true
            }

            this.getCompletedClasses();
            Swal.fire({
              title: "Updated",
              text: "Certificate Created successfully",
              icon: "success",
            });

          },
          (err) => {

          },
        )
      }
    });


  }

  // generatePdf() {
  //   const doc = new jsPDF();
  //   const headers = [['Program Name', 'Student Name', 'Class Start Date','Class End Date','Registered Date']];
  //   const data = this.dataSource.map((user: {
  //     program_name: any; student_name: any; classStartDate: any; classEndDate: any; registeredOn: any;
  //   }, index: any) => [user.program_name, user.student_name,

  //     formatDate(new Date(user.classStartDate), 'yyyy-MM-dd', 'en') || '',
  //     formatDate(new Date(user.classEndDate), 'yyyy-MM-dd', 'en') || '',
  //     formatDate(new Date(user.registeredOn), 'yyyy-MM-dd', 'en') || '',


  //   ]);
  //   //const columnWidths = [60, 80, 40];
  //   const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
  //   (doc as any).autoTable({
  //     head: headers,
  //     body: data,
  //     startY: 20,



  //   });
  //   doc.save('student-completion.pdf');
  // }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [[[AppConstants.STUDENT_ROLE], 'Email', 'Program', 'Start Date', 'End Date', 'Completed Date','Actions']];
    // Map status values to desired strings
    const mapStatus = (status: string): string => {
      if (status === 'active') {
        return 'approved';
      } else if (status === 'inactive') {
        return 'pending';
      } else {
        return status;
      }
    };
    const data = this.dataSource.map((user: any) =>
      [
        user?.student_name,
        user?.email,
        user?.programTitle,
        formatDate(new Date(user?.classId?.sessions[0]?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        formatDate(new Date(user?.classId?.sessions[0]?.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
        formatDate(new Date(user?.updatedAt), 'yyyy-MM-dd', 'en') || '',
        'Certificate Issued'


      ]);
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
    });
    doc.save('Student Completed-programs-list.pdf');
  }
  exportExcel() {
    
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.map((user: any) => ({
        [AppConstants.STUDENT_ROLE] : user?.student_name,
        'Email': user?.email,
        'Program': user?.programTitle,
        'Start Date': formatDate(new Date(user?.classId?.sessions[0]?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        'End Date': formatDate(new Date(user?.classId?.sessions[0]?.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
        'Completed Date': formatDate(new Date(user?.updatedAt), 'yyyy-MM-dd', 'en') || '',
        'Actions': 'Certificate Issued'
      }));

    TableExportUtil.exportToExcel(exportData, 'Student Completed-programs-list');
  }


}
