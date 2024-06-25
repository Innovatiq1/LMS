import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { AdminService } from '@core/service/admin.service';
import { CourseService } from '@core/service/course.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { StudentsService } from 'app/admin/students/students.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-genereate-report',
  templateUrl: './genereate-report.component.html',
  styleUrls: ['./genereate-report.component.scss']
})
export class GenereateReportComponent {
  breadscrums = [
    {
      title: 'Reports',
      items: ['Reports'],
      active: 'Filter Report',
    },
  ];
  reportForm!: FormGroup;
  payRunDate?: string;
  position?: string;
  department?: string;
  selectedUsers: any = [];
  users: any;
  dept: any;
  programData: any;
  courseData: any;
  userGroupData: any;
  programList: any;
  courseList: any;
  selectedPrograms: any = [];
  selectedCourses: any = [];
  selectedUserGroups: any = []
  selectedDepartments: any = [];
  selectedRoles: any = [];

  coursePaginationModel!: Partial<CoursePaginationModel>;
  userGroups!: any[];
  roleNames: any;
  isCourse = true;
  isProgram = false;
  
  @ViewChild('allSelected') private allSelected!: MatOption;
  constructor(
    private userService: UserService, 
    private studentsService: StudentsService,
    private courseService: CourseService,
    private classService: ClassService,
    private adminService: AdminService,
    public utils: UtilsService,
    private router: Router,
    private fb: FormBuilder,) {
      this.coursePaginationModel = {};
      this.reportForm = this.fb.group({
        users: ['', [ ...this.utils.validators.noLeadingSpace]],
        program: ['', [ ...this.utils.validators.noLeadingSpace]],
        course: ['', [ ...this.utils.validators.noLeadingSpace]],
        department: ['', [ ...this.utils.validators.noLeadingSpace]],
        userGroupId: ['', [ ...this.utils.validators.noLeadingSpace]],
        role: ['', [ ...this.utils.validators.noLeadingSpace]],
        sessionStartDate: ['', [ ...this.utils.validators.noLeadingSpace]],
        sessionEndDate: ['', [ ...this.utils.validators.noLeadingSpace]],
  
      });
     }

  ngOnInit(): void {
    this.getDepartments();
    this.getAllUsers();
    this.getProgramList();
    this.getAllCourses();
    this.getUserGroups();
    this.getAllRoles();
    forkJoin({
      courses: this.classService.getAllCoursesTitle('active'),
      programs: this.courseService.getPrograms({ ...this.coursePaginationModel,status: 'active'}),
    }).subscribe((response) => {
      this.programList = response.programs;
      this.courseList = response.courses.reverse();
    });
  }

  onSelectCourse(event: any){
    if(event.value == 'course'){
     this.isCourse = true;
     this.isProgram = false;
    }else if (event.value == 'program'){
     this.isProgram = true;
     this.isCourse = false;
    }
   }
 
  private convertToCSV(data: any): string {
    let csv = 'Pay Run Date,Position,Department\n';
    csv += `${data.payRunDate},${data.position},${data.department}\n`;
    return csv;
  }
  onSelectionChange(event: any, field: any) {
    if (field == 'course') {
      this.selectedCourses = event.value;
    }
    if (field == 'program') {
      this.selectedPrograms = event.value;
    }
    if (field == 'users') {
      this.selectedUsers = event.value;
    }
    if (field == 'department') {
      this.selectedDepartments = event.value;
    }
    if (field == 'usergroup') {
      this.selectedUserGroups = event.value;
    }
    if (field == 'user') {
      this.selectedUsers = event.value;
    }
    if (field == 'role') {
      this.selectedRoles = event.value;
    }  
  }

  generateReports() {
    let body: any = {};
    if (this.selectedCourses.length > 0) {
      body.reportCourse = this.selectedCourses
    }
    if (this.selectedPrograms.length > 0) {
      body.reportProgram = this.selectedPrograms
    }
    if (this.selectedUsers.length > 0) {
      body.reportUser = this.selectedUsers
    }
    if (this.selectedDepartments.length > 0) {
      body.reportDepartment = this.selectedDepartments
    }
    if (this.selectedRoles.length > 0) {
      body.reportType = this.selectedRoles
    }
    if (this.selectedUsers.length > 0) {
      body.reportUser = this.selectedUsers
    }


    this.courseService.getCourseReports(body).subscribe(response => {
      this.courseData = response.data.filteredData
      if(response.data.filteredData.length > 0){
        const doc = new jsPDF();
        const headers = [[' Course', 'User', 'Role','Department','Start Date','End Date','Status']];
        const data = this.courseData.map((x: any) =>
          [x.title,
          x.studentId.name,
          x.studentId.role,
          x.studentId.department,
          formatDate(new Date(x.classId?.courseId?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
          formatDate(new Date(x.classId?.courseId?.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
          x.status
          ]);
        const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
        (doc as any)?.autoTable({
          head: headers,
          body: data,
          startY: 20,
        });
        doc.save('Report.pdf');
        const blob = doc.output('blob');
        const file = new File([blob], 'Report.pdf', { type: 'application/pdf' });
        const event = { target: { files: [file] } };
        this.onFileUpload(event);
      }else{
          Swal.fire({
            title: 'Error',
            text: 'Data not matched.',
            icon: 'error',
            // confirmButtonColor: '#526D82',
          });
      }
           
    })

  }
  
  onFileUpload(event: any) {
    const file = event.target.files[0];
    const formdata = new FormData();
    formdata.append('doc_filename', file.name);
    formdata.append('files',file);
      this.courseService.saveVideo(formdata).subscribe((data) => {
        let payload ={
          report:data?.data?.document,
          reportName:data?.data?.doc_filename,
        }
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to Create this Report!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
        this.courseService.saveReport(payload).subscribe((data) => {
          Swal.fire({
            title: 'Success',
            text: 'Report saved successfully.',
            icon: 'success',
          });
          this.router.navigate(['/admin/reports/report'])

        })
      }
      })
    });

  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.reportForm.controls['userGroupId']
        .patchValue([...this.userGroups.map(item => item.id)]);
    } else {
      this.reportForm.controls['userGroupId'].patchValue([]);
    }
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.users = response?.results;
    });
  }
  getProgramList(filters?: any) {
    this.courseService.getAllPrograms({...this.coursePaginationModel}).subscribe(
      (response: any) => {
        this.programData = response.docs;
      },
    );
  }
  getAllCourses() {
    this.courseService.getAllCoursesWithPagination().subscribe(response => {
      this.courseData = response.data.docs;
    })
  }
  getDepartments() {
    this.studentsService.getAllDepartments().subscribe((response: any) => {
      this.dept = response.data.docs;
    });
  }
  getUserGroups() {
    this.userService.getUserGroups().subscribe((response: any) => {
      this.userGroups = response.data.docs;
    });
  }
  getAllRoles(filters?: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.adminService.getUserTypeList({ 'allRows':true },userId).subscribe(
      (response: any) => {
        this.roleNames = response;
      },
      (error) => {
      }
    );
  }

}
