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
    'assets/images/login/Learning.jpeg',
    // 'assets/images/login/learning2.jpg',
    // 'assets/images/login/learning4.jpg',
  ];
  currentIndex = 0;
  CompanyId!: string;
  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('user_data')!);
    this.CompanyId = userData.user.companyId;
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
        this.fields = res.fields || [];
        this.buildForm();
      },
      error: (err) => {
        console.error('Failed to fetch signup fields:', err);
      }
    });
  }

  buildForm() {
    const group: any = {};

    this.fields.forEach(field => {
      const validators = [];
      const controlName = this.sanitizeControlName(field.label);

      if (field.required) validators.push(Validators.required);
      if (field.type === 'Text') validators.push(Validators.minLength(3));
      if (field.type === 'Dropdown') validators.push(Validators.required);
      if (field.type === 'radio') validators.push(Validators.required);
      if (field.type === 'Password') {
        validators.push(Validators.minLength(8));
        validators.push(Validators.maxLength(20));
        validators.push(passwordValidator(field));  // Apply the custom password validator
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
    const passwordCtrl = form.get('password');
    const confirmCtrl = form.get('confirmpassword');

    if (!passwordCtrl || !confirmCtrl) return null;

    const password = passwordCtrl.value;
    const confirmPassword = confirmCtrl.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (!control) return '';
    if (control.hasError('required')) return `${controlName} is required`;
    if (control.hasError('email')) return `Please enter a valid email`;
    if (control.hasError('passwordStrength')) return `Password must be stronger`;
    if (control.hasError('mismatch')) return `Passwords do not match`;
    if (control.hasError('pattern')) return `Invalid input for ${controlName}`;
    return 'Invalid input';
  }

  submitForm() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }

    const data = this.signupForm.value;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create your account?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.surveyService.createUser(data).subscribe({
          next: (res) => {
            this.submittedData = data;
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
            Swal.fire({
              title: 'Registration Failed',
              text: "You have exceeded your limit, please contact Admin to upgrade",
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
      const control = this.signupForm.get(controlName);
      control?.setValue(file);
      control?.markAsTouched();
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
