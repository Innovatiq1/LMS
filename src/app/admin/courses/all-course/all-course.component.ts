/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import {
  CoursePaginationModel,
  MainCategory,
  SubCategory,
} from '@core/models/course.model';
import Swal from 'sweetalert2';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from '@core/service/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';
import * as XLSX from 'xlsx';

import * as JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
@Component({
  selector: 'app-all-course',
  templateUrl: './all-course.component.html',
  styleUrls: ['./all-course.component.scss'],
})
export class AllCourseComponent {
  breadscrums = [
    {
      title: 'Course List',
      items: ['Course'],
      active: 'Course List',
    },
  ];
  displayedColumns = [
    'name',
    'status',
    'code',
    'creator',
    // 'Fee Type',
    'Days',
    'Training Hours',
    'Fee Type',
    'startDate',
    'endDate',
    'Vendor',
    'Users',
    'Fees',
  ];
  // displayedColumns = [
  //   'name',
  //   'code',
  //   'Days',
  //   'Training Hours',
  //   'Fees',
  //   'Vendor',
  //   'status'
  // ];
  coursePaginationModel: Partial<CoursePaginationModel>;
  courseData: any;
  pagination: any;
  totalItems: any;
  pageSizeArr = [10, 25, 50, 100];
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  dataSource: any;
  searchTerm: string = '';
  path: any;
  isCourse = false;
  isCreator = false;
  selection = new SelectionModel<MainCategory>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isFilter = false;
  // programData: any;
  titles: string[] = [];
  codes: string[] = [];
  creator: string[] = [];
  duration: string[] = [];
  startDate: string[] = [];
  endDate: string[] = [];
  status: string[] = [];
  courseList: any;
  selectedCourses: any = [];
  limit: any = 10;
  filter = false;
  vendors: any;
  selectedVendors: any = [];
  selectedStatus: any = [];
  users: any;
  selectedCreators: any = [];
  filterForm: FormGroup;
  commonRoles: any;
  create = false;
  view = false;
  private showAlert = false;

  constructor(
    public _courseService: CourseService,
    private route: Router,
    private classService: ClassService,
    private userService: UserService,
    private fb: FormBuilder,
    private authenService: AuthenService,
    private courseService: CourseService,
  ) {
    // constructor
    this.coursePaginationModel = { limit: 10 };
    let urlPath = this.route.url.split('/');
    // this.editUrl = urlPath.includes('edit-program');
    this.path = urlPath[urlPath.length - 1];
    this.filterForm = this.fb.group({
      course: ['', []],
      creator: ['', []],
      // startDate: ['', []],
      // endDate: ['', []],
      status: ['', []],
      vendor: ['', []],
    });

    if (this.path == 'course') {
      this.isCourse = true;
      this.displayedColumns = [
        'name',
        'status',
        'code',
        'creator',
        'Fee Type',
        'Days',
        'Training Hours',
      //  'Fees',
        'startDate',
        'endDate',
        'Vendor',
        'Users',
        'Fees',
      ];
    }
    if (this.path == 'creator') {
      this.isCreator = true;
      this.displayedColumns = [
        'creator',
        'status',
        'name',
        'code',
        'Fee Type',
        'Days',
        'Training Hours',
        // 'Fees',
        'startDate',
        'endDate',
        'Vendor',
        'Users',
        'Fees',
      ];
    }
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.route.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    const subChildId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(createAction.length > 0){
      this.create = true
    }
    if(viewAction.length >0){
      this.view = true;
    }
    this.getAllCourses();
    this.getAllVendorsAndUsers();
    forkJoin({
      courses: this.classService.getAllCourses(),
    }).subscribe((response) => {
      this.courseList = response.courses.reverse();
    });
    this.commonRoles = AppConstants
  }

  getAllVendorsAndUsers() {
    this._courseService.getVendor().subscribe((response: any) => {
      this.vendors = response.reverse();
    });
    this.userService.getAllUsers().subscribe((response: any) => {
      this.users = response?.results;
    });
  }

  openFilterCard() {
    this.isFilter = !this.isFilter;
  }
  // export table data in excel file
  exportExcel() {
    const exportData: Partial<TableElement>[] = this.courseData.map(
      (x: any) => ({
        'Course': x.title,
        Status: x.status=== 'active' ? 'Approved' : 'Pending',
        'Course Code': x.courseCode,
        Creator: x.creator,
        Days: x.course_duration_in_days || 0,
        Hours: x.training_hours || 0,
        Payment:x.fee === null ? 0 : '$'+x.fee,
        'Start Date':
          formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        'End Date':
          formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
        Vendor: x.vendor,
      })
    );

    TableExportUtil.exportToExcel(exportData, 'AllCourses-list');
  }
  onSelectionChange(event: any, field: any) {
    if (field == 'course') {
      this.selectedCourses = event.value;
    }
    if (field == 'vendor') {
      this.selectedVendors = event.value;
    }
    if (field == 'status') {
      this.selectedStatus = event.value;
    }
    if (field == 'creator') {
      this.selectedCreators = event.value;
    }
    if (field == 'startDate') {
      this.selectedCreators = event.value;
    }
  }
  clearFilter() {
    this.filterForm.reset();
    this.getAllCourses();
  }
  applyFilter() {
    let body: any = {};
    if (this.selectedCourses.length > 0) {
      body.title = this.selectedCourses;
    }
    if (this.selectedVendors.length > 0) {
      body.vendor = this.selectedVendors;
    }
    if (this.selectedStatus.length > 0) {
      body.status = this.selectedStatus;
    }
    if (this.selectedCreators.length > 0) {
      body.creator = this.selectedCreators;
    }

    this._courseService
      .getFilteredCourseData(body, { ...this.coursePaginationModel })
      .subscribe((response) => {
        this.courseData = response.data.docs;
        this.totalItems = response.data.totalDocs;
        this.filter = true;
        this.coursePaginationModel.docs = response.data.docs;
        this.coursePaginationModel.page = response.data.page;
        this.coursePaginationModel.limit = response.data.limit;
        this.coursePaginationModel.totalDocs = response.data.totalDocs;
      });
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        'Course',
        'Status     ',
        'Course Code',
        'Creator',
        'Days',
        'Hours',
        'Payment',
        'Start Date ',
        'End Date   ',
        'Vendor  ',
        
      ],
    ];
    const data = this.courseData.map((x: any) => [
      x.title,
      x.status === 'active' ? 'Approved' : 'Pending',
      x.courseCode,
      x.creator,
      x.course_duration_in_days ||0,
      x.training_hours ||0,
      x.fee === null ? '0' : '$'+x.fee,
      formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
      formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
      x.vendor,
      
    ]);
    //const columnWidths = [60, 80, 40];
    const columnWidths = [50, 20, 30, 20, 20, 20, 30, 30, 30, 20];

    // Add a page to the document (optional)
    //doc.addPage();

    // Generate the table using jspdf-autotable
    (doc as any).autoTable({
      head: headers,
      columnWidths: columnWidths,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });

    // Save or open the PDF
    doc.save('AllCourses-list.pdf');
  }
  performSearch() {
    if (this.searchTerm) {
      this.courseData = this.courseData?.filter(
        (item: any) => {
          const searchList = item.title.toLowerCase();
          return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1;
        }

        // item.classId.courseId?.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.getAllCourses();
    }
  }
  viewActiveProgram(id: string, status: string): void {
    this.route.navigate(['/admin/courses/view-course/', 'data.id']);
  }
  delete(id: string) {
    this.classService
      .getClassList({ courseId: id })
      .subscribe((classList: any) => {
        const matchingClasses = classList.docs.filter((classItem: any) => {
          return classItem.courseId && classItem.courseId.id === id;
        });
        if (matchingClasses.length > 0) {
          Swal.fire({
            title: 'Error',
            text: 'Classes have been registered with this course. Cannot delete.',
            icon: 'error',
          });
          return;
        }
        Swal.fire({
          title: 'Confirm Deletion',
          text: 'Are you sure you want to delete this  Course?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this._courseService.deleteCourse(id).subscribe(() => {
              this.getAllCourses();
              Swal.fire({
                title: 'Success',
                text: 'Course deleted successfully.',
                icon: 'success',
              });
            });
          }
        });
      });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.courseData.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.courseData.renderedData.forEach((row: any) =>
          this.selection.select(row)
        );
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    if (this.filter) {
      this.applyFilter();
    } else {
      this.getAllCourses();
    }
  }
  private mapCategories(): void {
    this.coursePaginationModel.docs?.forEach((item) => {
      item.main_category_text = this.mainCategories.find(
        (x) => x.id === item.main_category
      )?.category_name;
    });

    this.coursePaginationModel.docs?.forEach((item) => {
      item.sub_category_text = this.allSubCategories.find(
        (x) => x.id === item.sub_category
      )?.category_name;
    });
  }
  getAllCourses() {
    this._courseService.getAllCoursesWithPagination({...this.coursePaginationModel}).subscribe((response) => {
      this.courseData = response.data.docs;
      this.totalItems = response.data.totalDocs;
      this.coursePaginationModel.docs = response.data.docs;
      this.coursePaginationModel.page = response.data.page;
      this.coursePaginationModel.limit = response.data.limit;
      this.coursePaginationModel.totalDocs = response.data.totalDocs;
    });
  }
  viewCourse(id: string) {
    this.route.navigate(['/admin/courses/course-view/'], {
      queryParams: { id: id, status: 'active' },
    });
  }
  async onBulkUpload(event: any): Promise<void> {
    const selectedFile: File = event.target.files[0];
    const fileType = selectedFile.type;
    if (selectedFile) {
      const formData = new FormData();
  
      if (fileType === 'application/pdf') {
        await this.parsePDF(selectedFile);
      } else if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.parseExcel(selectedFile, formData);
      }else if (
        fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        this.parseWord(selectedFile);
      } 
  console.log("hi")
      // If it's not an Excel file, we just handle it as a PDF or other file
      this.logFormData(formData);
      this.courseService.uploadFiles(formData);
      this.showAlert = true;
      
      event.target.value = null;
    }
  }
  
  public logFormData(formData: FormData) {
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
      
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      let courses = JSON.parse(localStorage.getItem('user_data')!).user.courses;
  
      if (typeof value === 'string') {
        // Remove quotes around the array if they exist
        let cleanedValue = value.replace(/^"|"$/g, '');
        let parsedValue;
        
        try {
          parsedValue = JSON.parse(cleanedValue);
        } catch (e) {
          console.error("Failed to parse value:", cleanedValue, e);
          return;
        }
        
        let payload = {
          companyId: userId,
          courses: courses,
          formData: parsedValue,
          // excel: true
        };
      
        console.log("payload", payload);
  
        this.courseService.createBulkCourses(payload).subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Successful',
              text: 'Uploaded successfully',
              icon: 'success',
            });
            this.getAllCourses();
          },
          (error: any) => {
            console.log('err', error);
          }
        );
      } else {
        // Handle the case where value is not a string (e.g., it's a File)
        console.error("The value is not a string and cannot be parsed as JSON:", value);
      }
    });
  }
  

  async  parsePDF(selectedFile: File) {
    const reader = new FileReader();
  
    reader.onload = async (e: any) => {
      try {
        const arrayBuffer = e.target.result as ArrayBuffer;
  
        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        let pdfText = '';
  
        // Iterate through pages and extract text
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          pdfText += textContent.items.map((item: any) => item.str).join(' ');
        }
  
        // Log the content to the console
        console.log('Extracted Text Content:', pdfText);
  
      } catch (error) {
        console.error('Error parsing PDF document:', error);
      }
    };
  
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  
    reader.readAsArrayBuffer(selectedFile);
  }

  async parseExcel(selectedFile: File, formData: FormData) {
    const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
  
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          formData.append('excelData', JSON.stringify(jsonData));
          console.log("data1111", formData)
        this.logFormData(formData);
          this.courseService.uploadFiles(formData);
          this.showAlert = true;
          
          e.target.value = null;
        };
        reader.readAsArrayBuffer(selectedFile);
        return; // Exit the function as we're processing the file asynchronously
      }
      async parseWord(selectedFile: File) {
        const reader = new FileReader();
      
        reader.onload = async (e: any) => {
          try {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const zip = new JSZip();
            const content = await zip.loadAsync(arrayBuffer);
      
            // Check if the file exists in the zip
            const documentFile = content.file('word/document.xml');
            if (documentFile) {
              // Extract document XML
              const documentXML = await documentFile.async('text');
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(documentXML, 'application/xml');
              const textNodes = xmlDoc.getElementsByTagName('w:t');
      
              let plainText = '';
              for (let i = 0; i < textNodes.length; i++) {
                plainText += textNodes[i].textContent + ' ';
              }
      
              // Log the content to the console
              console.log('Extracted Text Content:', plainText);
      
              // Split plain text into an array
              const elements = plainText.split(/\s+/).filter(item => item.trim() !== '');
      
              // Identify headers and data
              const headers = elements.slice(0, 18); // Assuming first 18 elements are headers
              console.log('Headers:', headers);
      
              const data = [];
              for (let i = headers.length; i < elements.length; i += headers.length) {
                data.push(elements.slice(i, i + headers.length));
              }
      
              console.log('Data:', data);
      
              // Combine headers and data into a single array
              const combinedData = [headers, ...data];
              console.log('Combined Data:', combinedData);
      
              // Format the payload
              let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
              let courses = JSON.parse(localStorage.getItem('user_data')!).user.courses;
      
              let payload = {
                companyId: userId,
                courses: courses,
                formData: combinedData, // Pass the formatted data
              };
      
              console.log("Payload:", payload);
      
              // Send the payload to the backend
              this.courseService.createBulkCourses(payload).subscribe(
                (response: any) => {
                  Swal.fire({
                    title: 'Successful',
                    text: 'Uploaded successfully',
                    icon: 'success',
                  });
                },
                (error: any) => {
                  console.log('Error:', error);
                }
              );
            } else {
              console.error('Document XML file not found in the zip.');
            }
      
          } catch (error) {
            console.error('Error parsing Word document:', error);
          }
        };
      
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };
      
        reader.readAsArrayBuffer(selectedFile);
      }
      
  
      // async parseWord(selectedFile: File) {
      //   const reader = new FileReader();
      
      //   reader.onload = async (e: any) => {
      //     try {
      //       const arrayBuffer = e.target.result as ArrayBuffer;
      //       const zip = new JSZip();
      //       const content = await zip.loadAsync(arrayBuffer);
      
      //       // Check if the file exists in the zip
      //       const documentFile = content.file('word/document.xml');
      //       if (documentFile) {
      //         // Extract document XML
      //         const documentXML = await documentFile.async('text');
      //         const parser = new DOMParser();
      //         const xmlDoc = parser.parseFromString(documentXML, 'application/xml');
      //         const textNodes = xmlDoc.getElementsByTagName('w:t');
      
      //         // let plainText = '';
      //         // for (let i = 0; i < textNodes.length; i++) {
      //         //   plainText += textNodes[i].textContent + ' ';
      //         // }
      //         let plainText = '';
      //         for (let i = 0; i < textNodes.length; i++) {
      //           plainText += textNodes[i].textContent || '';
      //         }
      
      //         // Log the content to the console
      //         console.log('Extracted Text Content:', plainText);
      
      //         // Convert the plain text into an array format
      //         // const elements = plainText.split(/\s+/).filter(item => item.trim() !== '');
      //         // console.log('Elements:', elements);
      
      //         // // Assume the first five elements are headers
      //         // const headers = elements
      //         // const data = elements.slice(5);
      
      //         // console.log('Headers:', headers);
      //         // console.log('Data:', data);
      
      //         // // Ensure the data length is a multiple of the headers length
      //         // if (data.length % headers.length !== 0) {
      //         //   console.error('Data length is not a multiple of headers length.');
      //         //   return;
      //         // }
      
      //         // // Create an array of objects
      //         // const combinedData = [];
      //         // for (let i = 0; i < data.length; i += headers.length) {
      //         //   let row: { [key: string]: string } = {};
      //         //   headers.forEach((header, index) => {
      //         //     row[header] = data[i + index] || '';
      //         //   });
      //         //   combinedData.push(row);
      //         // }
      
      //         // console.log('Combined Data:', combinedData);
      
      //         let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      //         let courses = JSON.parse(localStorage.getItem('user_data')!).user.courses;
      
      //         let payload = {
      //           companyId: userId,
      //           courses: courses,
      //           formData: plainText, // Pass the formatted data
      //         };
      
      //         console.log("Payload:", payload);
      
      //         this.courseService.createBulkCourses(payload).subscribe(
      //           (response: any) => {
      //             Swal.fire({
      //               title: 'Successful',
      //               text: 'Uploaded successfully',
      //               icon: 'success',
      //             });
      //           },
      //           (error: any) => {
      //             console.log('Error:', error);
      //           }
      //         );
      //       } else {
      //         console.error('Document XML file not found in the zip.');
      //       }
      
      //     } catch (error) {
      //       console.error('Error parsing Word document:', error);
      //     }
      //   };
      
      //   reader.onerror = (error) => {
      //     console.error('Error reading file:', error);
      //   };
      
      //   reader.readAsArrayBuffer(selectedFile);
      // }
      
      
}
