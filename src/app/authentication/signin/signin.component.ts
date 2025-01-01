declare var google: any;
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewChild,
  TemplateRef,
} from '@angular/core';
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
  implements OnInit
{
  @ViewChild('profileDialog') profileDialog!: TemplateRef<any>;
  @ViewChild('companiesDialog') companiesDialog!: TemplateRef<any>;

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
  extractedName: string;
  companyId: any;
  companies: any;
  selectedCompany!: string;
  loginType!: string;
  body: any;
  linkedinKeys: any;
  domain: any;

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
    private settingsService: SettingsService
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

    const pathSegments = this.router.url.split('/');
    this.extractedName = pathSegments[1];
  }
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Chinese', flag: 'assets/images/flags/spain.svg', lang: 'ch' },
    { text: 'Tamil', flag: 'assets/images/flags/germany.svg', lang: 'ts' },
  ];

  signup() {
    this.commonService.navigateWithCompanyName(
      this.extractedName,
      'authentication/LMS/signup'
    );
  }

  onCompanyChange(event: any): void {
    console.log('Selected company:', this.selectedCompany);
  }

  forgotpassword() {
    if (this.tmsUrl) {
      this.commonService.navigateWithCompanyName(
        this.extractedName,
        'authentication/TMS/forgot-password'
      );
    } else if (this.lmsUrl) {
      this.commonService.navigateWithCompanyName(
        this.extractedName,
        'authentication/LMS/forgot-password'
      );
    }
  }
  ngOnInit() {
    this.userService
      .getCompanyByIdentifierWithoutToken(this.extractedName)
      .subscribe((resp: any) => {
        let companyId = resp[0]?.companyId;
        this.domain = resp[0]?.company;
        this.settingsService
          .getKeysByCompanyId(companyId)
          .subscribe((res: any) => {
            let gmail = res.data.filter((item: any) => item.type == 'google');
            let linkedin = res.data.filter(
              (item: any) => item.type == 'linkedin'
            );
            this.linkedinKeys = linkedin[0];

            history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      history.pushState(null, '', window.location.href);
    };
  
    this.startSlideshow();
            if (this.linkedinUrl) {
              let body = {
                redirectUri: linkedin[0]?.redirectUri,
                clientId: linkedin[0]?.clientId,
                clientSecret: linkedin[0]?.clientSecret,
              };
                      this.handleLinkedIn(body);
            }
            google.accounts.id.initialize({
              client_id:
                gmail.length > 0
                  ? gmail[0].clientId
                  : '254303785853-4av7vt4kjc2fus3rgf01e3ltnp2icad0.apps.googleusercontent.com',
              callback: (res: any) => {
                this.handleGmailLogin(res);
              },
            });
            // google.accounts.id.renderButton(document.getElementById("google-btn"), {
            //   theme: 'filled_blue',
            //   size: 'large',
            //   shape: 'rectangle',
            //   width: 450
            // })
            const googleBtnContainer = document
              .getElementById('google-btn')
              ?.querySelector('button');
            if (googleBtnContainer) {
              google.accounts.id.renderButton(googleBtnContainer, {
                type: 'icon',
              });

              // Apply your custom styling by adding a class
              googleBtnContainer.classList.add('login-btn');
            }
          });
      }); 
  }
  handleGmailLogin(data: any) {
    if (data) {
      const payload = this.decodeGmailToken(data.credential);
      this.accountDetails = payload;
      let body = {
        name: payload.given_name,
        avatar: payload.picture,
        last_name: payload.family_name,
        email: payload.email,
        authToken: data.credential, // Include the raw token as authToken
        id: payload.sub,
        gmail: true,
      };
      if (this.extractedName == 'authentication') {
        this.authenticationService
          .getUsersByEmail(payload.email)
          .subscribe((res: any) => {
            this.companies = res.data;
            this.openCompanyDialog(this.companiesDialog, 'gmail');
          });
      } else {
        this.userService
          .getCompanyByIdentifierWithoutToken(this.extractedName)
          .subscribe((res: any) => {
            let companyId = res[0]?.companyId;
            this.authenticationService
              .socialLogin({
                email: payload.email,
                social_type: 'GOOGLE',
                social_id: payload.sub,
                companyId: companyId,
              })
              .subscribe(
                (user: any) => {
                  if (user) {
                    // setTimeout(() => {
                    //   this.router.navigate(['/dashboard/dashboard']);
                    //   this.loading = false;
                    // }, 100);
                    this.authenticationService.saveUserInfo(user);
                    let userId = JSON.parse(localStorage.getItem('user_data')!)
                      .user.companyId;
                    this.superadminservice
                      .getAllCustomRoleById(userId)
                      .subscribe((res: any) => {
                        localStorage.setItem('subdomain', res[0]?.identifier);
                        this.superadminservice
                          .getAllCustomRoleById(userId)
                          .subscribe((response: any) => {
                            this.adminService
                              .getUserTypeList({ allRows: true }, userId)
                              .subscribe((response: any) => {
                                let userType =
                                  localStorage.getItem('user_type');
                                let data = response.filter(
                                  (item: any) => item.typeName === userType
                                );

                                this.authenticationService.saveRoleDetails(
                                  data
                                );
                              });
                            this.commonService.setRoleDetails(response[0]);
                            this.updateRoleConstants();
                            this.setup2FA(this.accountDetails.email);
                          });
                      });
                  }
                },
                (err: any) => {
                  console.log('err', err);
                  if (err == 'user not found!') {
                    this.userService
                      .getCompanyByIdentifierWithoutToken(this.extractedName)
                      .subscribe((res: any) => {
                        this.companyId = res[0]?.companyId;

                        this.getUserTypeList();
                        this.profileForm = this.formBuilder.group({
                          role: ['', Validators.required],
                          email: [
                            this.accountDetails.email,
                            [
                              Validators.required,
                              Validators.pattern(
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                              ),
                            ],
                          ],
                          name: [this.accountDetails.name, Validators.required],
                          password: [''],
                        });

                        this.openDialog(this.profileDialog);
                      });
                  } else {
                  }
                }
              );
          });
      }
    }
  }
  loginLinkedIn(): void {
    if (this.extractedName == 'authentication') {
      this.authenticationService.loginWithLinkedIn();
    } else {
      this.authenticationService.loginWithLinkedIn(
        this.extractedName,
        this.linkedinKeys
      );
    }
  }

  handleLinkedIn(data: any): void {
    this.userService
      .getCompanyByIdentifierWithoutToken(this.extractedName)
      .subscribe((res: any) => {
        let userData = {
          companyId: res[0]?.companyId,
        };
        // localStorage.setItem('user_data', JSON.stringify(user));

        // userData.companyId = res[0]?.companyId;
        this.route.queryParams.subscribe((params) => {
          const code = params['code'];
          if (code) {
            if (this.extractedName == 'authentication') {
              this.body = {
                code: code,
                redirectUri: data?.redirectUri,
                clientId: data?.clientId,
                clientSecret: data?.clientSecret,
              };
            } else {
              this.body = {
                code: code,
                companyName: this.extractedName,
                redirectUri: data?.redirectUri,
                clientId: data?.clientId,
                clientSecret: data?.clientSecret,
              };
            }

            this.authenticationService.AccessToken(this.body).subscribe(
              (response: any) => {
                const accessToken = response.access_token;
                this.authenticationService
                  .getProfileData(accessToken)
                  .subscribe(
                    (profile: any) => {
                      this.accountDetails = profile;
                      const email = profile.email;
                      if (this.extractedName == 'authentication') {
                        this.authenticationService
                          .getUsersByEmail(email)
                          .subscribe((res: any) => {
                            this.companies = res.data;
                            this.openCompanyDialog(
                              this.companiesDialog,
                              'linkedin'
                            );
                          });
                      } else {
                        this.authenticationService
                          .socialLogin({
                            email: email,
                            social_type: 'LINKEDIN',
                            social_id: profile.sub,
                            companyId: userData.companyId,
                          })
                          .subscribe(
                            (user: any) => {
                              if (user) {
                                // setTimeout(() => {
                                //   this.router.navigate(['/dashboard/dashboard']);
                                //   this.loading = false;
                                // }, 100);
                                this.authenticationService.saveUserInfo(user);
                                let userId = JSON.parse(
                                  localStorage.getItem('user_data')!
                                ).user.companyId;
                                this.superadminservice
                                  .getAllCustomRoleById(userId)
                                  .subscribe((res: any) => {
                                    localStorage.setItem(
                                      'subdomain',
                                      res[0]?.identifier
                                    );
                                    this.superadminservice
                                      .getAllCustomRoleById(userId)
                                      .subscribe((response: any) => {
                                        this.adminService
                                          .getUserTypeList(
                                            { allRows: true },
                                            userId
                                          )
                                          .subscribe((response: any) => {
                                            let userType =
                                              localStorage.getItem('user_type');
                                            let data = response.filter(
                                              (item: any) =>
                                                item.typeName === userType
                                            );

                                            this.authenticationService.saveRoleDetails(
                                              data
                                            );
                                          });
                                        this.commonService.setRoleDetails(
                                          response[0]
                                        );
                                        this.updateRoleConstants();
                                        this.setup2FA(
                                          this.accountDetails.email
                                        );
                                      });
                                  });
                              }
                            },
                            (err: any) => {
                              if (err == 'user not found!') {
                                this.getUserTypeList();
                                this.profileForm = this.formBuilder.group({
                                  role: ['', Validators.required],
                                  email: [
                                    this.accountDetails.email,
                                    [
                                      Validators.required,
                                      Validators.pattern(
                                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                                      ),
                                    ],
                                  ],
                                  name: [
                                    this.accountDetails.name,
                                    Validators.required,
                                  ],
                                  password: [''],
                                });

                                this.openDialog(this.profileDialog);
                              } else {
                              }
                            }
                          );
                      }
                    },
                    (error) => {
                      console.error(
                        'Error fetching LinkedIn profile data:',
                        error
                      );
                    }
                  );
              },
              (error) => {
                console.error('Error fetching LinkedIn access token:', error);
              }
            );
          }
        });
      });
  }

  openDialog(templateRef: any): void {
    const dialogRef = this.dialog.open(templateRef, {
      width: '1000px',
      data: { account: this.accountDetails },
    });
  }

  openCompanyDialog(templateRef: any, loginType: string): void {
    this.loginType = loginType;
    const dialogRef = this.dialog.open(templateRef, {
      width: '500px',
      data: this.companies,
    });
  }
  getUserTypeList() {
    this.adminService
      .getUserTypeList({ allRows: true }, this.companyId)
      .subscribe(
        (response: any) => {
          this.userTypes = response;
        },
        (error) => {}
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
          this.userService
            .getCompanyByIdentifierWithoutToken(this.extractedName)
            .subscribe((res: any) => {
              (this.profileForm.value.companyId = res[0]?.companyId),
                (this.profileForm.value.company = res[0]?.company),
                (this.profileForm.value.domain = res[0]?.identifier);
              this.profileForm.value.Active = true;
              this.profileForm.value.type = this.profileForm.value.role;
              this.profileForm.value.isLogin = true;
              this.profileForm.value.avatar = this.accountDetails.picture;
              this.registration
                .socialLoginRegisterUser(this.profileForm.value)
                .subscribe(
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
                    Swal.fire(error, error.message || error.error, 'error');
                  }
                );
            });
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
    return JSON.parse(atob(token.split('.')[1]));
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

    AppConstants.ALLTHREEROLES = [
      roleDetails.trainer,
      'Admin',
      'admin',
      'Assessor',
    ];
    localStorage.setItem('role_data', JSON.stringify(roleDetails));
  }
  loginUser() {
    let formData = this.authForm.getRawValue();
    if (formData.email.trim() === 'superadmin1@tms.com') {
      this.isLoading = true;
      this.userService.getCompanyByIdentifierWithoutToken(this.extractedName).subscribe(
        (res: any) => {
          console.log("1st",res)
          let companyId = res[0]?.companyId;
          this.authenticationService
            .loginUser(
              formData.email.trim(),
              formData.password.trim(),
              companyId
            )
            .subscribe(
              (user) => {
                console.log("2st",user)
                this.authenticationService.saveUserInfo(user);
                localStorage.setItem('uen', res[0]?.uen || '');
                let userId = JSON.parse(localStorage.getItem('user_data')!).user
                  .companyId;

                this.superadminservice
                  .getAllCustomRoleById(userId)
                  .subscribe((response: any) => {
                    localStorage.setItem('subdomain', response[0]?.identifier);
                    this.commonService.setRoleDetails(response[0]);
                    this.updateRoleConstants();
                  }
                );
  
                this.adminService.getUserTypeList({ allRows: true }, userId).subscribe(
                  (response: any) => {
                    console.log("3st",response)
                    let userType = localStorage.getItem('user_type');
                    let data = response.filter(
                      (item: any) => item.typeName === userType
                    );
                    this.authenticationService.saveRoleDetails(data);
                  });

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
        });
      return;
    }
    if(this.extractedName == 'authentication'){
      this.authenticationService.getUsersByEmail(formData.email.trim()).subscribe(
        (res: any) => {
          console.log("1stres",res)
          this.companies = res.data
          this.openCompanyDialog(this.companiesDialog,'signin')
        })
    } else {
    this.isLoading = true;
    this.userService.getCompanyByIdentifierWithoutToken(this.extractedName).subscribe(
      (res: any) => {
        console.log("12tres",res)
   let companyId=res[0]?.companyId
   localStorage.setItem('uen', res[0]?.uen || '');
    this.authenticationService
      .loginUser(formData.email.trim(), formData.password.trim(),companyId)
      .subscribe(
        (user) => {
          console.log("3tres",user)
          // setTimeout(() => {
          //   const role = this.authenticationService.currentUserValue.user.role;
          //   this.router.navigate(['/admin/two-factor-auth']);
          //   this.loading = false;
          // }, 100);
          this.authenticationService.saveUserInfo(user);
          let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
          this.superadminservice.getAllCustomRoleById(userId).subscribe(
            (response: any) => {
              console.log('res222',response)
              localStorage.setItem('subdomain',response[0]?.identifier)
              this.commonService.setRoleDetails(response[0])
              this.updateRoleConstants();

            })

          this.adminService.getUserTypeList({ allRows: true }, userId).subscribe(
            (response: any) => {
              console.log('res1212',response)
              let userType = localStorage.getItem('user_type');
              let data = response.filter((item: any) => item.typeName === userType);

                    this.authenticationService.saveRoleDetails(data);
                  });

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
        });
    }
  }

  loginwithCommonURL(dialogRef: any) {
    if (this.loginType == 'signin') {
      let formData = this.authForm.getRawValue();
      this.isLoading = true;
      let companyId = this.selectedCompany;
      this.authenticationService
        .loginUser(formData.email.trim(), formData.password.trim(), companyId)
        .subscribe(
          (user) => {
            // setTimeout(() => {
            //   const role = this.authenticationService.currentUserValue.user.role;
            //   dialogRef.close()
            //   this.router.navigate(['/dashboard/dashboard']);
            //   this.loading = false;
            // }, 100);
            dialogRef.close();

            this.authenticationService.saveUserInfo(user);
            let userId = JSON.parse(localStorage.getItem('user_data')!).user
              .companyId;
            this.superadminservice
              .getAllCustomRoleById(userId)
              .subscribe((response: any) => {
                localStorage.setItem('subdomain', response[0]?.identifier);
                this.commonService.setRoleDetails(response[0]);
                this.updateRoleConstants();
              });

            this.adminService
              .getUserTypeList({ allRows: true }, userId)
              .subscribe((response: any) => {
                let userType = localStorage.getItem('user_type');
                let data = response.filter(
                  (item: any) => item.typeName === userType
                );

                this.authenticationService.saveRoleDetails(data);
              });
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
    } else if (this.loginType == 'gmail') {
      let companyId = this.selectedCompany;
      this.authenticationService
        .socialLogin({
          email: this.accountDetails.email,
          social_type: 'GOOGLE',
          social_id: this.accountDetails.sub,
          companyId: companyId,
        })
        .subscribe(
          (user: any) => {
            if (user) {
              // setTimeout(() => {
              //   dialogRef.close()
              //   this.router.navigate(['/dashboard/dashboard']);
              //   this.loading = false;
              // }, 100);
              dialogRef.close();

              this.authenticationService.saveUserInfo(user);
              let userId = JSON.parse(localStorage.getItem('user_data')!).user
                .companyId;
              this.superadminservice
                .getAllCustomRoleById(userId)
                .subscribe((res: any) => {
                  localStorage.setItem('subdomain', res[0]?.identifier);
                  this.superadminservice
                    .getAllCustomRoleById(userId)
                    .subscribe((response: any) => {
                      this.adminService
                        .getUserTypeList({ allRows: true }, userId)
                        .subscribe((response: any) => {
                          let userType = localStorage.getItem('user_type');
                          let data = response.filter(
                            (item: any) => item.typeName === userType
                          );

                          this.authenticationService.saveRoleDetails(data);
                        });
                      this.commonService.setRoleDetails(response[0]);
                      this.updateRoleConstants();
                      this.setup2FA(this.accountDetails.email);
                    });
                });
            }
          },
          (err: any) => {
            console.log('err', err);
            if (err == 'user not found!') {
              this.userService
                .getCompanyByIdentifierWithoutToken(this.extractedName)
                .subscribe((res: any) => {
                  this.companyId = res[0]?.companyId;

                  this.getUserTypeList();
                  this.profileForm = this.formBuilder.group({
                    role: ['', Validators.required],
                    email: [
                      this.accountDetails.email,
                      [
                        Validators.required,
                        Validators.pattern(
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                        ),
                      ],
                    ],
                    name: [this.accountDetails.name, Validators.required],
                    password: [''],
                  });

                  this.openDialog(this.profileDialog);
                });
            } else {
            }
          }
        );
    } else if (this.loginType == 'linkedin') {
      this.authenticationService
        .socialLogin({
          email: this.accountDetails.email,
          social_type: 'LINKEDIN',
          social_id: this.accountDetails.sub,
          companyId: this.selectedCompany,
        })
        .subscribe(
          (user: any) => {
            if (user) {
              // setTimeout(() => {
              //   this.router.navigate(['/dashboard/dashboard']);
              //   this.loading = false;
              // }, 100);
              dialogRef.close();
              this.authenticationService.saveUserInfo(user);
              let userId = JSON.parse(localStorage.getItem('user_data')!).user
                .companyId;
              this.superadminservice
                .getAllCustomRoleById(userId)
                .subscribe((res: any) => {
                  localStorage.setItem('subdomain', res[0]?.identifier);
                  this.superadminservice
                    .getAllCustomRoleById(userId)
                    .subscribe((response: any) => {
                      this.adminService
                        .getUserTypeList({ allRows: true }, userId)
                        .subscribe((response: any) => {
                          let userType = localStorage.getItem('user_type');
                          let data = response.filter(
                            (item: any) => item.typeName === userType
                          );

                          this.authenticationService.saveRoleDetails(data);
                        });
                      this.commonService.setRoleDetails(response[0]);
                      this.updateRoleConstants();
                      this.setup2FA(this.accountDetails.email);
                    });
                });
            }
          },
          (err: any) => {
            if (err == 'user not found!') {
              this.getUserTypeList();
              this.profileForm = this.formBuilder.group({
                role: ['', Validators.required],
                email: [
                  this.accountDetails.email,
                  [
                    Validators.required,
                    Validators.pattern(
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                    ),
                  ],
                ],
                name: [this.accountDetails.name, Validators.required],
                password: [''],
              });

              this.openDialog(this.profileDialog);
            } else {
            }
          }
        );
    }
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
                  secret: setupResponse.secret,
                },
              });
            },
            (setupError) => {
              this.handleError('Failed to set up 2FA.');
            }
          );
        } else {
          this.router.navigate(['/dashboard/dashboard'],{ replaceUrl: true });
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
    this.commonService.navigateWithCompanyName(
      this.extractedName,
      'authentication/signin-role'
    );
  }
}
