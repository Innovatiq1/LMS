
import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SurveyService } from '@core/service/survey.service';
import { co } from '@fullcalendar/core/internal-common';
import Swal from 'sweetalert2';

interface FormField {
  label: string;
  type: string;
  options?: string[];
  required: boolean;
  name: string;
  strength?: 'normal' | 'strong';
  minLength?: number;
  maxLength?: number;
}

@Component({
  selector: 'app-survey-registration',
  templateUrl: './survey-registration.component.html',
  styleUrls: ['./survey-registration.component.scss']
})
export class SurveyRegistrationComponent {
  formFields = [
    { label: 'Name', key: 'name', type: 'text', placeholder: 'Enter your name' },
    { label: 'Email', key: 'email', type: 'email', placeholder: 'Enter your email' },
    { label: 'Phone', key: 'phone', type: 'tel', placeholder: 'Enter your phone' }
  ];
  surveyList: any[] = [];
  selectedTabIndex = 0;
  generatedCode: string = '';
  generatedApiEndpoint: string = '';
  editingSurveyId: string | null = null;
  title: string = '';
  field: any[] = [];
  showSurveyTable: boolean = false;
  fields: any[] = [];
  options: any;
  isThirdParty: any;
  activeCompanies: any[] = [];
  // selectedCompany: any;
  selectedCompanyId: string = '';
  currentCompanyId: string = '';

  fieldTypes = ['radio', 'Text', 'Textarea', 'Password', 'Checkbox', 'Upload', 'Dropdown', 'Date', 'Email', 'Number'];

  newField: FormField = {
    label: '',
    type: 'text',
    required: false,
    
    name: '',
    options: [],
    strength:  'normal',
    minLength: 8,
    maxLength: 20

  };

  editIndex: number | null = null;

  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const surveyId = params['surveyId'];
      if (surveyId) {
        this.loadSurveyById(surveyId);
      }
    });
    // this.getCurrentUserAndLoadCompany();

    this.loadActiveCompanies();
  }
  loadActiveCompanies() {
    this.surveyService.getActiveCompanies().subscribe({
      next: (data) => {
        console.log('Active companies:', data);
        this.activeCompanies = data;
      },
      error: (err) => {
        console.error('Error fetching active companies:', err);
      }
    });
  }
 
  // checkDobValidation(field: any) {
  //   if (field.type.toLowerCase() === 'date') { 
  //   const selectedDate = new Date(field.value);
  //   const today = new Date();

  //   selectedDate.setHours(0, 0, 0, 0);
  //   today.setHours(0, 0, 0, 0);
  //   field.isInvalidDob = selectedDate >= today;
  //  }
  // }

loadSurveyById(id: string) {
  const isThirdParty = this.selectedTabIndex === 1;

  if (isThirdParty) {
    this.surveyService.getthirdpartySurvey(id).subscribe({
      next: (data) => {
        this.editingSurveyId = data._id;
        this.title = data.title;
        this.fields = data.fields;
      },
      error: (err) => {
        console.error('Error fetching third-party survey:', err);
      }
    });
  } else {
    this.surveyService.getSurveyById(id).subscribe({
      next: (data) => {
        this.editingSurveyId = data._id;
        this.title = data.title;
        this.fields = data.fields;
      },
      error: (err) => {
        console.error('Error fetching site registration survey:', err);
      }
    });
  }
}

showOptions() {
  return ['radio', 'checkbox', 'dropdown'].includes(this.newField.type?.toLowerCase());
}

removeField(index: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to remove this field',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      this.fields.splice(index, 1);
      Swal.fire('Removed!', 'The field has been removed.', 'success');
    }
  });
}


editField(index: number) {
  this.newField = { ...this.fields[index] };
  this.editIndex = index;
}

addOption() {
  if (!this.newField.options) {
    this.newField.options = [];
  }
  this.newField.options.push('');
}

removeNewOption(index: number) {
  if (this.newField.options) {
    this.newField.options.splice(index, 1);
  }
}

copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    Swal.fire('Copied!', 'The text has been copied to clipboard.', 'success');
  });
}

showIntegrationOptions(embedCode: string, apiEndpoint: string) {
  Swal.fire({
    title: 'Integration Options',
    html: `
        <h4>Embedded Code:</h4>
        <textarea readonly style="width:100%; height:100px">${embedCode}</textarea>
        <h4>API Endpoint:</h4>
        <textarea readonly style="width:100%; height:100px">${apiEndpoint}</textarea>
        <p style="font-size: 12px; color: gray;">Use the above code to integrate the survey into your application.</p>
      `,
    width: 600,
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Copy Embed Code',
    denyButtonText: 'Copy API Endpoint',
    cancelButtonText: 'Close'
  }).then((result) => {
    if (result.isConfirmed) {
      navigator.clipboard.writeText(embedCode).then(() => {
        Swal.fire('Copied!', 'The embedded code has been copied to clipboard.', 'success');
      });
    } else if (result.isDenied) {
      navigator.clipboard.writeText(apiEndpoint).then(() => {
        Swal.fire('Copied!', 'The API endpoint has been copied to clipboard.', 'success');
      });
    }
  });
}

generateEmbeddedCode() {
  const surveyId = this.editingSurveyId;
  if (!surveyId) {
    Swal.fire('Error', 'Survey ID not found. Cannot generate code.', 'error');
    return;
  }

  const embedCode = `<iframe src="http://localhost:3001/thirdParty/thirdparty/${surveyId}" width="100%" height="400px" frameborder="0"></iframe>`;
  const apiEndpoint = `http://localhost:3001/thirdParty/thirdparty/${surveyId}`;

  this.generatedCode = embedCode;
  this.generatedApiEndpoint = apiEndpoint;

  this.showIntegrationOptions(embedCode, apiEndpoint);
}

addField() {
  if (!this.newField.label || !this.newField.type) return;
  const fieldToAdd = {
    ...this.newField,
    value: '' 
  };
  if (this.editIndex !== null) {
    this.fields[this.editIndex] = fieldToAdd;
    this.editIndex = null;
  } else {
    this.fields.push(fieldToAdd);
  }
  // this.newField = { label: '', type: '', required: false, name: '', options: [] };
  this.newField = {
    label:     '',
    type:      'text',
    required:  false,
    name:      '',
    options:   [],
    strength:  'normal',
    minLength: 8,
    maxLength: 20
  };
}

onFieldTypeChange() {
  if (['checkbox', 'radio', 'dropdown'].includes(this.newField.type?.toLowerCase())) {
    if (!this.newField.options) {
      this.newField.options = [''];
    }
  } else {
    this.newField.options = [];
  }
}

saveSurvey() {
  const isThirdParty = this.selectedTabIndex === 1;
  const payload = {
    title: isThirdParty ? 'Third Party Survey' : 'Site Registration',
    fields: this.fields,
    companyId: this.selectedCompanyId,
  };

  if (isThirdParty) {
    this.surveyService.createthirdpartySurvey(payload).subscribe({
      next: (res) => {
        const surveyId = res?.surveyForm?._id;
        if (!surveyId) {
          Swal.fire('Error', 'Survey saved, but ID is missing. Cannot generate code.', 'error');
          return;
        }

        this.editingSurveyId = surveyId;

        Swal.fire('Success', 'Third party form saved successfully!', 'success').then(() => {
          this.generateEmbeddedCode();
        });
      },
      error: () => {
        Swal.fire('Error', 'Failed to save survey', 'error');
      }
    });

  } else {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will save your survey form to the database.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.surveyService.createSurvey(payload).subscribe({
          next: () => {
            console.log('resultss');
            Swal.fire('Saved!', 'Your survey has been saved.', 'success');
            this.router.navigate(['student/all-survey']);
          },
          error: err => {
            console.error(err);
            Swal.fire('Error', 'Something went wrong while saving.', 'error');
          }
        });
      }
    });
  }
}
  
}
