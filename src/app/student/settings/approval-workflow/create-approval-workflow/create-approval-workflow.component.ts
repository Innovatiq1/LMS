import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel, SubCategory } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-approval-workflow',
  templateUrl: './create-approval-workflow.component.html',
  styleUrls: ['./create-approval-workflow.component.scss']
})
export class CreateApprovalWorkflowComponent implements OnInit{
 
  approvalForm!: FormGroup;
  editUrl: any;
  subscribeParams: any;
  categoryId: any; 
  approverData: any;  

  breadscrums = [
    {
      title: 'Create Categories',
      items: ['Approval flow'],
      active: 'Create Approval flow',
    },
  ];

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    public utils:UtilsService,
    private activatedRoute: ActivatedRoute, 
  ){
    let urlPath = this.router.url.split('/')

    this.editUrl = urlPath.includes('edit-approval-flow');



    if(this.editUrl===true){
      this.breadscrums = [
        {
          title:'Edit Categories',
          items: ['Approval flow'],
          active: 'Edit Approval flow',
        },
      ];
    }


     
    this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.categoryId = params.id;
  });
}

  ngOnInit(): void {
    this.approvalForm = this.formBuilder.group({
      title: ['', Validators.required],
      approver: this.formBuilder.array([]),
      level: ['', Validators.required], 
    });
    this.addApprover();
    if(this.editUrl){
      this.getData()
    }
  }
  get approver(): FormArray {
    return this.approvalForm.get('approver') as FormArray;
  }
  addApprover() {
    const approvalForm = this.formBuilder.group({      
      approvers: ['', Validators.required] 
      });    
      this.approver.push(approvalForm);
  }

  deleteApprover(index: number): void {
      this.approver.removeAt(index);
    }

  submit(){
    if (this.approvalForm.valid) {
      const approvalData = this.approvalForm.value;
      const payload = {
        title: approvalData?.title,
        level: approvalData?.level, 
        Approver: approvalData.approver.map((menulist: any) => ({
          approvers: menulist?.approvers,
        })),
        id: this.categoryId,
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to create this Approval flow!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.settingsService.saveApprovalFlow(payload).subscribe((response: any) => {
              Swal.fire({
                title: 'Successful',
                text: 'Approval flow created successfully',
                icon: 'success',
              });
              window.history.back();
            });

        }
      });
    }
  }
  update(){
    if (this.approvalForm.valid) {
      const approvalData = this.approvalForm.value;
      const payload = {
        title: approvalData?.title,
        level: approvalData?.level, 
        Approver: approvalData.approver.map((menulist: any) => ({
          approvers: menulist?.approvers,
        })),
        id: this.categoryId,
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update this Approval flow!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.settingsService.updateApprovalFlow(payload).subscribe((response: any) => {
              Swal.fire({
                title: 'Successful',
                text: 'Approval flow updated successfully',
                icon: 'success',
              });
              window.history.back();
            });

        }
      });
    }
  }
  getData() {
    this.settingsService.getApprovalFlowById(this.categoryId).subscribe((response: any) => {
        this.approverData = response;
        this.approvalForm.patchValue({
            title: this.approverData?.title,
            level: this.approverData?.level,
        });

        const approverControls = this.approverData?.Approver?.map((response: {
             approvers: string;
        }) => {
            return this.formBuilder.group({
                approvers: [response?.approvers],
            });
        });
        if (approverControls) {
            this.approvalForm.setControl('approver', this.formBuilder.array(approverControls));
        }

    });
}

}
