import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SurveyService } from '@core/service/survey.service';
import { co } from '@fullcalendar/core/internal-common';
import { environment } from 'environments/environment.development';
import Swal from 'sweetalert2';

interface FormField {
  label: string;
  type: string;
  options?: string[];
  required: boolean;
  attr?: string;
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
 
   private baseUrl = environment.apiEndpointNew
  surveyList: any[] = [];
  selectedTabIndex = 0;
  generatedCode: string = '';
  generatedApiEndpoint: string = '';
  editingSurveyId: string | null = null;
  title: string = '';
  field: any[] = [];
  showSurveyTable: boolean = false;
  fields: any[] = [];
  thirdPartyFields: any[] = [];
  siteRegistrationFields: any[] = [];
  options: any;
  isThirdParty: any;
  activeCompanies: any[] = [];
  selectedCompanyId!: string;
companyName:string='';
surveyId: string = '';
  dialogStatus:boolean=false;
  fieldTypes = ['Radio', 'Text', 'Textarea', 'Password', 'Checkbox', 'Upload', 'Dropdown', 'Date', 'Email', 'Number'];
  attr = ['Name', 'Gender', 'Qualification', 'Mobile', 'Email', 'Password', 'Upload'];
  restrictedLabelPatterns: { [key: string]: string[] } = {
    'department': ['department', 'dept', 'dep'],
    'country': ['country', 'nation', 'countries'],
    'city': ['city', 'cities', 'town']
  };

  attributePatterns: { [key: string]: string[] } = {
    'Name': ['name', 'fullname', 'firstname', 'lastname', 'surname'],
    'Email': ['email', 'e-mail', 'mail'],
    'Upload': ['upload', 'file', 'document', 'attachment', 'image', 'photo', 'picture' ],
    'Gender': ['gender', 'sex'],
    'Mobile': ['mobile', 'phone', 'contact', 'cell'],
    'Password': ['password', 'pwd'],
    'Qualification': [
      'qualification', 
      'education',
      'degree',
      'academic',
      'study',
      'course',
      'educational',
      'academics',
      'studies',
      'graduate',
      'graduation'
    ]
  };

  // Add this after the fieldTypes array
  genderOptions = ['Male', 'Female', 'Other'];

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    this.fields = this.selectedTabIndex === 1 ? this.thirdPartyFields : this.siteRegistrationFields;
    if (this.selectedCompanyId) {
      this.loadSurveyById(this.selectedCompanyId);
    }
  }

  newField: FormField = {
    label: '',
    type: 'text',
    required: false,
    attr:'',
    name: '',
    options: [],
    strength:  'normal',
    minLength: 0,
    maxLength: 0

  };

  editIndex: number | null = null;
  breadscrums = [
    {
      title: 'Registration Form',
      items: [''],
      active: 'Site Registration',
    },
  ];
  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('user_data')!);
    this.selectedCompanyId = userData.user.companyId;
    this.companyName = userData.user.company;
    if (this.selectedCompanyId) {
      this.loadSurveyById(this.selectedCompanyId);
    }
    // this.fetchSignupFields();
  }

 

loadSurveyById(id: string) {
  const isThirdParty = this.selectedTabIndex === 1;
  if (isThirdParty) {
    this.surveyService.getthirdpartySurvey(id).subscribe({
      next: (data) => {
        this.editingSurveyId = data._id;
        this.title = data.title;
        this.thirdPartyFields = data.fields || [];
        this.fields = this.thirdPartyFields;
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
        this.siteRegistrationFields = data.fields || [];
        this.fields = this.siteRegistrationFields;
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
      // Store current fields in a new array to trigger change detection properly
      const updatedFields = [...(this.selectedTabIndex === 1 ? this.thirdPartyFields : this.siteRegistrationFields)];
      updatedFields.splice(index, 1);
      
      // Update the appropriate array based on selected tab
      if (this.selectedTabIndex === 1) {
        this.thirdPartyFields = [...updatedFields];
        this.fields = this.thirdPartyFields;
      } else {
        this.siteRegistrationFields = [...updatedFields];
        this.fields = this.siteRegistrationFields;
      }

      // Use NgZone to ensure change detection runs properly
      this.ngZone.run(() => {
        // Force change detection by triggering a state update
        this.fields = [...this.fields];
      });

      Swal.fire('Removed!', 'The field has been removed.', 'success');
    }
  });
}


editField(index: number) {
  const currentFields = this.selectedTabIndex === 1 ? this.thirdPartyFields : this.siteRegistrationFields;
  this.newField = { ...currentFields[index] };
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
        <p style="font-size: 12px; color: gray;">Use the above code to integrate the registration form into your application.</p>
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
  const surveyId = this.selectedCompanyId;
  if (!surveyId) {
    Swal.fire('Error', 'Survey ID not found. Cannot generate code.', 'error');
    return;
  }

  const formUrl = `${this.baseUrl}thirdparty/url/${surveyId}`;
  const embedCode = `<iframe src="${formUrl}" width="100%" height="500px" frameborder="0"></iframe>`;
  const apiEndpoint = `${this.baseUrl}thirdparty/${surveyId}`;

  this.generatedCode = embedCode;
  this.generatedApiEndpoint = apiEndpoint;

  this.showIntegrationOptions(embedCode, apiEndpoint);
}

isRestrictedLabel(label: string): boolean {
  const normalizedLabel = label.trim().toLowerCase();
  return Object.entries(this.restrictedLabelPatterns).some(([key, variations]) => {
    return variations.some((pattern: string) => 
      normalizedLabel === pattern || 
      normalizedLabel.includes(pattern + ' ') || 
      normalizedLabel.includes(' ' + pattern) ||
      normalizedLabel === pattern + 's' ||
      normalizedLabel === pattern + 'ment'
    );
  });
}

// Helper method to detect attribute from label
detectAttributeFromLabel(label: string): string | null {
  const normalizedLabel = label.trim().toLowerCase();
  
  for (const [attr, patterns] of Object.entries(this.attributePatterns)) {
    if (patterns.some(pattern => 
      normalizedLabel === pattern || 
      normalizedLabel.includes(pattern + ' ') || 
      normalizedLabel.includes(' ' + pattern) ||
      normalizedLabel.startsWith(pattern) ||
      normalizedLabel.endsWith(pattern) ||
      // Special case for qualification to catch degree names
      (attr === 'Qualification' && (
        normalizedLabel.includes('b.') ||
        normalizedLabel.includes('m.') ||
        normalizedLabel.includes('ph.d') ||
        normalizedLabel.includes('bachelor') ||
        normalizedLabel.includes('master') ||
        normalizedLabel.includes('diploma')
      ))
    )) {
      return attr;
    }
  }
  return null;
}

addField() {
  if (!this.newField.label || !this.newField.type) return;
  
  // Check if the label is restricted using the new method
  if (this.isRestrictedLabel(this.newField.label)) {
    return; // Don't show popup, message will be shown by getRestrictedFieldMessage()
  }

  // Check for attribute validation
  if (this.getAttributeValidationMessage()) {
    return; // Don't proceed if attribute validation fails
  }
  
  console.log('Adding field with attr:', this.newField.attr);
  
  // Initialize the field with base properties
  const fieldToAdd: any = {
    ...this.newField,
    value: '',
    selectedOptions: [],
    options: [...(this.newField.options || [])]
  };

  // Only include minLength and maxLength for password fields
  if (this.newField.type.toLowerCase() !== 'password') {
    delete fieldToAdd.minLength;
    delete fieldToAdd.maxLength;
  }

  // Initialize selectedOptions array for checkbox type
  if (this.newField.type.toLowerCase() === 'checkbox') {
    fieldToAdd.selectedOptions = new Array(fieldToAdd.options.length).fill(false);
  }

  if (this.editIndex !== null) {
    if (this.selectedTabIndex === 1) {
      this.thirdPartyFields[this.editIndex] = fieldToAdd;
      this.fields = this.thirdPartyFields;
    } else {
      this.siteRegistrationFields[this.editIndex] = fieldToAdd;
      this.fields = this.siteRegistrationFields;
    }
    this.editIndex = null;
  } else {
    if (this.selectedTabIndex === 1) {
      this.thirdPartyFields.push(fieldToAdd);
      this.fields = this.thirdPartyFields;
    } else {
      this.siteRegistrationFields.push(fieldToAdd);
      this.fields = this.siteRegistrationFields;
    }
  }

  // Reset the newField
  this.newField = {
    label: '',
    type: 'text',
    required: false,
    attr: '',
    name: '',
    options: [],
    strength: 'normal',
    minLength: 0,
    maxLength: 0
  };
}

onFieldTypeChange() {
  if (['checkbox', 'radio', 'dropdown'].includes(this.newField.type?.toLowerCase())) {
    if (!this.newField.options) {
      this.newField.options = [''];
    }
    
    // If it's a gender/sex field, automatically set the options
    if ((this.newField.label?.toLowerCase() === 'gender' || this.newField.label?.toLowerCase() === 'sex') 
        && this.newField.type?.toLowerCase() === 'dropdown') {
      this.newField.options = [...this.genderOptions];
    }
  } else {
    this.newField.options = [];
  }
}

// Add this new method to watch for label changes
onLabelChange() {
  const label = this.newField.label?.toLowerCase();
  if (label === 'gender' || label === 'sex') {
    this.newField.type = 'Dropdown';
    this.newField.options = [...this.genderOptions];
  }
}

onFileSelected(event: any, field: any) {
  const file = event.target.files[0];
  if (file) {
    field.file = file;
    field.value = file.name;
  }
}

// Helper method to get form values for submission
getFormValues() {
  console.log('Getting form values from fields:', this.fields);
  
  return this.fields.map(field => {
    // Ensure the attr is properly set with a priority:
    // 1. Use existing attr if available
    // 2. Fall back to empty string if undefined
    const fieldAttr = field.attr !== undefined ? field.attr : '';
    
    const fieldData: any = {
      label: field.label,
      type: field.type,
      required: field.required,
      attr: fieldAttr,  // Ensure attr is included with a default value
      name: field.name || '',
      strength: field.type.toLowerCase() === 'password' ? field.strength : undefined
    };

    if (field.type.toLowerCase() === 'password') {
      fieldData.minLength = field.minLength;
      fieldData.maxLength = field.maxLength;
    }

    switch (field.type.toLowerCase()) {
      case 'checkbox':
        if (field.selectedOptions && field.options) {
          fieldData.value = field.options.filter((_: string, index: number) => field.selectedOptions[index]);
          fieldData.options = field.options;
        }
        break;
      case 'radio':
      case 'dropdown':
        fieldData.value = field.value;
        fieldData.options = field.options;
        break;
      case 'upload':
        if (field.file) {
          fieldData.value = field.file.name;
          fieldData.file = field.file;
        }
        break;
      default:
        fieldData.value = field.value;
    }

    // Log each field to confirm attr is included
    console.log('Field data being saved:', fieldData);
    
    return fieldData;
  });
}

saveSurvey() {
  const isThirdParty = this.selectedTabIndex === 1;
  const isSiteRegistration = this.selectedTabIndex === 0;
  const formValues = this.getFormValues();

  // Show confirmation dialog first
  Swal.fire({
    title: 'Confirm',
    html: `
      ${isThirdParty ? 
        'Do you want use this same third party form for site registration too?' : 
        'Do you want use this same site details form for third party too?'}<br><br>
      <small style="color: #ff6b6b; font-size: 10px; font-style: italic; display: block; margin-top: 8px;">Please note: Once you save, old field values cannot be reverted back</small>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    const useBothForms = result.isConfirmed;
    
    if (useBothForms) {
      const fieldsWithAttr = formValues.map(field => {
        const fieldCopy = { ...field };
        if (!fieldCopy.attr && fieldCopy.attr !== '') {
          fieldCopy.attr = '';
        }
        return fieldCopy;
      });
      
      const siteRegistrationPayload = {
        title: 'Site Registration',
        fields: fieldsWithAttr,
        companyId: this.selectedCompanyId
      };

      const thirdPartyPayload = {
        title: 'Third Party Survey', 
        fields: fieldsWithAttr,
        companyId: this.selectedCompanyId
      };

      if (isThirdParty) {
        this.surveyService.createthirdpartySurvey(thirdPartyPayload).subscribe({
          next: (res) => {
            console.log('Saved as third party form');
            const surveyId = res?.surveyForm?._id;
            if (surveyId) {
              this.editingSurveyId = surveyId;
            }
            
            this.surveyService.createSurvey(siteRegistrationPayload).subscribe({
              next: () => {
                console.log('Saved as site registration form');
                Swal.fire('Success', 'Form saved for both third party and site registration!', 'success').then(() => {
                  if (surveyId) {
                    this.generateEmbeddedCode();
                  }
                });
              },
              error: (err) => {
                console.error('Error saving site registration:', err);
                if (surveyId) {
                  this.generateEmbeddedCode();
                }
              }
            });
          },
          error: (err) => {
            console.error('Error saving third party form:', err);
            Swal.fire('Error', 'Failed to save third party form', 'error');
          }
        });
      } else {
        // If current form is site registration, save to both
        this.surveyService.createSurvey(siteRegistrationPayload).subscribe({
          next: () => {
            console.log('Saved as site registration form');
            
            // Also save as third party
            this.surveyService.createthirdpartySurvey(thirdPartyPayload).subscribe({
              next: (res) => {
                console.log('Saved as third party form');
                const surveyId = res?.surveyForm?._id;
                Swal.fire('Success', 'Form saved for both site registration and third party!', 'success').then(() => {
                  if (surveyId) {
                    this.editingSurveyId = surveyId;
                    this.generateEmbeddedCode();
                  }
                });
              },
              error: (err) => {
                console.error('Error saving third party form:', err);
              }
            });
          },
          error: (err) => {
            console.error('Error saving site registration:', err);
            Swal.fire('Error', 'Failed to save site registration form', 'error');
          }
        });
      }
    } else {
      // Same approach for single form submission - ensure attrs are set
      const fieldsWithAttr = formValues.map(field => {
        const fieldCopy = { ...field };
        if (!fieldCopy.attr && fieldCopy.attr !== '') {
          fieldCopy.attr = '';
        }
        return fieldCopy;
      });
      
      // Create the payload for single form type
      const payload = {
        title: isThirdParty ? 'Third Party Survey' : 'Site Registration',
        fields: fieldsWithAttr,
        companyId: this.selectedCompanyId
      };
      
      console.log('Saving survey with payload:', JSON.stringify(payload, null, 2));

      if (isThirdParty) {
        this.surveyService.createthirdpartySurvey(payload).subscribe({
          next: (res) => {
            const surveyId = res?.surveyForm?._id;
            if (!surveyId) {
              Swal.fire('Error', 'Form saved, but ID is missing. Cannot generate code.', 'error');
              return;
            }

            this.editingSurveyId = surveyId;
            Swal.fire('Success', 'Third party form saved successfully!', 'success').then(() => {
              this.generateEmbeddedCode();
            });
          },
          error: (err) => {
            console.error('Error saving form:', err);
            Swal.fire('Error', 'Failed to save form', 'error');
          }
        });
      } else {
        Swal.fire({
          title: 'Are you sure?',
          text: 'This will save your site registration form to the database.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, save it!'
        }).then(confirmResult => {
          if (confirmResult.isConfirmed) {
            this.surveyService.createSurvey(payload).subscribe({
              next: () => {
                console.log('SITE REGISTRATION SAVE COMPLETE');
                Swal.fire('Saved!', 'Your survey has been saved.', 'success');
              },
              error: err => {
                console.error('Error saving form:', err);
                Swal.fire('Error', 'Something went wrong while saving.', 'error');
              }
            });
          }
        });
      }
    }
  });
}

getRestrictedFieldMessage(): string | null {
  if (!this.newField.label) return null;
  
  const fieldType = Object.entries(this.restrictedLabelPatterns).find(([key, patterns]) => 
    patterns.some(pattern => this.newField.label.toLowerCase().includes(pattern))
  );

  if (fieldType) {
    return `The field "<strong>${this.newField.label}</strong>" cannot be created as it appears to be a <strong>${fieldType[0]}</strong> field. This information will be managed by administrators in the Trainee module.`;
  }

  return null;
}

getAttributeValidationMessage(): string | null {
  if (!this.newField.label) return null;

  // Detect required attribute based on label
  const detectedAttr = this.detectAttributeFromLabel(this.newField.label);
  
  if (detectedAttr) {
    if (!this.newField.attr) {
      return `This field appears to be a <strong>${detectedAttr}</strong> field. Please select <strong>${detectedAttr}</strong> from the Attributes dropdown before creating the field.`;
    } else if (this.newField.attr !== detectedAttr) {
      return `This field appears to be a <strong>${detectedAttr}</strong> field but you selected <strong>${this.newField.attr}</strong>. Please select <strong>${detectedAttr}</strong> from the Attributes dropdown.`;
    }
  }

  return null;
}

// fetchSignupFields() {
//   this.surveyService.getLatestSurvey(this.selectedCompanyId).subscribe({
//     next: (res) => {
//       console.log('dataaaa',res._id)
//       this.surveyId = res._id;
//       this.fields = res.fields || [];
//       // this.buildForm();
//     },
//     error: (err) => {
//       console.error('Failed to fetch signup fields:', err);
//     }
//   });
// }
  
}
