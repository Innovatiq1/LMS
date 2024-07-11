import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '@core/service/customization.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-customization',
  templateUrl: './form-customization.component.html',
  styleUrls: ['./form-customization.component.scss']
})
export class FormCustomizationComponent {
  forms!: any[];
  labelChanges: { formId: string, labelName: string, checked: boolean }[] = [];
  breadscrums = [
    {
      title: 'Form Configuration',
      items: ['Configuration'],
      active: 'Form Configuration',
    },
  ];
  formName!: string;

  constructor(private formService: FormService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const formName = params['name'];
      this.formName = formName;
      this.getForms();
    })
  }

  getForms(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            const formName = this.formName;
    this.formService.getAllForms(userId,formName).subscribe(forms => {
      this.forms = forms;
    });
  }

  onCheckboxChange(formId: string, labelName: string, checked: boolean): void {
    const existingChangeIndex = this.labelChanges.findIndex(change => change.formId === formId && change.labelName === labelName);
    if (existingChangeIndex !== -1) {
      this.labelChanges[existingChangeIndex].checked = checked;
    } else {
      this.labelChanges.push({ formId, labelName, checked });
    }
  }

  openModalPopup(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to update this Label!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
    Swal.fire({
      title: 'Success',
      text: 'Label updated successfully.',
      icon: 'success'
    }).then(() => {
      window.history.back(); // Navigate to the forms page after closing the modal
    });
   }
   })
  }

  updateLabels(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.labelChanges.forEach(change => {
      this.formService.updateLabelStatus(userId,change.formId, change.labelName, change.checked).subscribe(updatedForm => {
        this.openModalPopup();
      }, error => {
        Swal.fire({
          title: 'Error',
          text: error,
          icon: 'error',
        });
      });
    });
  }
}
