import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentPaginationModel } from '@core/models/class.model';
import { CourseService } from '@core/service/course.service';
import { AppConstants } from '@shared/constants/app.constants';
import { ClassService } from 'app/admin/schedule-class/class.service';

@Component({
  selector: 'app-view-completion',
  templateUrl: './view-completion.component.html',
  styleUrls: ['./view-completion.component.scss']
})
export class ViewCompletionComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Completed Programs'],
      active: 'View Completed Program',
    },
  ];
  classDataById: any;
  completedData: any;
  studentPaginationModel: StudentPaginationModel;
  courseId: any;
  response: any;
  isApproved: any;
  approvedUrl: any;
  commonRoles: any;

  constructor(private classService: ClassService,private courseService: CourseService,private _router: Router, private activatedRoute: ActivatedRoute,) {

    this.studentPaginationModel = {} as StudentPaginationModel;
    this.activatedRoute.params.subscribe((params: any) => {
      
      this.courseId = params.id;
      // if(this.courseId){
      //   this.getProgramByID(this.courseId);
      // }

    });
    let urlPath = this._router.url.split('/');
    this.approvedUrl = urlPath.includes('view-approved-program');
    if (this.approvedUrl === true) {
      this.breadscrums = [
        {
          title: 'Blank',
          items: ['Approved Programs'],
          active: 'View Approved Program',
        },
      ];
      this.isApproved = true;
    }
  }

    ngOnInit(): void {
      this.commonRoles = AppConstants
      this.getCompletedClasses();
      if (this.courseId) {
        this.activatedRoute.params.subscribe((params: any) => {
          
          this.courseId = params.id;
          this.getCategoryByID(this.courseId);
        });
      }
    }

  getCompletedClasses() {
    this.classService
      .getProgramCompletedStudent(this.studentPaginationModel.page, this.studentPaginationModel.limit)
      .subscribe((response: { docs: any; page: any; limit: any; totalDocs: any; }) => {
        this.completedData = response.docs;
      })
  }
  getCategories(id: string): void {
    
    this.getCategoryByID(id);
  }
  getCategoryByID(id: string) {
    this.courseService.getStudentProgramClassById(id).subscribe((response: any) => {
     this.classDataById = response?._id;
     this.response = response;
     // this.subCategory = response.subCategories;
     // if (response && response.data && response.data._id) {
     //   this.classDataById = response?._id;
     //   this.response = response.data;
     // } else {
      
     // }
   });
 }
}
