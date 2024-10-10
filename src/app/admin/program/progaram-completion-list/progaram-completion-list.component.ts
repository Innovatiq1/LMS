import { formatDate } from '@angular/common';
// import { Component } from '@angular/core';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Student, StudentApproval, StudentPaginationModel } from '@core/models/class.model';
import { UtilsService } from '@core/service/utils.service';
import { TableElement } from '@shared/TableElement';
import { TableExportUtil } from '@shared/tableExportUtil';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { CourseService } from '@core/service/course.service';
import { CertificateService } from '@core/service/certificate.service';
import 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import DomToImage from 'dom-to-image';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { SelectionModel } from '@angular/cdk/collections';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-progaram-completion-list',
  templateUrl: './progaram-completion-list.component.html',
  styleUrls: ['./progaram-completion-list.component.scss']
})
export class ProgaramCompletionListComponent {
  displayedColumns = [
    'select',
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
  @ViewChild('certificateDialog') certificateDialog!: TemplateRef<any>;
  @ViewChild('backgroundTable') backgroundTable!: ElementRef;
  dataSource: any;
  completionList: any;
  pageSizeArr = this.utils.pageSizeArr;
  totalItems: any;
  // studentPaginationModel: StudentPaginationModel;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  isLoading: any;
  searchTerm: string = '';
  dafaultGenratepdf: boolean = false;
  element: any;
  certificateUrl: boolean = false;
  pdfData: any = [];
  commonRoles: any;
  view = false;
  certificateTemplateId:any;
  isGeneratingCertificates:boolean=false;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
selection = new SelectionModel<any>(true, []);
selectedRows: any[] = [];
  filterName: string = '';
  userGroupIds:string = '';
  totalPages: number = 0;
  constructor(
    private classService: ClassService,
     private utils: UtilsService, 
     public dialog: MatDialog, 
     private authenService: AuthenService,
      private route :Router,
      private courseService: CourseService,
      private certificateService: CertificateService,
    ) {

      this.coursePaginationModel = {};
    // this.studentPaginationModel = {} as StudentPaginationModel;
  }

  ngOnInit(): void {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.route.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    const subChildId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions

    let viewAction = actions.filter((item:any) => item.title == 'View')
    if(viewAction.length >0){
      this.view = true;
    }
    this.commonRoles = AppConstants
    this.getCompletedClasses();
  }

  

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getCompletedClasses();
  }
  upload() {
    document.getElementById('input')?.click();
  }

  getCompletedClasses() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let filterProgram = this.filterName;
    const payload = { ...this.coursePaginationModel,title:filterProgram };
  if(this.userGroupIds){
    payload.userGroupId=this.userGroupIds
  }
    this.classService
      .getProgramsCompletedStudent(userId,payload)
      .subscribe((response: any) => {
        this.isLoading = false;
        this.dataSource = response.docs;
        this.totalPages = response.totalDocs;
        this.coursePaginationModel.docs = response.docs;
        this.coursePaginationModel.page = response.page;
        this.coursePaginationModel.limit = response.limit;
       
       
        
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
  performSearch() {
  
      this.coursePaginationModel.page = 1;
      this.paginator.pageIndex = 0;
      this.getCompletedClasses();

  }
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
  //preview Certificate 

  getCertificateTemplate(id:any){
    this.courseService.getStudentProgramClassById(id).subscribe((response: any) => {
      this.getCertificateTemplatedData(response.programId.certificate_template_id)
      
   });
  }
  course:any;
  elements:any;
  imgUrl:any;
  image_link:any;
  studentData:any;
  dialogRef: any;
  certificateDetails: any;
  getCertificateTemplatedData(id:any){
    this.certificateService.getCertificateById(id).subscribe((response: any) => {
      // console.log("get the certificate data=",response)
      this.course = response;
     
     
    })

  }
  generateCertificate(element: Student) {
    this.getCertificateTemplate(element._id)
    this.studentData = element;
    this.openDialog(this.certificateDialog);
    setTimeout(() => {
      this.copyPreviewToContentToConvert();
    }, 1000);
  }

  
  openDialog(templateRef: any): void {
    // this.certificateService.getCertificateById(this.studentData.courseId.certificate_template_id).subscribe((response: any) => {
      let imageUrl = this.course.image;
      imageUrl = imageUrl.replace(/\\/g, '/');
      imageUrl = encodeURI(imageUrl);
      this.image_link=imageUrl;
      this.course.elements.forEach((element: any) => {
        if (element.type === 'UserName') {
          element.content = this.studentData.student_name || 'Default Name';
        } else if (element.type === 'Course') {
          element.content = this.studentData.programTitle|| 'Default Course';
        } else if (element.type === 'Date') {
          element.content = this.studentData.updatedAt ? new Date(this.studentData.updatedAt).toLocaleDateString() : '--';
        }
      });
      this.elements = this.course.elements || [];
    this.dialogRef = this.dialog.open(templateRef, {
      width: '1000px',
      data: {   certificate:this.certificateDetails  },
     });    
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

    pdf.save('certificate.pdf');
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
  this.genratePdf3(convertIdDynamic, this.studentData?.studentId._id, this.studentData?.programId._id, pdfBlob);
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
      
                  this.updateCertificate(objpdf)
      
      
                }, (err) => {
                  console.log("error==",err);
      
                }
                )
      

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

openCertificateInNewTab(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
//generate bulk certificate 





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

toggleRowSelection(row: any): void  {
  this.selection.toggle(row);
  this.updateSelectedRows();
}


isAnyRowSelected(): boolean {
  return this.selection.hasValue();
}
enableMultipleCertificates() {
  if (this.selectedRows.length === 0) {
    console.log('No rows selected');
    return;
  }
  this.isGeneratingCertificates = true;
  let alreadyIssuedCount = 0;
  let successfulCount = 0;

  const promises = this.selectedRows.map((row: any) => {
    if (!row.certificate) {
      return this.generateCertificateForRow(row)
        .then(() => {
          successfulCount++;
        })
        .catch(() => {
          console.log(`Failed to generate certificate for student ID: ${row.studentId._id}`);
        });
    } else {
      alreadyIssuedCount++;
      console.log(`Certificate already issued for student ID: ${row.studentId._id}`);
      return Promise.resolve();
    }
  });

  
  Promise.all(promises).then(() => {
    this.isGeneratingCertificates = false;
    let message = `${successfulCount} certificates generated successfully!`;
    if (alreadyIssuedCount > 0) {
      message += ` ${alreadyIssuedCount} certificates were already issued and skipped.`;
    }

    Swal.fire({
      title: 'Certificate Generation',
      text: message,
      icon: successfulCount > 0 ? 'success' : 'warning',
    }).then(() => {
      this.clearSelection();
      // this.getCompletedList();
    });

  }).catch(() => {
    this.isGeneratingCertificates = false; // Stop the spinner even if there's an error
  });
}

getCertificateTemplatesResponse(id: any): Promise<any> {
  return new Promise((resolve, reject) => {
    this.courseService.getStudentProgramClassById(id).subscribe(
      (response: any) => {
        const certificateTemplateId = response.programId.certificate_template_id;
        resolve(certificateTemplateId);
      },
      (error) => {
        console.error('Error fetching certificate template ID:', error);
        reject(error);
      }
    );
  });
}
generateCertificateForRow(row: any): Promise<void> {
  return new Promise((resolve, reject) => {
    this.getCertificateTemplatesResponse(row._id).then(certificateTemplateId => {
      this.certificateService.getCertificateById(certificateTemplateId).subscribe(
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
    }).catch(error => {
      console.error('Error getting certificate template ID:', error);
      reject();
    });
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
      element.content = row.programTitle || 'Default Course';
    } else if (element.type === 'Date') {
      element.content = row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : '--';
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
             width: 800px; 
             position: relative;"
    >
      ${this.elements.map((element:any) => `
        <div 
          style="display: flex; 
                 justify-content: ${element.alignment}; 
                 position: absolute; 
                 top: ${element.top}px; 
                 left: ${element.left}px;"
        >
          <div style="font-size: ${element.fontSize}px; color: ${element.color};">
            ${element.type === 'Logo' ? `<img src="${element.imageUrl}" style="width: ${element.width}px; height: ${element.height}px;">` : ''}
           
          </div>
          <div style="font-size: ${element.fontSize}px; color: ${element.color};">
             
            ${element.type === 'Signature' ? `<img src="${element.imageUrl}" style="width: ${element.width}px; height: ${element.height}px;">` : element.content}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}




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
      }).then((canvas) => {
        const imgWidth = 210; 
        const pageHeight = 297; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

        
        if (imgHeight > pageHeight) {
          let remainingHeight = imgHeight;
          let yPosition = position;

          while (remainingHeight > 0) {
            remainingHeight -= pageHeight;
            yPosition = Math.max(yPosition + pageHeight, pageHeight);
            pdf.addPage();
            pdf.addImage(contentDataURL, 'PNG', 0, yPosition, imgWidth, imgHeight);
          }
        }

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
      }).catch((error) => {
        console.error('Error generating PDF:', error);
        reject();
      });
    }, 1000); 
  });
}


uploadGeneratedPDF(row: any, pdfBlob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const randomString = this.generateRandomString(10);
    const pdfData = new File([pdfBlob], randomString + 'courseCertificate.pdf', { type: 'application/pdf' });
    
    this.classService.uploadFileApi(pdfData).subscribe(
      (data: any) => {
        let objpdf = {
          pdfurl: data.inputUrl,
          memberId: row.studentId._id,
          CourseId: row.programId._id,
        };
        
        this.classService.updateProgramCertificateUser(objpdf).subscribe(
          () => {
            // this.getCompletedClasses();
            this.getCompletedClasses();
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
clearSelection() {
  this.selection.clear();
  this.updateSelectedRows();
}

}


