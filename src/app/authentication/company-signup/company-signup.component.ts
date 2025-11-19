import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LanguageService } from '@core/service/language.service';
import { RegistrationService } from '@core/service/registration.service';
import { Users } from '@core/models/user.model';
import Swal from 'sweetalert2';
import {
  SearchCountryField,
  //TooltipLabel,
  CountryISO
} from "ngx-intl-tel-input";
import { ConfirmedValidator } from '@shared/password.validator';
import { CommonService } from '@core/service/common.service';
import { UserService } from '@core/service/user.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentsService } from 'app/admin/students/students.service';
import { LogoService } from 'app/student/settings/logo.service';
import { AdminService } from '@core/service/admin.service';
import { UtilsService } from '@core/service/utils.service';
import { EmailConfigService } from '@core/service/email-config.service';
import { v4 as uuidv4 } from 'uuid';
import { MENU_LIST } from '@shared/userType-item';
import { SIDEMENU_LIST } from '@shared/sidemenu-item';
import { SETTING_SIDEMENU_LIST } from '@shared/settingSidemenu-item';
import { LOGOMENU_LIST } from '@shared/logo-item';
import { EMAILCONFIGURATION_LIST } from '@shared/emailConfigurations-items';
import { DASHBOARDMENU_LIST } from '@shared/dashboard-item';
import { FORMCREATION_LIST } from '@shared/formCreations-item';
@Component({
  selector: 'app-company-signup',
  templateUrl: './company-signup.component.html',
  styleUrls: ['./company-signup.component.scss']
})
export class CompanySignupComponent implements OnInit {
  phoneNumber: any;
  SearchCountryField = SearchCountryField;
  //TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Qatar];
  
  userData = { username: '', email: '', password: '', cpassword: '', type:'',role:''};
  message = '';
  loading = false;
  isLoading = false;
  error = '';
  isSubmitted = false;
  email: any;
  authForm!: UntypedFormGroup;
  langStoreValue?: string;
  submitted = false;
  returnUrl!: string;
  hide = true;
  chide = true;
  user: any;
  passwordMatchValidator: any;
  tmsUrl: boolean;
  lmsUrl: boolean;
  extractedName: string;
  userForm!: FormGroup;
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private translate: LanguageService,
    private registration: RegistrationService,
    private commonService: CommonService,
    public _fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private StudentService: StudentsService,
    private logoService: LogoService,
    private adminService: AdminService,
    public utils: UtilsService,
    private userService: UserService,
    private emailConfigService:EmailConfigService
  ) { 
    let urlPath = this.router.url.split('/')
    this.tmsUrl = urlPath.includes('LMS');
    this.lmsUrl = urlPath.includes('LMS');
    this.extractedName = urlPath[1];
    this.authForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['',[Validators.required,Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)] ],
      password: ['', Validators.required],
      cpassword: [''],
      gender: ['', Validators.required]
      
    },{
      validator: ConfirmedValidator('password', 'cpassword')
    
    });
  }


  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Chinese', flag: 'assets/images/flags/spain.svg', lang: 'ch' },
    { text: 'Tamil', flag: 'assets/images/flags/germany.svg', lang: 'ts' },
  ];

  signin(){

    if(this.tmsUrl){
      this.commonService.navigateWithCompanyName(this.extractedName,'authentication/LMS/signin')
    } else if(this.lmsUrl){
      this.commonService.navigateWithCompanyName(this.extractedName,'authentication/LMS/signin')

    }
  }
  ngOnInit() {
    this.startSlideshow()
    this.userForm = this._fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-zA-Z0-9]+/),
        ...this.utils.validators.noLeadingSpace,
      ]),
      website: new FormControl('', []),
      mobile: new FormControl('', [
        Validators.required,
        ...this.utils.validators.mobile,
      ]),
      company: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
      ]),
      domain: new FormControl('', []),
      password: new FormControl('', [Validators.required]),
      re_passwords: new FormControl('', []),
      type: new FormControl('admin', [Validators.required]),
      joiningDate: new FormControl('', [Validators.required]),
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  get f() {
    return this.authForm.controls;
  }
 
  

  setLanguage(event: any) {
    // this.countryName = text;
    // this.flagvalue = flag;
    this.langStoreValue = event.target.value;
    this.translate.setLanguage(event.target.value);
  }
  images: string[] = ['/assets/images/login/Learning.jpeg', '/assets/images/login/learning2.jpg', '/assets/images/login/learning4.jpg'];
  currentIndex = 0;
  startSlideshow() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000);
  }

  SignUp() {
    if (this.userForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to SigningUp!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Success",this.userForm.value)
          this.addBlog(this.userForm.value);
        }
      });
    } else {
      this.userForm.markAllAsTouched();
      this.isSubmitted = true;
    }
  }

  addBlog(formObj: any) {
    if (!formObj.invalid) {
      const uniqueId = uuidv4();
      formObj['Active'] = true;
      formObj['type'] = formObj.type;
      formObj['role'] = 'Admin';
      formObj['isLogin'] = true;
      formObj['companyId'] = uniqueId;
      formObj['superAdmin'] = true;


      const userData: Users = formObj;
      // userData.avatar = this.avatar;
      console.log("Success11",userData)
      this.createUser(userData);
    }
  }
  private createUser(userData: Users): void {  
    console.log("Success12",userData)  
    this.userService.companySignUp(userData).subscribe(
      (response:any) => {
            let payload = {
              company:this.userForm.value.company,
              companyId:response.companyId,
              identifier:this.userForm.value.domain,
           
            }
            this.userService.createNewCompany(payload).subscribe(() =>{
              Swal.fire({
                title: 'Successful',
                text: 'Company created successfully',
                icon: 'success',
              });


              
              
              MENU_LIST[0].companyId = response.companyId
              const payload =MENU_LIST[0]
              this.adminService.createUserType(payload).subscribe((response)=>{
              })

              
              SIDEMENU_LIST[0].companyId = response.companyId
              const sideMenuPayload =SIDEMENU_LIST[0]
              this.logoService.createCompanySidemenu(sideMenuPayload).subscribe((response)=>{
                // console.log("respone of sideMenuPayload",response)
              })

            SETTING_SIDEMENU_LIST[0].companyId = response.companyId;
            const settingSidemenuPayload=SETTING_SIDEMENU_LIST[0];
            this.logoService.createCompanySettingSidemenu(settingSidemenuPayload).subscribe((response)=>{
              // console.log("settingSidemenuPayload response=",response)
            })

              
              LOGOMENU_LIST[0].companyId = response.companyId
              LOGOMENU_LIST[0].title = response.company
              const logobody =LOGOMENU_LIST[0];
              this.logoService.createCompanyLogo(logobody).subscribe((response)=>{
                // console.log("logobody",response)
              })

              EMAILCONFIGURATION_LIST[0].companyId=response.companyId;
              const emailConfigurationsPayload=EMAILCONFIGURATION_LIST[0];
              this.emailConfigService.createCompanyEmailTemplate(emailConfigurationsPayload).subscribe((response)=>{
                // console.log("response for email template=",response)
              })

             for(let data of DASHBOARDMENU_LIST ){
              data.companyId = response.companyId
              this.userService.saveDashboard(data).subscribe((respone) =>{
                // console.log("response",respone);
              }) 
             }

             for(let data of FORMCREATION_LIST ){
              data.companyId = response.companyId
              this.userService.createCompanyForm(data).subscribe((respone) =>{
                // console.log("response",respone);
              }) 
              this.router.navigate(['authentication/LMS/signin'])
             }
            

          })
          window.history.back();
            this.userForm.reset();
        
      },
      (error) =>               {
        Swal.fire(
          'Failed to create user',
          error.message || error.error,
          'error'
        );
      }
    );
  }
  onNoClick() {
    window.history.back();
  }
  
}
