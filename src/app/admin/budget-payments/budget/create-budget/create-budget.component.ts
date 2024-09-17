import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from '@core/models/user.model';
import { EtmsService } from '@core/service/etms.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss']
})
export class CreateBudgetComponent implements OnInit{

  requestForm!: FormGroup;
  breadscrums = [
    {
      title: 'Employee Request',
      items: ['Budget'],
      active: 'Create New Budget',
    },
  ];
  breadscrumsEdit = [
    {
      title: 'Over All Budget',
      // items: ['Extra'],
      active: 'Edit Budget',
    },
  ];
  directorName!: string;
  headId!: string;
  directorId!: string;
  employeName!:string;
  dataSource: object | undefined;
  private _id: any;
  action: any;
  users!: Users[];
  
  constructor( private etmsService: EtmsService,
    public utils: UtilsService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private userService: UserService,
    
    private fb: FormBuilder){
      this.activeRoute.queryParams.subscribe((params) => {
        this._id = params['id'];
        this.action = params['action'];
        
      });

    this.requestForm = this.fb.group({
      trainingBudget: ['', [this.utils.noLeadingSpace]],
      year: [
        '',
        [ this.utils.noLeadingSpace],
      ],
      trainingType: [
        '',
        [ this.utils.noLeadingSpace],
      ],

      name: [
        '',
        [...this.utils.validators.name, this.utils.noLeadingSpace],
      ],
      email: [
        '',
        [...this.utils.validators.email, this.utils.noLeadingSpace],
      ],
      
    });
  }

  ngOnInit() {
    const employeeEmail = JSON.parse(localStorage.getItem('user_data')!).user.email;
    
    if (this.action === 'edit') {
      this.editRequest();
    }
    this.setup();
}

setup() {
  const headId = JSON.parse(localStorage.getItem('user_data')!).user.head;

  this.userService.getAllUsers().subscribe((response: any) => {
    this.users = response?.results.reverse();
    const user = this.users.find(user => user.id === headId);

    if (user) {
      this.requestForm.patchValue({
        name: user.name,
        email: user.email
      });
    }
  });
}
getUserId() {
  let userId = localStorage.getItem('id');
  this.etmsService.getUserId(userId).subscribe((response: any) => {
    
    this.directorId = response.director,
    this.employeName=response?.name +
              ' ' +
              (response.last_name ? response.last_name : ''),
    this.etmsService.getUserId(this.directorId).subscribe((res: any) => {
      
        
      this.directorName = response?.directorName,
      
      this.requestForm.patchValue({
        trainingBudget:"",
        year: "",
        trainingType:"",
        name: this.directorName,
        email: res?.email,
       
        
      });
    });
  
 
});
}

editRequest(){
  this.etmsService.getBudgetById(this._id).subscribe((res: any) => {
    

    this.requestForm.patchValue({
      trainingBudget: res.trainingBudget,
      year: res.year,
      trainingType: res.trainingType,
      name: res.name,
      email: res.email,
    })
  })
}

updateRequest(){
  let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  let employeeId = JSON.parse(localStorage.getItem('user_data')!).user.id
  let payload = {
    trainingBudget: this.requestForm.value.trainingBudget,
    year: this.requestForm.value.year,
    trainingType: this.requestForm.value.trainingType,
    name: this.requestForm.value.name,
    email: this.requestForm.value.email,
    companyId: userId,
    employeeId: employeeId,
  }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this budget!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.etmsService.updateTrainingBudget(this._id, payload).subscribe((res: any) => {
          
          Swal.fire({
            icon:'success',
            title: 'Budget Updated Successfully',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/admin/budgets/budget']);
        })
      }
    });
 
}
cancel(){
  window.history.back();
}

onSubmit(){
  const employeeEmail = JSON.parse(localStorage.getItem('user_data')!).user.email;
  let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  const headId = JSON.parse(localStorage.getItem('user_data')!).user.head;
  const employeeId = JSON.parse(localStorage.getItem('user_data')!).user.id;
  let userName = JSON.parse(localStorage.getItem('user_data')!).user.name;
  if (this.requestForm.valid) {
    const requestData = this.requestForm.value;
    // requestData['employeeName']=this.employeName;
    requestData['employeeName']= userName;
    requestData['approval']='Pending';
    requestData['head']= headId;
    requestData['employeeEmail'] = employeeEmail;
    requestData['companyId'] = userId;
    requestData['employeeId'] = employeeId;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create budget request!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.etmsService
              .createBudget(requestData)
              .subscribe((response: any) => {
                Swal.fire({
                  title: 'Successful',
                  text: 'Budget Requested successfully',
                  icon: 'success',
                });
                this.router.navigate(['/admin/budgets/budget']);
              }); 
      }
    });
     
  }
}
}
