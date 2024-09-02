import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { EtmsService } from '@core/service/etms.service';
import { UtilsService } from '@core/service/utils.service';

@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.component.html',
  styleUrls: ['./all-request.component.scss']
})
export class AllRequestComponent {

  
  searchType:string ='';
  searchValue:string ='';
  employeeText: string = '';
  roText: string = '';
  directorText: string = '';
  trainingadminText: string = '';

  breadscrums = [
    {
      title: 'ETMS',
      items: ['Finance'],
      active: 'All Requests',
    },
  ];
  SourceData: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  constructor(
    public empService: EtmsService,
    public utils: UtilsService,
    private router: Router
  ) {
    this.coursePaginationModel = {};
  }

  ngOnInit() {
    this.getAllRequests();
  }


  getAllRequests(){
    this.empService.getAllRequests(this.searchValue,this.searchType,{...this.coursePaginationModel}).subscribe((res) => {
      this.SourceData = res.data.docs.docs;
      this.totalItems = res.data.totalDocs;
      this.coursePaginationModel.docs = res.data.docs;
      this.coursePaginationModel.page = res.data.page;
      this.coursePaginationModel.limit = res.data.limit;
    })
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllRequests();
  }

  onSearchChange() {
    if(this.employeeText.length>2){
     if(this.employeeText){
      this.searchType="Employee"
      this.searchValue= this.employeeText
      this.empService.getAllRequests(this.searchValue,this.searchType,{...this.coursePaginationModel}).subscribe((res) => {
        
        this.SourceData = res.data.docs.docs;
        this.totalItems = res.data.totalDocs;
      })
      this.pageSizeChange({
        pageIndex: this.coursePaginationModel?.page ? this.coursePaginationModel.page - 1 : 0,
        pageSize: this.coursePaginationModel?.limit || 10
      });

     } 
    } else if(this.employeeText.length===0){
       this.searchType=""
       this.searchValue=""
      this.getAllRequests()
      
  
      
  
     }
  
  }
  onRoChange() {
       if(this.roText.length>2){
        if(this.roText){
      this.searchType="RO"
      this.searchValue=this.roText;
      this.empService.getAllRequests(this.searchValue,this.searchType,{...this.coursePaginationModel}).subscribe((res) => {
        
        this.SourceData = res.data.docs.docs;
        this.totalItems = res.data.totalDocs;
  
      })
      this.pageSizeChange({
        pageIndex: this.coursePaginationModel?.page ? this.coursePaginationModel.page - 1 : 0,
        pageSize: this.coursePaginationModel?.limit || 10
      });
    }
      } else if(this.roText.length===0){
        this.searchType=""
        this.searchValue=""
        this.getAllRequests()

    
    }
  }
  onDirectorChange() {

       if(this.directorText.length>2){
      this.searchType="Director"
      this.searchValue=this.directorText;
      this.empService.getAllRequests(this.searchValue,this.searchType,{...this.coursePaginationModel}).subscribe((res) => {
        
        this.SourceData = res.data.docs.docs;
        this.totalItems = res.data.totalDocs;
  
      })
     
      this.pageSizeChange({
        pageIndex: this.coursePaginationModel?.page ? this.coursePaginationModel.page - 1 : 0,
        pageSize: this.coursePaginationModel?.limit || 10
      });
      } else if(this.directorText.length===0){
        this.searchType=""
        this.searchValue=""
        this.getAllRequests()

      }
    
  }

  onTrainingChange() {

       if(this.trainingadminText.length>2){
      this.searchType="TrainingAdmin"
      this.searchValue=this.trainingadminText;
      this.empService.getAllRequests(this.searchValue,this.searchType,{...this.coursePaginationModel}).subscribe((res) => {
        
        this.SourceData = res.data.docs.docs;
        this.totalItems = res.data.totalDocs;
      })
      this.pageSizeChange({
        pageIndex: this.coursePaginationModel?.page ? this.coursePaginationModel.page - 1 : 0,
        pageSize: this.coursePaginationModel?.limit || 10
      });
      }else if(this.trainingadminText.length===0){
        this.searchType=""
        this.searchValue=""
      this.getAllRequests()
      
    }
  }
  viewReq(id: string) {
    this.router.navigate(['/admin/budgets/view-request'], { queryParams: {id: id} });
  }
}
