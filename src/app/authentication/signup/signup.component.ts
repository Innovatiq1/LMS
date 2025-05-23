import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SurveyService } from '@core/service/survey.service';
import { passwordStrengthValidator } from '@core/customvalidator';
import {passwordValidator} from '@core/validators/password-validator'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  maxDate!: Date;
  fields: any[] = [];
  submittedData: any = null;
  images: string[] = [
    'assets/images/login/sign-up.png',
    // 'assets/images/login/learning2.jpg',
    // 'assets/images/login/learning4.jpg',
  ];
  currentIndex = 0;
  CompanyId!: string;
  extractedName!: string;
  defaultFields = [
    {
      label: 'Username',
      type: 'Text',
      required: true,
      attr: 'Name'
    },
    {
      label: 'Email',
      type: 'Email',
      required: true,
      attr: 'email'
    },
    {
      label: 'Password',
      type: 'Password',
      required: true,
      attr: 'password',
      minLength: 8,
      maxLength: 20
    },
    {
      label: 'Confirm Password',
      type: 'Password',
      required: true,
      attr: 'Password',
      minLength: 8,
      maxLength: 20
    }
  ];
  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.CompanyId = localStorage.getItem('companyId')||'';
    this.fetchSignupFields();
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000); 
    const today = new Date();
    this.maxDate = new Date(today.setDate(today.getDate() - 1));
  }

  fetchSignupFields() {
    this.surveyService.getLatestSurvey(this.CompanyId).subscribe({
      next: (res) => {
        // If config form fields are empty or not available, use default fields
        if (!res.fields || res.fields.length === 0) {
          this.fields = this.defaultFields;
          this.buildForm();
        } else {
          this.fields = res.fields;
          this.buildForm();
        }
      },
      error: (err) => {
        console.error('Failed to fetch signup fields:', err);
        // On error, fallback to default fields
        this.fields = this.defaultFields;
        this.buildForm();
      }
    });
  }

  buildForm() {
    const group: any = {};

    this.fields.forEach(field => {
      const validators = [];
      const controlName = this.sanitizeControlName(field.label);

      if (field.required) validators.push(Validators.required);
      if (field.type === 'Dropdown') validators.push(Validators.required);
      if (field.type === 'radio') validators.push(Validators.required);
      if (field.type === 'Password') {
        if (field.minLength) validators.push(Validators.minLength(field.minLength));
        if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
        validators.push(passwordValidator(field));  
      }
      if (field.type === 'Email') validators.push(Validators.email);
      if (field.type === 'Number') validators.push(Validators.pattern(/^\d+$/));
      if (field.type === 'Phone') validators.push(Validators.pattern(/^\d{10}$/));
      if (field.type === 'TextArea') validators.push(Validators.maxLength(500));
      if (field.type === 'File' || field.type === 'Date') validators.push(Validators.required);

      if (field.type === 'Checkbox') {
        validators.push((control: AbstractControl) => {
          return control.value && control.value.length > 0 ? null : { required: true };
        });
        group[controlName] = new FormControl([], validators);
      } else {
        group[controlName] = new FormControl('', validators);
      }
    });

    // Create form with validator
    this.signupForm = new FormGroup(group, { validators: this.passwordMatchValidator.bind(this) });
  }

  sanitizeControlName(label: string): string {
    return label.toLowerCase().replace(/\s+/g, '');
  }

  passwordMatchValidator(form: AbstractControl): { [key: string]: any } | null {
    const passwordField = this.fields.find(f => f.type?.toLowerCase() === 'password' && !f.label?.toLowerCase().includes('confirm'));
    const confirmPasswordField = this.fields.find(f => 
      f.type?.toLowerCase() === 'password' && 
      (f.label?.toLowerCase().includes('confirm') || f.label?.toLowerCase().includes('verify'))
    );
    
    if (!passwordField || !confirmPasswordField) return null;
    
    const passwordCtrl = form.get(this.sanitizeControlName(passwordField.label));
    const confirmCtrl = form.get(this.sanitizeControlName(confirmPasswordField.label));

    if (!passwordCtrl || !confirmCtrl) return null;

    if (passwordCtrl.value !== confirmCtrl.value) {
      confirmCtrl.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    // Clear the mismatch error if passwords match
    if (confirmCtrl.errors?.['mismatch']) {
      const errors = { ...confirmCtrl.errors };
      delete errors['mismatch'];
      confirmCtrl.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }

  getInputType(fieldType: string | undefined): string {
    if (!fieldType) return 'text';
    
    const type = fieldType.toLowerCase();
    switch (type) {
      case 'email': return 'email';
      case 'number': return 'number';
      case 'password': return 'password';
      case 'tel': return 'tel';
      case 'url': return 'url';
      default: return 'text';
    }
  }

  getErrorMessage(field: any): string {
    const control = this.signupForm.get(this.sanitizeControlName(field.label));
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    
    if (errors['required']) return `${field.label} is required`;
    if (errors['email']) return 'Invalid email format';
    if (errors['pattern']) return `Invalid ${this.sanitizeControlName(field.label)} format`;
    if (field.type === 'Password') {
      if (errors['minlength']) return `${field.label} must be at least ${field.minLength} characters`;
      if (errors['maxlength']) return `${field.label} must be no more than ${field.maxLength} characters`;
      if (errors['strongPassword']) return 'Password must contain uppercase, lowercase, number, and special character';
      if (errors['mismatch']) return 'Passwords do not match';
    }
    
    return 'Invalid input';
  }

  submitForm() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }

    const formValues = this.signupForm.value;
    const formData = new FormData();
    
    // Add the companyId directly to the FormData
    formData.append('companyId', this.CompanyId);
    
    // Add formtype if using default form
    if (this.fields === this.defaultFields) {
      formData.append('formtype', 'default');
    }
    
    // Process each field
    this.fields.forEach(field => {
      const controlName = this.sanitizeControlName(field.label);
      const fieldValue = formValues[controlName];
      
      // Handle file fields
      if ((field.type === 'upload' || field.type === 'Upload' || field.type === 'file' || field.type === 'File') && fieldValue instanceof File) {
        // Append the file directly with the field's label as the key
        formData.append(field.label, fieldValue);
      } else {
        // Append regular field values directly to the FormData
        formData.append(field.label, fieldValue);
      }
    });
    
    // Confirm and submit with files
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create your account?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Submitting form with files');
        this.surveyService.createUserWithFiles(formData).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Registration Successful',
              text: "Our team will verify and contact you shortly",
              icon: 'success',
              timer: 5000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/authentication/LMS/signin']);
            });
          },
          error: (err) => {
            console.error('Registration error:', err);
            Swal.fire({
              title: 'Registration Failed',
              text: err,
              icon: 'error',
            });
          }
        });
      }
    });
  }
  checkDobValidation(field: any, event: any): void {
    const selectedDate = new Date(event.value);
    const maxAllowedDate = new Date();
    maxAllowedDate.setHours(0, 0, 0, 0);
    maxAllowedDate.setDate(maxAllowedDate.getDate() - 1); // yesterday
  
    selectedDate.setHours(0, 0, 0, 0);
  
    field.isInvalidDob = selectedDate > maxAllowedDate;
  }
  
  startSlideshow() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      // Store the file directly for FormData submission
      const control = this.signupForm.get(controlName);
      control?.setValue(file);
      control?.markAsTouched();

      // For profile image, you can preview it if needed
      if (controlName.toLowerCase().includes('profile') || controlName.toLowerCase().includes('image')) {
        // Create a preview URL for the image
        const reader = new FileReader();
        reader.onload = () => {
          // You can store the preview URL in a component property if needed
          // this.imagePreview = reader.result as string;
          console.log('Image loaded for preview');
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onCheckboxChange(event: any, controlName: string) {
    const control = this.signupForm.get(controlName);
    let currentValue = control?.value || [];

    if (event.checked) {
      currentValue.push(event.source.value);
    } else {
      currentValue = currentValue.filter((val: string) => val !== event.source.value);
    }

    control?.setValue(currentValue);
    control?.markAsTouched();
  }
}
