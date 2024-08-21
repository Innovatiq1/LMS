import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LanguageService } from '@core/service/language.service';
import { AuthService } from '@core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  authForm!: UntypedFormGroup;
  langStoreValue?: string;
  submitted = false;
  returnUrl!: string;
  error: any;
  tmsUrl: boolean;
  lmsUrl: boolean;
 // resetLink: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: LanguageService,
    private authService:AuthService
  ) {
    let urlPath = this.router.url.split('/')
    this.tmsUrl = urlPath.includes('TMS');
    this.lmsUrl = urlPath.includes('LMS');

  }
  ngOnInit() {
    this.startSlideshow();
    this.authForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  setLanguage(event: any) {  
    this.langStoreValue = event.target.value;
    this.translate.setLanguage(event.target.value);
  }
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Chinese', flag: 'assets/images/flags/spain.svg', lang: 'ch' },
    { text: 'Tamil', flag: 'assets/images/flags/germany.svg', lang: 'ts' },
  ];

  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {

      return;
    } else {
      this.authService.forgotPassword(this.authForm.value).subscribe({next: (res) => {
        if (res) {
          Swal.fire({
            title: 'Email Send Successful',
            text: "We have sent new password to your email successfully.",
            icon: 'success',
          });
          if(this.tmsUrl){
          this.router.navigate(['/authentication/TMS/signin']);
          } else if(this.lmsUrl){
            this.router.navigate(['/authentication/LMS/signin']);
            }
          
          
        } else {
        }
      },
      error: (error) => {
        this.error = error;
        this.submitted = false;
      },
    });
      
    }
  }
  images: string[] = ['/assets/images/login/Learning.jpeg', '/assets/images/login/learning2.jpg', '/assets/images/login/learning4.jpg'];
    currentIndex = 0;

  startSlideshow() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000);
  }
 
}
