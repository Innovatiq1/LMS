declare var google: any
import { Component, OnInit, Input, OnChanges, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AuthenService } from '@core/service/authen.service';
import { LanguageService } from '@core/service/language.service';
import { UtilsService } from '@core/service/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '@core/service/admin.service';
import Swal from 'sweetalert2';
import { UserService } from '@core/service/user.service';
import { RegistrationService } from '@core/service/registration.service';
import { SuperAdminService } from 'app/superAdmin/super-admin.service';
import { CommonService } from '@core/service/common.service';
import { AppConstants } from '@shared/constants/app.constants';
import { Role } from '../../../app/core/models/role';
import { TwoFactorAuthService } from '@core/service/twoFactorAuth.service';
import { SettingsService } from '@core/service/settings.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  @ViewChild('profileDialog') profileDialog!: TemplateRef<any>;

  // strength: string = '';
  authForm!: UntypedFormGroup;
  profileForm!: FormGroup;
  langStoreValue?: string;
  submitted = false;
  loading = false;
  isLoading = false;
  error = '';
  hide = true;
  isSubmitted = false;
  email: any;
  password: any;
  tmsUrl: boolean;
  lmsUrl: boolean;
  accountDetails: any;
  userTypes: any;
  http: any;
  linkedinUrl: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authenticationService: AuthenService,
    public utils: UtilsService,
    private translate: LanguageService,
    private dialog: MatDialog,
    private adminService: AdminService,
    private userService: UserService,
    private registration: RegistrationService,
    private superadminservice: SuperAdminService,
    private commonService: CommonService,
    private twoFactorAuthService: TwoFactorAuthService,
    private settingsService: SettingsService,

  ) {
    super();
    let urlPath = this.router.url.split('/');
    this.tmsUrl = urlPath.includes('TMS');
    this.lmsUrl = urlPath.includes('LMS');
    this.linkedinUrl = urlPath.includes('linkedin');

    this.authForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ],
      ],
      password: ['', Validators.required],
    });
  }
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Chinese', flag: 'assets/images/flags/spain.svg', lang: 'ch' },
    { text: 'Tamil', flag: 'assets/images/flags/germany.svg', lang: 'ts' },
  ];

  ngOnInit() {
    this.startSlideshow();
    if (this.linkedinUrl) {
      //Linkedin
      this.handleLinkedIn();
    } else {
      google.accounts.id.initialize({
        client_id: '254303785853-4av7vt4kjc2fus3rgf01e3ltnp2icad0.apps.googleusercontent.com',
        callback: (res: any) => {
          this.handleGmailLogin(res)
        }
      })
      // google.accounts.id.renderButton(document.getElementById("google-btn"), {
      //   theme: 'filled_blue',
      //   size: 'large',
      //   shape: 'rectangle',
      //   width: 450
      // })
    const googleBtnContainer = document.getElementById("google-btn")?.querySelector("button");
    if (googleBtnContainer) {
      google.accounts.id.renderButton(googleBtnContainer, {
          type: 'icon',
      });

      // Apply your custom styling by adding a class
      googleBtnContainer.classList.add("login-btn");
  }
    }



  }
  handleGmailLogin(data: any) {
    if (data) {
      const payload = this.decodeGmailToken(data.credential)
      this.accountDetails = payload
      let body = {
        name: payload.given_name,
        avatar: payload.picture,
        last_name: payload.family_name,
        email: payload.email,
        authToken: data.credential, // Include the raw token as authToken
        id: payload.sub,
        gmail: true
      }
      this.authenticationService.socialLogin({ email: payload.email, social_type: 'GOOGLE', social_id: payload.sub }).subscribe(
        (user: any) => {

          if (user) {
            setTimeout(() => {
              this.router.navigate(['/dashboard/dashboard']);
              this.loading = false;
            }, 100);
            this.authenticationService.saveUserInfo(user);
            let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.superadminservice.getAllCustomRoleById(userId).subscribe(
              (response: any) => {
                this.commonService.setRoleDetails(response[0])
                this.updateRoleConstants();

              })

          }
        },
        (err: any) => {
          if (err == "user not found!") {
            this.getUserTypeList();
            this.profileForm = this.formBuilder.group({
              role: ['', Validators.required],
              email: [this.accountDetails.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
              name: [this.accountDetails.name, Validators.required],
              password: [''],
            })

            this.openDialog(this.profileDialog)

          } else {
          }
        }
      )

    }

  }
  loginLinkedIn(): void {
    this.authenticationService.loginWithLinkedIn();
  }

  handleLinkedIn(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.authenticationService.AccessToken(code).subscribe(
          (response: any) => {
            const accessToken = response.access_token;
            this.authenticationService.getProfileData(accessToken).subscribe(
              (profile: any) => {
                this.accountDetails = profile;
                const email = profile.email;
                this.authenticationService.socialLogin({ email: email, social_type: 'LINKEDIN', social_id: profile.sub }).subscribe(
                  (user: any) => {

                    if (user) {
                      setTimeout(() => {
                        this.router.navigate(['/dashboard/dashboard']);
                        this.loading = false;
                      }, 100);
                      this.authenticationService.saveUserInfo(user);
                      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
                      this.superadminservice.getAllCustomRoleById(userId).subscribe(
                        (response: any) => {
                          this.commonService.setRoleDetails(response[0])
                          this.updateRoleConstants();

                        })

                    }
                  },
                  (err: any) => {
                    if (err == "user not found!") {
                      this.getUserTypeList();
                      this.profileForm = this.formBuilder.group({
                        role: ['', Validators.required],
                        email: [this.accountDetails.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
                        name: [this.accountDetails.name, Validators.required],
                        password: [''],
                      })

                      this.openDialog(this.profileDialog)

                    } else {
                    }
                  }
                )
              },
              (error) => {
                console.error('Error fetching LinkedIn profile data:', error);
              }
            );
          },
          (error) => {
            console.error('Error fetching LinkedIn access token:', error);
          }
        );
      }
    });
  }

  openDialog(templateRef: any): void {
    const dialogRef = this.dialog.open(templateRef, {
      width: '1000px',
      data: { account: this.accountDetails },
    });
  }
  getUserTypeList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.adminService.getUserTypeList({ allRows: true }, userId).subscribe(
      (response: any) => {
        this.userTypes = response;
      },
      (error) => { }
    );
  }

  create(dialogRef: any) {

    if (this.profileForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create user!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.profileForm.value.Active = true;
          this.profileForm.value.type = this.profileForm.value.role;
          this.profileForm.value.isLogin = true;
          this.profileForm.value.avatar = this.accountDetails.picture
          this.registration.socialLoginRegisterUser(this.profileForm.value).subscribe(
            () => {
              Swal.fire({
                title: 'Successful',
                text: 'User created successfully',
                icon: 'success',
              });
              this.profileForm.reset();
              dialogRef.close();

            },
            (error) => {
              Swal.fire(
                error,
                error.message || error.error,
                'error'
              );
            }
          );
        }
      });

    } else {
      this.isSubmitted = true;
    }
  }

  // private linkedInCredentials = {
  //   response_type: "code",
  //   clientId: "86ggwpa949d3u5", //77u10423gsm7cx
  //   //redirectUrl: `${DEFAULT_CONFIG.frontEndUrl}linkedInLogin`,
  //   redirectUrl: "http%3A%2F%2F54.254.159.3%2FlinkedInLogin",
  //   state: 23101992,
  //   scope: "r_liteprofile%20r_emailaddress%20w_member_social",
  // };


  // loginWithlinkedin()
  // { 
  //   window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
  //     this.linkedInCredentials.clientId
  //   }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;
  // } 


  private decodeGmailToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]));
  }
  get f() {
    return this.authForm.controls;
  }



  adminSet() {
    this.authForm.get('email')?.setValue('admin1@tms.com');
    this.authForm.get('password')?.setValue('12345678');
  }
  studentSet() {
    this.authForm.get('email')?.setValue('teo.su@yahooo.com');
    this.authForm.get('password')?.setValue('12345678');
  }
  teacherSet() {
    this.authForm.get('email')?.setValue('timothy.chow@yahooo.com');
    this.authForm.get('password')?.setValue('12345678');
  }

  private updateRoleConstants(): void {
    const roleDetails = this.commonService.getRoleDetails();
    AppConstants.INSTRUCTOR_ROLE = roleDetails.trainer; // Update the role constant
    AppConstants.STUDENT_ROLE = roleDetails.learner; // Update the role constant

    AppConstants.ALLTHREEROLES = [roleDetails.trainer, 'Admin', 'admin', 'Assessor']
    localStorage.setItem('role_data', JSON.stringify(roleDetails));


  }
  loginUser() {
    let formData = this.authForm.getRawValue();
    this.isLoading = true;
    this.authenticationService
      .loginUser(formData.email.trim(), formData.password.trim())
      .subscribe(
        (user) => {
          // setTimeout(() => {
          //   const role = this.authenticationService.currentUserValue.user.role;
          //   this.router.navigate(['/admin/two-factor-auth']);
          //   this.loading = false;
          // }, 100);
          this.authenticationService.saveUserInfo(user);
          let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
          this.superadminservice.getAllCustomRoleById(userId).subscribe(
            (response: any) => {
              console.log('res',response)
              this.commonService.setRoleDetails(response[0])
              this.updateRoleConstants();

            })

          this.adminService.getUserTypeList({ allRows: true }, userId).subscribe(
            (response: any) => {
              let userType = localStorage.getItem('user_type');
              let data = response.filter((item: any) => item.typeName === userType);

              this.authenticationService.saveRoleDetails(data);

            })

            this.setup2FA(formData.email.trim());
        },
        (error) => {
          this.isLoading = false;
          this.email = error;
          this.isSubmitted = true;
          setTimeout(() => {
            this.email = '';
          }, 2500);
        }
      );
  }
  setup2FA(email: string) {
    this.isLoading = true; 
    let userId = localStorage.getItem('id');
  
    if (!userId) {
      this.handleError('User ID not found in local storage.');
      return; 
    }
  
    this.settingsService.getTwoFAById(userId).subscribe(
      (response) => {
        if (response && response[0]?.status == 'on') {
          this.twoFactorAuthService.setup2FA(email).subscribe(
            (setupResponse) => {
              this.router.navigate(['/admin/two-factor-auth'], { 
                state: { 
                  qrCode: setupResponse.qrCode, 
                  secret: setupResponse.secret 
                } 
              });
            },
            (setupError) => {
              this.handleError('Failed to set up 2FA.');
            }
          );
        } else {
          this.router.navigate(['/dashboard/dashboard']);
        }
      },
      (error) => {
        this.handleError('Failed to check 2FA status.');
      }
    );
  }
  
  // Common error handling method
  // handleError(errorMessage: string) {
  //   console.error(errorMessage);
  //   this.isLoading = false;
  //   this.email = errorMessage;
  //   this.isSubmitted = true;
  //   setTimeout(() => {
  //     this.email = '';
  //   }, 2500);
  // }
  

  // Common error handling method
  handleError(errorMessage: string) {
    console.error(errorMessage);
    this.isLoading = false;
    this.email = errorMessage;
    this.isSubmitted = true;
    setTimeout(() => {
      this.email = '';
    }, 2500);
  }
  setLanguage(event: any) {
    // this.countryName = text;
    // this.flagvalue = flag;
    this.langStoreValue = event.target.value;
    this.translate.setLanguage(event.target.value);
  }

  images: string[] = [
    '/assets/images/login/Learning.jpeg',
    '/assets/images/login/learning2.jpg',
    '/assets/images/login/learning4.jpg',
  ];
  currentIndex = 0;

  startSlideshow() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000);
  }
  goBack() {
    this.router.navigate(['/authentication/signin-role']);
  }
}
