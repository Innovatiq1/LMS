import { Component } from '@angular/core';
import { CourseService } from '@core/service/course.service';

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss']
})
export class FilterPopupComponent {
  programData: any;
  titles: string[] = []; 
  codes: string[] = []; 
  creator: string[] = [];
  duration: string[] = [];
  startDate: string[] = [];
  endDate: string[] = [];
  status: string[] = [];

  constructor(private courseService: CourseService){
    
  }
  ngOnInit() {
    this.getProgramList();
  }

  getProgramList(filters?: any) {
    // let filterText = this.filterName
    this.courseService.getAllPrograms().subscribe(
      (response: any) => {
        this.programData = response.docs;
        this.titles = this.programData.map((doc: any) => doc.title);
        this.codes = this.programData.map((doc: any) => doc.courseCode);
        this.creator = this.programData.map((doc: any) => doc.creator);
        this.duration = this.programData.map((doc: any) => doc.duration);
        this.startDate = this.programData.map((doc: any) => doc.sessionStartDate);
        this.endDate = this.programData.map((doc: any) => doc.sessionEndDate);
        this.status = this.programData.map((doc: any) => doc.status);
      },
      (error) => {
      }
    );
  }
}
