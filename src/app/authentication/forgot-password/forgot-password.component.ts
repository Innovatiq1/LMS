import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LanguageService } from '@core/service/language.service';
import { AuthService } from '@core';
import Swal from 'sweetalert2';
import { CommonService } from '@core/service/common.service';
import { AuthenService } from '@core/service/authen.service';
import { UserService } from '@core/service/user.service';

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
  extractedName: string;

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Chinese', flag: 'assets/images/flags/spain.svg', lang: 'ch' },
    { text: 'Tamil', flag: 'assets/images/flags/germany.svg', lang: 'ts' },
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: LanguageService,
    private authService: AuthService,
    private commonService: CommonService,
    private authenticationService: AuthenService,
    private userService: UserService
  ) {
    let urlPath = this.router.url.split('/');
    this.tmsUrl = urlPath.includes('TMS');
    this.lmsUrl = urlPath.includes('LMS');
    this.extractedName = urlPath[1];
  }

  ngOnInit() {
    // this.startSlideshow();
    // this.authForm = this.formBuilder.group({
    //   email: [
    //     '',
    //     [Validators.required, Validators.email, Validators.minLength(5)],
    //   ],
    // });
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.startSlideshow();

    this.authForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(5),
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/)
        ],
      ],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  setLanguage(event: any) {  
    this.langStoreValue = event.target.value;
    this.translate.setLanguage(event.target.value);
  }

  get f() {
    return this.authForm.controls;
  }

  signin() {
    if (this.tmsUrl) {
      this.commonService.navigateWithCompanyName(this.extractedName, 'authentication/TMS/signin');
    } else if (this.lmsUrl) {
      this.commonService.navigateWithCompanyName(this.extractedName, 'authentication/LMS/signin');
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    } else {
      let formData = this.authForm.getRawValue();
      this.userService.getCompanyByIdentifierWithoutToken(this.extractedName).subscribe((res: any) => {
        let companyId = res[0]?.companyId;
        this.authenticationService.getUsersByEmail(formData.email.trim(), companyId).subscribe(
          (user: any) => {
            if (user && user.data && user.data[0].isLogin) {
              let body = {
                email: this.authForm.value.email,
                companyId: companyId,
                subdomain: this.extractedName
              };
              this.authService.forgotPassword(body).subscribe({
                next: (res) => {
                  if (res) {
                    Swal.fire({
                      title: 'Email Sent Successfully',
                      text: "We have sent a new password to your email successfully.",
                      icon: 'success',
                    });
                    if (this.tmsUrl) {
                      this.router.navigate([`${this.extractedName}/authentication/TMS/signin`]);
                    } else if (this.lmsUrl) {
                      this.router.navigate([`${this.extractedName}/authentication/LMS/signin`]);
                    }
                  }
                },
                error: (err) => {  
                  console.error('Error sending forgot password request:', err);
                  this.error = err;  
                  this.submitted = false;
                }
              });
            } else {
              this.error = "Your account is not yet activated.";
              this.submitted = false;
            }
          },
          (err) => {  
            console.error('Error fetching user:', err);
            this.error = err;  
            this.submitted = false;
          }
        );
      });
    }
  }

  images: string[] = [
    '/assets/images/login/Learning.jpeg',
    '/assets/images/login/learning2.jpg',
    '/assets/images/login/learning4.jpg'
  ];
  currentIndex = 0;

  startSlideshow() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000);
  }
}
