import { Component, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Student } from '@core/models/user.model';
import { AuthenService } from '@core/service/authen.service';
import { CertificateService } from '@core/service/certificate.service';
import { CourseService } from '@core/service/course.service';
import { EtmsService } from '@core/service/etms.service';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LogoService } from './logo.service';
import { StudentsService } from 'app/admin/students/students.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { SettingsService } from '@core/service/settings.service';
import { forkJoin } from 'rxjs';
import { AppConstants } from '@shared/constants/app.constants';
import { AdminService } from '@core/service/admin.service';

interface Components {
  checked: boolean;
  component: string;
}

interface Dashboard {
  title: string;
  components: Components[];
}

interface OuterDashboard {
  dashboards: Dashboard[];
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  isTwoFactorEnabled: boolean = false; // Initialize the toggle state
  stdForm: UntypedFormGroup;
  stdForm1: UntypedFormGroup;
  profileForm: FormGroup;
  dropdownVisible = false;
  component!: string;
  selectedDashboards = new Set<string>();
  selectedComponents: { [key: string]: boolean } = {};
  dashboardsList: string[] = [
    'Trainee Analytics',
    'Trainer Analytics',
    'Support',
    'TraineeDashboard',
    'Corporate Dashboard',
  ];
  filteredDashboardsList: string[] = this.dashboardsList.slice();
  selectedDashboard: string | null = null;
  breadscrums = [
    {
      title: 'Settings',
      items: ['Student'],
      active: 'Settings',
    },
  ];
  componentsMap: { [key: string]: string[] } = {
    'Trainee Analytics': [
      'TOTAL TRAINEES',
      'ALL COURSES',
      'TOTAL TRAINERS',
      'COURSE CLASSES',
      'TRAINER SURVEY',
      'USERS',
      'CLASSES LIST',
      'TRAINERS LIST',
      'NEW TRAINEES LIST',
    ],
    'Trainer Analytics': ['TRAINER LIST', 'UPCOMING COURSES'],
    Support: ['Support Tickets'],
    TraineeDashboard: [
      'INFO',
      'LATEST ENROLLED COURSES',
      'UPCOMING COURSE CLASSES',
      'ANNOUNCEMENT BOARD',
      'RESCHEDULE LIST',
    ],
    
  };
  editData: any;
  studentId: any;
  hide = true;
  isEmailFieldDisabled = true;
  files: any;
  fileName: any;
  avatar: any;
  uploadedImage: any;
  uploaded: any;
  cmUrl: any;
  pmUrl: any;
  hodUrl: any;
  superUrl: any;
  tcUrl: any;
  taUrl: any;
  adminUrl: any;
  roname: any;
  thumbnail: any;
  student: Student | undefined;
  isAdmin: boolean = false;
  accountUrl: any;
  securityUrl: any;
  bannersUrl: any;
  emailUrl: any;
  usersUrl: any;
  customUrl: any;
  integrateUrl: any;
  automateUrl: any;
  customsUrl: any;
  lmsUrl: any;
  configUrl: any;
  formsUrl: any;
  sidemenuUrl: any;
  settingsSidemenuUrl: any;
  studentDbUrl: any;
  allUsersUrl: any;
  customFormsUrl: any;
  courseFormsUrl: any;
  programFormsUrl: any;
  usersFormsUrl: any;
  financeFormsUrl: any;
  bannerFormsUrl: any;
  faUrl: any;
  dashboardsUrl: any;
  showAccountSettings: boolean = false;
  showProfileSettings: boolean = false;
  show2FaSettings: boolean = false;
  showEmailConfig: boolean = false;
  showBanners: boolean = false;
  showIntegration: boolean = false;
  showAutomation: boolean = false;
  showUsers: boolean = false;
  showAllUsers: boolean = false;
  showCustomSettings: boolean = false;
  showCustoms: boolean = false;
  showLms: boolean = false;
  showConfig: boolean = false;
  showForms: boolean = false;
  showSidemenu: boolean = false;
  showSettingsSidemenu: boolean = false;
  showCustomForms: boolean = false;
  showCourseForms: boolean = false;
  showProgramForms: boolean = false;
  showUsersForms: boolean = false;
  showFinanceForms: boolean = false;
  showBannerForms: boolean = false;
  showDashboards: boolean = false;
  isApprovers: boolean = false;
  showStudentDb: boolean = false;
  selectedCreators: any = [];
  users: any;
  vendors: any;
  toggleValue: boolean = false;
  isCreate: boolean = false;
  isEdit: boolean = false;

  currentContent: number = 1;
  currencyCodes: string[] = [
    'USD',
    'SGD',
    'NZD',
    'YEN',
    'GBP',
    'KWN',
    'IDR',
    'TWD',
    'MYR',
    'AUD',
  ];
  timerValues: string[] = ['15', '30', '45', '60', '90', '120', '150'];
  retakeCodesAssessment: string[] = ['1', '2', '3', '4', '5'];
  scoreAlgo: number[] = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  selectedCurrency: string = '';
  selectedTimer: string = '';
  selectedExamTimer: string = '';
  selectedAssessmentRetake: string = '';
  selectedExamAssessmentRetake: string = '';
  selectedAssessmentAlgorithm: number = 1;
  selectedExamAlgorithm: number = 1;
  sidemenu: any;
  settingsSidemenu: any;
  studentDb: any;
  dept: any;
  ro: any;
  roName: any;
  director: any;
  directorName: any;
  trainingAdmin: any;
  trainingAdminName: any;
  roUsers: any;
  directorUsers: any;
  trainingAdminUsers: any;
  showBodyContent: boolean = false;
  role: string | null;
  commonRoles: any;
  isStudent: boolean = false;
  checkedDashboard: any;
  userTypeNames: any;
  roleForm: UntypedFormGroup;
  typeName!: string;
  filteredDashboards: any[] = [];
  updateId: any;
  typeNameChild!: string;
  twoFAForm!: UntypedFormGroup;
  twoFA: any;

  constructor(
    private studentService: StudentsService,
    private etmsService: EtmsService,
    private fb: UntypedFormBuilder,
    private certificateService: CertificateService,
    private router: Router,
    public utils: UtilsService,
    private authenservice: AuthenService,
    private courseService: CourseService,
    private logoService: LogoService,
    private userService: UserService,
    private settingsService: SettingsService,
    public dialog: MatDialog,
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {
    this.role = localStorage.getItem('user_type');
    let urlPath = this.router.url.split('/');
    this.cmUrl = urlPath.includes('coursemanager-settings');
    this.pmUrl = urlPath.includes('programmanager-settings');
    this.hodUrl = urlPath.includes('headofdepartment-settings');
    this.superUrl = urlPath.includes('supervisor-settings');
    this.tcUrl = urlPath.includes('trainingcoordinator-settings');
    this.taUrl = urlPath.includes('trainingadministrator-settings');
    this.adminUrl = urlPath.includes('admin-settings');
    this.accountUrl = urlPath.includes('account-settings');
    this.securityUrl = urlPath.includes('security-settings');
    this.bannersUrl = urlPath.includes('banners');
    this.usersUrl = urlPath.includes('users');
    this.integrateUrl = urlPath.includes('integration');
    this.emailUrl = urlPath.includes('email-configuration');
    this.customUrl = urlPath.includes('customization-settings');
    this.automateUrl = urlPath.includes('automation');
    this.customsUrl = urlPath.includes('customization');
    this.lmsUrl = urlPath.includes('LMS-TAE');
    this.configUrl = urlPath.includes('config');
    this.formsUrl = urlPath.includes('forms');
    this.sidemenuUrl = urlPath.includes('sidemenu');
    this.settingsSidemenuUrl = urlPath.includes('settings-sidemenu');
    this.allUsersUrl = urlPath.includes('all-user');
    this.customFormsUrl = urlPath.includes('customization-forms');
    this.faUrl = urlPath.includes('2-factor-authentication');
    this.courseFormsUrl = urlPath.includes('course-forms');
    this.programFormsUrl = urlPath.includes('program-forms');
    this.usersFormsUrl = urlPath.includes('users-forms');
    this.financeFormsUrl = urlPath.includes('finance-forms');
    this.bannerFormsUrl = urlPath.includes('banner-forms');
    this.dashboardsUrl = urlPath.includes('dashboards');
    this.studentDbUrl = urlPath.includes('student-dashboard');

    const formURLs = [
      this.courseFormsUrl,
      this.programFormsUrl,
      this.usersFormsUrl,
      this.financeFormsUrl,
      this.bannerFormsUrl,
    ];
    if (formURLs.includes(true)) this.customFormsUrl = false;

    if (this.cmUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Course Manager'],
          active: 'Settings',
        },
      ];
    }
    if (this.pmUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Program Manager'],
          active: 'Settings',
        },
      ];
    }
    if (this.hodUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Head Of Department'],
          active: 'Settings',
        },
      ];
    }
    if (this.superUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Supervisor'],
          active: 'Settings',
        },
      ];
    }
    if (this.tcUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Training Coordinator'],
          active: 'Settings',
        },
      ];
    }
    if (this.taUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Training Administrator'],
          active: 'Settings',
        },
      ];
    }
    if (this.adminUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Profile'],
          active: 'Settings',
        },
      ];
      this.isAdmin = true;
    }
    if (this.accountUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Profile'],
          active: 'User Information',
        },
      ];
      this.isAdmin = true;
    }
    if (this.securityUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Profile'],
          active: 'Change Password',
        },
      ];
      this.isAdmin = true;
    }
    if (this.bannersUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Customize'],
          active: 'Advertisement Banners',
        },
      ];
      this.isAdmin = true;
    }
    if (this.emailUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Customize'],
          active: 'Email Templates',
        },
      ];
      this.isAdmin = true;
    }
    if (this.customUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Admin'],
          active: 'Settings',
        },
      ];
      this.isAdmin = true;
    }
    if (this.customFormsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Customize'],
          active: 'Forms',
        },
      ];
      this.isAdmin = true;
    }
    if (this.usersUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Admin'],
          active: 'Settings',
        },
      ];
      this.isAdmin = true;
    }
    if (this.integrateUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Admin'],
          active: 'Settings',
        },
      ];
      this.isAdmin = true;
    }
    if (this.automateUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Admin'],
          active: 'Settings',
        },
      ];
      this.isAdmin = true;
    }
    if (this.customsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Admin'],
          active: 'Settings',
        },
      ];
      this.isAdmin = true;
    }
    if (this.lmsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Admin'],
          active: 'Settings',
        },
      ];
      this.isAdmin = true;
    }
    if (this.configUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Admin'],
          active: 'Settings',
        },
      ];
      this.isAdmin = true;
    }
    if (this.formsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Configuration'],
          active: 'Forms',
        },
      ];
      this.isAdmin = true;
    }
    if (this.sidemenuUrl === true) {
      this.breadscrums = [
        {
          title: 'Sidemenu',
          items: ['Customize'],
          active: 'Sidemenu',
        },
      ];
      this.isAdmin = true;
    }
    if (this.settingsSidemenuUrl === true) {
      this.breadscrums = [
        {
          title: 'Sidemenu Settings',
          items: ['Customize'],
          active: 'Sidemenu Setings',
        },
      ];
      this.isAdmin = true;
    }
    if (this.studentDbUrl === true) {
      this.breadscrums = [
        {
          title: 'Sidemenu',
          items: ['Customize'],
          active: 'Dashboard Customization',
        },
      ];
      this.isAdmin = true;
    }
    if (this.allUsersUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Manage Users'],
          active: 'User Profile',
        },
      ];
      this.isAdmin = true;
    }
    if (this.faUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Security'],
          active: '2FA',
        },
      ];
      this.isAdmin = true;
    }
    if (this.courseFormsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Customize'],
          active: 'Course Forms',
        },
      ];
      this.isAdmin = true;
    }
    if (this.programFormsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Customize'],
          active: 'Program Forms',
        },
      ];
      this.isAdmin = true;
    }
    if (this.usersFormsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Customize'],
          active: 'Users Forms',
        },
      ];
      this.isAdmin = true;
    }
    if (this.financeFormsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Customize'],
          active: 'Finance Forms',
        },
      ];
      this.isAdmin = true;
    }
    if (this.bannerFormsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Customize'],
          active: 'Banner Forms',
        },
      ];
      this.isAdmin = true;
    }
    if (this.dashboardsUrl === true) {
      this.breadscrums = [
        {
          title: 'Settings',
          items: ['Customize'],
          active: 'Dashboards',
        },
      ];
      this.isAdmin = true;
    }
    this.patchValues(),
      (this.stdForm = this.fb.group({
        name: ['', [Validators.required, ...this.utils.validators.uname]],
        password: [
          '',
          [Validators.required, ...this.utils.validators.password],
        ],
        currentpassword: [
          '',
          [Validators.required, ...this.utils.validators.currentPsw],
        ],
      }));
    this.stdForm1 = this.fb.group({
      name: ['', [Validators.required, ...this.utils.validators.fname]],

      last_name: [''],
      department: [
        '',
        [Validators.required, ...this.utils.validators.deptname],
      ],
      approver1: [''],
      approver2: [''],
      approver3: [''],
      mobile: ['', [Validators.required, ...this.utils.validators.mobile]],
      city_name: ['', [Validators.required, ...this.utils.validators.city]],
      country_name: [
        '',
        [Validators.required, ...this.utils.validators.country],
      ],

      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],

      address: ['', [Validators.required, ...this.utils.validators.address]],
      avatar: [''],
      qualifications: ['', [Validators.required,...this.utils.validators.designation]],
      domainAreaOfPractice: ['', [Validators.required]],
      idType: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      code: ['', [Validators.required]],
      linkedInURL: ['',],
      experience: ['',],
      dob: ['', [Validators.required]],
    });

    this.roleForm = this.fb.group({
      typeName: ['', Validators.required],
      dashboard: [''],
      dashboards: this.fb.array([]),
    });

    this.profileForm = this.fb.group({
      empName: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      roName: ['', Validators.required],
      director: ['', Validators.required],
      TA: ['', Validators.required],
    });

    this.twoFAForm = this.fb.group({
      userId: ['',[ Validators.required]],
      status: ['off',[ Validators.required]],
    });
  
  }

  ngOnInit() {
    this.getUserProfile();
    this.getSidemenu();
    this.getSettingsSidemenu();
    this.getStudentDb();
    this.getAllUsers();
    this.getAllUserTypes();
    this.commonRoles = AppConstants;
    this.getTwoFAById();
    let role = localStorage.getItem('user_type');
    if (role == AppConstants.ADMIN_USERTYPE || AppConstants.ADMIN_ROLE) {
      this.isAdmin = true;
    } else if (role == AppConstants.STUDENT_ROLE) {
      this.isStudent = true;
    } else if (
      !(
        role == AppConstants.STUDENT_ROLE ||
        role == AppConstants.INSTRUCTOR_ROLE
      )
    ) {
      this.isApprovers = true;
    }
    if (this.accountUrl) {
      this.showAccountSettings = true;
    }
    if (this.securityUrl) {
      this.showProfileSettings = true;
    }
    if (this.bannersUrl) {
      this.showBanners = true;
    }
    if (this.usersUrl) {
      this.showUsers = true;
    }
    if (this.emailUrl) {
      this.showEmailConfig = true;
    }
    if (this.customUrl) {
      this.showCustomSettings = true;
    }
    if (this.integrateUrl) {
      this.showIntegration = true;
    }
    if (this.automateUrl) {
      this.showAutomation = true;
    }
    if (this.customsUrl) {
      this.showCustoms = true;
    }
    if (this.lmsUrl) {
      this.showLms = true;
    }
    if (this.configUrl) {
      this.showConfig = true;
    }
    if (this.formsUrl) {
      this.showForms = true;
    }
    if (this.sidemenuUrl) {
      this.showSidemenu = true;
    }
    if (this.settingsSidemenuUrl) {
      this.showSettingsSidemenu = true;
    }
    if (this.studentDbUrl) {
      this.showStudentDb = true;
    }
    if (this.allUsersUrl) {
      this.showAllUsers = true;
    }
    if (this.customFormsUrl) {
      this.showCustomForms = true;
    }
    if (this.faUrl) {
      this.show2FaSettings = true;
    }
    if (this.courseFormsUrl) {
      this.showCourseForms = true;
    }
    if (this.programFormsUrl) {
      this.showProgramForms = true;
    }
    if (this.usersFormsUrl) {
      this.showUsersForms = true;
    }
    if (this.financeFormsUrl) {
      this.showFinanceForms = true;
    }
    if (this.bannerFormsUrl) {
      this.showBannerForms = true;
    }
    if (this.dashboardsUrl) {
      this.showDashboards = true;
    }
    this.getDepartments();
  }
  navigateToAccountSettings() {
    this.router.navigate(['/student/settings/account-settings']);
  }
  navigateToProfileSettings() {
    this.router.navigate(['/student/settings/security-settings']);
  }
  navigateToEmailSettings() {
    this.router.navigate(['/student/settings/customize/email-configuration']);
  }
  navigateToBannerSettings() {
    this.router.navigate(['/student/settings/customize/banners']);
  }
  navigateToUserSettings() {
    this.router.navigate(['/student/settings/users']);
  }
  navigateToIntegrateSettings() {
    this.router.navigate(['/student/settings/integration']);
  }
  navigateToCustomFormsSettings() {
    this.router.navigate(['/student/settings/customize/customization-forms']);
  }
  navigateToAutomateSettings() {
    this.router.navigate(['/student/settings/automation']);
  }
  navigateToCustomsSettings() {
    this.router.navigate(['/student/settings/form-customization']);
  }
  navigateToLmsSettings() {
    this.router.navigate(['/student/LMS-TAE']);
  }
  navigateToConfigSettings() {
    this.router.navigate(['/student/configuration']);
  }
  navigateToFormSettings() {
    this.router.navigate(['/student/settings/configuration/forms']);
  }
  navigateToCustomSettings() {
    this.router.navigate(['/student/customization-settings']);
  }
  navigateToSidemenuSettings() {
    this.router.navigate(['/student/settings/sidemenu']);
  }
  navigateToSettingsSidemenuSettings() {
    this.router.navigate(['/student/settings/settings-sidemenu']);
  }
  navigateToStudentDbSettings() {
    this.router.navigate(['/student/settings/customize/student-dashboard']);
  }
  navigateToCourseFormsSettings() {
    this.router.navigate([
      '/student/settings/customize/customization-forms/course-forms',
    ]);
  }
  navigateToProgramFormsSettings() {
    this.router.navigate([
      '/student/settings/customize/customization-forms/program-forms',
    ]);
  }
  navigateToUsersFormsSettings() {
    this.router.navigate([
      '/student/settings/customize/customization-forms/users-forms',
    ]);
  }
  navigateToFinanceFormsSettings() {
    this.router.navigate([
      '/student/settings/customize/customization-forms/finance-forms',
    ]);
  }
  navigateToBannerFormsSettings() {
    this.router.navigate([
      '/student/settings/customize/customization-forms/banner-forms',
    ]);
  }
  navigateToDashboardSettings() {
    this.router.navigate(['/student/settings/dashboards']);
  }
  onToggleChange(event: any) {
    this.isTwoFactorEnabled = event.checked;
    const toggleStatus = event.checked ? 'on' : 'off';
    this.twoFAForm.patchValue({ status: toggleStatus });
  }

  showMainContent(contentId: number) {
    this.currentContent = contentId;
  }
  getSidemenu() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.logoService.getSidemenu(userId).subscribe((response) => {
      this.sidemenu = response?.data?.docs;
    });
  }
  getSettingsSidemenu() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.logoService.getSettingsSidemenu(userId).subscribe((response) => {
      this.settingsSidemenu = response?.data?.docs;
    });
  }
  getStudentDb() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.settingsService.getStudentDashboard(userId).subscribe((response) => {
      this.studentDb = response?.data?.docs;
    });
  }
  getDepartments() {
    this.studentService.getAllDepartments().subscribe((response: any) => {
      this.dept = response.data.docs;
      const department = this.dept.map((doc: any) => doc.department);
      department.push("Overall Training Course","Total Staff","All Programs","All Course","Certificate","Staff List","Class List","Feedback Survey","Current Course Status");
      this.componentsMap['Corporate Dashboard'] = department;
    });
  }
  onSelectionChange(event: any, field: any) {
    if (field == 'approver1') {
      const selectedApprover1Id = event.value;
      const selectedApprover1 = this.roUsers.find(
        (user: { id: any }) => user.id === selectedApprover1Id
      );
      if (selectedApprover1) {
        this.ro = selectedApprover1Id;
        this.roName = selectedApprover1.name;
      }
    }
    if (field == 'approver2') {
      const selectedApprover2Id = event.value;
      const selectedApprover2 = this.directorUsers.find(
        (user: { id: any }) => user.id === selectedApprover2Id
      );
      if (selectedApprover2) {
        this.director = selectedApprover2Id;
        this.directorName = selectedApprover2.name;
      }
    }
    if (field == 'approver3') {
      const selectedApprover3Id = event.value;
      const selectedApprover3 = this.trainingAdminUsers.find(
        (user: { id: any }) => user.id === selectedApprover3Id
      );
      if (selectedApprover3) {
        this.trainingAdmin = selectedApprover3Id;
        this.trainingAdminName = selectedApprover3.name;
      }
    }
  }
  getAllUsers() {
    this.userService.getAllUsersByRole('RO').subscribe((response: any) => {
      this.roUsers = response?.results;
    });
    this.userService
      .getAllUsersByRole('Director')
      .subscribe((response: any) => {
        this.directorUsers = response?.results;
      });
    this.userService
      .getAllUsersByRole('Training Administrator')
      .subscribe((response: any) => {
        this.trainingAdminUsers = response?.results;
      });
  }
  patchValues() {
    this.studentId = localStorage.getItem('id');
    this.studentService.getStudentById(this.studentId).subscribe((res: any) => {
      this.editData = res;
      this.avatar = this.editData.avatar;
      this.uploaded = this.avatar?.split('/');
      let image = this.uploaded?.pop();
      this.uploaded = image?.split('\\');
      this.uploadedImage = this.uploaded?.pop();
      const currencyConfig = this.editData.configuration.find(
        (config: any) => config.field === 'currency'
      );
      const selectedCurrency = currencyConfig ? currencyConfig.value : null;
      const timerConfig = this.editData.configuration.find(
        (config: any) => config.field === 'timer'
      );
      const selectedTimer = timerConfig ? timerConfig.value : null;
      const examTimerConfig = this.editData.configuration.find(
        (config: any) => config.field === 'examTimer'
      );
      const selectedExamTimer = examTimerConfig ? examTimerConfig.value : null;
      const assessmentConfig = this.editData.configuration.find(
        (config: any) => config.field === 'assessment'
      );
      const selectedAssessmentRetake = assessmentConfig
        ? assessmentConfig.value
        : null;
      const examassessmentConfig = this.editData.configuration.find(
        (config: any) => config.field === 'examAssessment'
      );
      const selectedExamAssessmentRetake = examassessmentConfig
        ? examassessmentConfig.value
        : null;
      const assessmentAlgoConfig = this.editData.configuration.find(
        (config: any) => config.field === 'assessmentAlgorithm'
      );
      const selectedAssessmentAlgorithm = assessmentAlgoConfig
        ? assessmentAlgoConfig.value
        : null;
      const examAlgoConfig = this.editData.configuration.find(
        (config: any) => config.field === 'examAlgorithm'
      );
      const selectedExamAlgorithm = examAlgoConfig
        ? examAlgoConfig.value
        : null;

      this.stdForm.patchValue({
        name: this.editData.name,
        last_name: this.editData.last_name,
        currentpassword: this.editData.password,
      });
      this.stdForm1.patchValue({
        name: this.editData?.name,
        last_name: this.editData?.last_name,
        rollNo: this.editData?.rollNo,
        gender: this.editData?.gender,
        mobile: this.editData?.mobile,
        department: this.editData?.department,
        approver1: this.editData?.ro,
        approver2: this.editData?.director,
        approver3: this.editData?.trainingAdmin,
        email: this.editData?.email,
        country_name: this.editData?.country_name,
        city_name: this.editData?.city_name,

        address: this.editData.address,
        uploadedImage: this.editData.avatar,
        qualifications: this.editData?.qualifications?.description,
        domainAreaOfPractice: this.editData?.domainAreaOfPractice,
        experience: this.editData?.experience,
        idNumber: this.editData?.idNumber,
        idType: this.editData?.idType?.description,
        code: this.editData?.idType?.code,
        linkedInURL: this.editData?.linkedInURL,
        dob: this.editData?.dob,
      });
      this.selectedCurrency = selectedCurrency;
      this.selectedTimer = selectedTimer;
      this.selectedExamTimer = selectedExamTimer;
      this.selectedAssessmentRetake = selectedAssessmentRetake;
      this.selectedExamAssessmentRetake = selectedExamAssessmentRetake;
      this.selectedAssessmentAlgorithm = Number(selectedAssessmentAlgorithm);
      this.selectedExamAlgorithm = Number(selectedExamAlgorithm);
    });
  }
  onFileUpload(event: any) {
    const file = event.target.files[0];

    this.thumbnail = file;
    const formData = new FormData();
    formData.append('files', this.thumbnail);
    this.courseService
      .uploadCourseThumbnail(formData)
      .subscribe((data: any) => {
        this.avatar = data.data.thumbnail;
        this.uploaded = this.avatar.split('/');
        let image = this.uploaded.pop();
        this.uploaded = image.split('\\');
        this.uploadedImage = this.uploaded.pop();
      });
  }

  updateTwoFA() {
    const twoFAData = this.twoFAForm.value;
    let userId = localStorage.getItem('id');
    const payload = {
      userId: userId,
      status: twoFAData.status,
    };
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to update this Two Factor Authentication!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingsService.saveTwoFA(payload).subscribe((response: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Two Factor Authentication updated successfully',
            icon: 'success',
          });
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to update Two Factor Authentication',
            icon: 'error',
          });
        });
      }
    });
  }
  getTwoFAById() {
    let userId = localStorage.getItem('id');
    if (!userId) {
      // this.handleError('User ID not found in local storage.');
      return; 
    }
    this.settingsService.getTwoFAById(userId).subscribe((response: any) => {
      if (response[0].status == 'on') {
        this.isTwoFactorEnabled = true;
      } else {
        this.isTwoFactorEnabled = false;
      }
    });
  }
  onSubmit() {
    if (this.stdForm.valid) {
      const userData: Student = this.stdForm.value;
      userData.type = AppConstants.STUDENT_ROLE;
      userData.role = AppConstants.STUDENT_ROLE;
      this.updateInstructor(userData);

      Swal.close();
      // },
    } else {
      this.stdForm.markAllAsTouched();
    }
  }
  onSubmit1() {
    if (this.stdForm1.valid) {
      // const userData: any = this.stdForm1.value;
      // userData.avatar = this.avatar;
      // userData.type = this.editData.type;
      // userData.role = this.editData.role;
      // userData.ro = this.ro;
      // userData.roName = this.roName;
      // userData.director = this.director;
      // userData.directorName = this.directorName;
      // userData.trainingAdmin = this.trainingAdmin;
      // userData.trainingAdminName = this.trainingAdminName;
      let idType = {
        code: this.stdForm1.value.code,
        description: this.stdForm1.value.idType,
      }
      let qualifications = [{
        description: this.stdForm1.value.qualifications,
        level: {
          code: "",
        }
      }]
      const payload: any = {
         name: this.stdForm1.value.name,
         gender: this.stdForm1.value.gender,
         domainAreaOfPractice: this.stdForm1.value.domainAreaOfPractice,
         email: this.stdForm1.value.email,
         experience: this.stdForm1.value.experience,
         idNumber: this.stdForm1.value.idNumber,
         idType: idType,
         isLogin : true,
         joiningDate: this.stdForm1.value.joiningDate,
         linkedInURL: this.stdForm1.value.linkedInURL,
         mobile: this.stdForm1.value.mobile,
         password: this.stdForm1.value.password,
         salutationId: 1,
         qualifications: qualifications,
         address: this.stdForm1.value.address,
         department: this.stdForm1.value.department,
         dob: this.stdForm1.value?.dob,
         avatar: this.avatar,
         type: this.editData.type,
         role: this.editData.role,
      };
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateInstructor(payload);
          Swal.close();
        }
      });
    } else {
      this.stdForm1.markAllAsTouched();
    }
  }

  private updateInstructor(userData: Student): void {
    this.studentService.updateStudent(this.studentId, userData).subscribe(
      () => {
        Swal.fire({
          title: 'Successful',
          text: 'User data update successfully',
          icon: 'success',
        });
      },
      (error: { message: any; error: any }) => {
        Swal.fire(
          'Failed to update user data',
          error.message || error.error,
          'error'
        );
      }
    );
  }

  /** Get User for profile */

  getUserProfile() {
    const userId = localStorage.getItem('id');
    this.etmsService.getUserId(userId).subscribe((response: any) => {
      this.roname = response.roName;
      this.profileForm.patchValue({
        empName: response.name,
        designation: response.designation,
        department: response.department,
        roName: response.roName,
        director: response.directorName,
        TA: response.trainingAdminName,
      });
    });
  }

  updateCurrency(dialogRef: any, value: any) {
    if (value === 'currency') {
      const selectedCurrency = this.selectedCurrency;
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update this Currency!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          let userId = JSON.parse(localStorage.getItem('user_data')!).user
            .companyId;
          this.courseService
            .createCurrency({ value: selectedCurrency, companyId: userId })
            .subscribe(
              (response) => {
                Swal.fire({
                  title: 'Successful',
                  text: 'Currency Configuration Success',
                  icon: 'success',
                });
                dialogRef.close(selectedCurrency);
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error,
                });
              }
            );
        }
      });
    } else if (value === 'timer') {
      const selectedTimer = this.selectedTimer;
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update this Timer!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          let userId = JSON.parse(localStorage.getItem('user_data')!).user
            .companyId;
          this.courseService
            .createTimer({ value: selectedTimer, companyId: userId })
            .subscribe(
              (response) => {
                Swal.fire({
                  title: 'Successful',
                  text: 'Timer Configuration Success',
                  icon: 'success',
                });
                dialogRef.close(selectedTimer);
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error,
                });
              }
            );
        }
      });
    } else if (value === 'examTimer') {
      const selectedExamTimer = this.selectedExamTimer;
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update this Exam Timer!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        let userId = JSON.parse(localStorage.getItem('user_data')!).user
          .companyId;
        if (result.isConfirmed) {
          this.courseService
            .createExamTimer({ value: selectedExamTimer, companyId: userId })
            .subscribe(
              (response) => {
                Swal.fire({
                  title: 'Successful',
                  text: 'Exam Timer Configuration Success',
                  icon: 'success',
                });
                dialogRef.close(selectedExamTimer);
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error,
                });
              }
            );
        }
      });
    } else if (value === 'assessment') {
      const selectedAssessmentRetake = this.selectedAssessmentRetake;
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update this Assessment Retake!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          let userId = JSON.parse(localStorage.getItem('user_data')!).user
            .companyId;
          this.courseService
            .createAssessment({
              value: selectedAssessmentRetake,
              companyId: userId,
            })
            .subscribe(
              (response) => {
                Swal.fire({
                  title: 'Successful',
                  text: 'Assessment Configuration Success',
                  icon: 'success',
                });
                dialogRef.close(selectedAssessmentRetake);
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error,
                });
              }
            );
        }
      });
    } else if (value === 'examAssessment') {
      const selectedExamAssessmentRetake = this.selectedExamAssessmentRetake;
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to update this Exam Retake!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          let userId = JSON.parse(localStorage.getItem('user_data')!).user
            .companyId;
          this.courseService
            .createExamAssessment({
              value: selectedExamAssessmentRetake,
              companyId: userId,
            })
            .subscribe(
              (response) => {
                Swal.fire({
                  title: 'Successful',
                  text: 'Exam Configuration Success',
                  icon: 'success',
                });
                dialogRef.close(selectedExamAssessmentRetake);
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error,
                });
              }
            );
        }
      });
    } else if (value == 'scoreAlgorithm') {
      const selectedAssessmentAlgorithm = this.selectedAssessmentAlgorithm;
      const selectedExamAlgorithm = this.selectedExamAlgorithm;
      let userId = JSON.parse(localStorage.getItem('user_data')!).user
        .companyId;
      forkJoin(
        this.courseService.createAssessmentAlgorithm({
          value: selectedAssessmentAlgorithm,
          companyId: userId,
        }),
        this.courseService.createExamAlgorithm({
          value: selectedExamAlgorithm,
          companyId: userId,
        })
      ).subscribe(
        (response) => {
          Swal.fire({
            title: 'Successful',
            text: 'Score Algorithm Configuration Success',
            icon: 'success',
          });
          dialogRef.close(selectedAssessmentAlgorithm);
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error,
          });
        }
      );
    }
  }

  openDialog(templateRef: any, value: any): void {
    if (value === 'currency') {
      const dialogRef = this.dialog.open(templateRef, {
        width: '500px',
        data: { selectedCurrency: this.selectedCurrency },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.selectedCurrency = result;
        }
      });
    } else if (value === 'timer') {
      const dialogRef = this.dialog.open(templateRef, {
        width: '500px',
        data: { selectedTimer: this.selectedTimer },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.selectedTimer = result;
        }
      });
    } else if (value === 'examTimer') {
      const dialogRef = this.dialog.open(templateRef, {
        width: '500px',
        data: { selectedTimer: this.selectedExamTimer },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.selectedExamTimer = result;
        }
      });
    } else if (value === 'assessment') {
      const dialogRef = this.dialog.open(templateRef, {
        width: '500px',
        data: { selectedAssessmentRetake: this.selectedAssessmentRetake },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.selectedAssessmentRetake = result;
        }
      });
    } else if (value === 'examAssessment') {
      const dialogRef = this.dialog.open(templateRef, {
        width: '500px',
        data: {
          selectedExamAssessmentRetake: this.selectedExamAssessmentRetake,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.selectedExamAssessmentRetake = result;
        }
      });
    } else if (value === 'scoreAlgorithm') {
      const dialogRef = this.dialog.open(templateRef, {
        width: '500px',
        data: {
          selectedAssessmentAlgorithm: this.selectedAssessmentAlgorithm,
          selectedExamAlgorithm: this.selectedExamAlgorithm,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.selectedExamAssessmentRetake = result;
        }
      });
    }
  }
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  updateVisibility() {
    // this.saveDashboardConfig();
  }
  onSelect(currencyCode: string, dialogRef: any) {
    dialogRef.close(currencyCode);
  }

  getAllUserTypes(filters?: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.adminService.getUserTypeList({ allRows: true }, userId).subscribe(
      (response: any) => {
        this.userTypeNames = response;
      },
      (error) => {}
    );
  }

  saveDashboardConfig(): void {
    const userId = JSON.parse(localStorage.getItem('user_data')!).user
      .companyId;
    const selectedDashboards = this.dashboards.controls
      .map((dashboardGroup) => {
        const dashboardFormGroup = dashboardGroup as FormGroup;
        const components = (
          dashboardFormGroup.get('components') as FormArray
        ).controls
          .filter(
            (componentGroup) =>
              (componentGroup as FormGroup).get('checked')!.value
          )
          .map((componentGroup) => {
            const componentFormGroup = componentGroup as FormGroup;
            return {
              component: componentFormGroup.get('component')!.value,
              id: componentFormGroup
                .get('component')!
                .value.toLowerCase()
                .replace(/\s+/g, '-'),
              checked: componentFormGroup.get('checked')!.value,
            };
          });

        return {
          title: dashboardFormGroup.get('title')!.value,
          id: dashboardFormGroup
            .get('title')!
            .value.toLowerCase()
            .replace(/\s+/g, '-'),
          components: components,
        };
      })
      .filter((dashboard) => dashboard.components.length > 0);

    const config = {
      typeName: this.roleForm.value.typeName,
      companyId: userId,
      dashboards: selectedDashboards,
    };
console.log("config: " + config);
    if (!this.typeNameChild) {
      this.userService.saveCustomzDashboard(config).subscribe((data: any) => {
        Swal.fire({
          title: 'Successful',
          text: 'Dashboard Created successfully',
          icon: 'success',
        });
        this.getDashboardComponentsafterSave();
        this.cancel();
        this.isCreate = false;
      });
    } else {
      this.userService.updateCustomzDashboard(config).subscribe((data: any) => {
        Swal.fire({
          title: 'Successful',
          text: 'Dashboard Updated successfully',
          icon: 'success',
        });
      });

      this.getDashboardComponentsafterSave();
      this.cancel();
      this.isCreate = false;
    }
  }

  getDashboardComponentsafterSave() {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user
      .companyId;
    this.userService.getDashboardsByCompanyId(companyId).subscribe(
      (data: any) => {
        const dashboards = data.data;
        const processedData = dashboards.map(
          (dashboard: { typeName: any; dashboards: any[] }) => {
            return {
              typeName: dashboard.typeName,
              dashboards: dashboard.dashboards.map((dash) => ({
                title: dash.title,
                components: dash.components.map(
                  (component: { component: any }) => component.component
                ),
              })),
            };
          }
        );

        this.filteredDashboards = processedData;
      },
      (error) => {
        console.error('Error fetching dashboards:', error);
      }
    );
  }

  getComponentsForDashboard(dashboard: string) {
    return this.componentsMap[dashboard].map((component) =>
      this.fb.group({
        component: [component],
        checked: [false],
      })
    );
  }
  getComponentsArray(dashboard: string): FormGroup[] {
    return (this.componentsMap[dashboard] || []).map((component) =>
      this.fb.group({
        component: component,
        checked: false,
      })
    );
  }

  onDashboardSelectionChange(selectedDashboards: string[]): void {
    for (let i = this.dashboards.controls.length - 1; i >= 0; i--) {
      const group = this.dashboards.controls[i];
      if (!selectedDashboards.includes(group.get('title')?.value)) {
        this.dashboards.removeAt(i);
      }
    }

    selectedDashboards.forEach((dashboard) => {
      const exists = this.dashboards.controls.some(
        (group) => group.get('title')?.value === dashboard
      );
      if (!exists) {
        const dashboardGroup = this.fb.group({
          title: dashboard,
          components: this.fb.array(this.getComponentsArray(dashboard)),
        });
        this.dashboards.push(dashboardGroup);
      }
    });
  }
  getSelectedComponents(dashboardGroup: AbstractControl): {
    [key: string]: boolean;
  } {
    const selectedComponents: { [key: string]: boolean } = {};
    (dashboardGroup.get('components') as FormArray).controls.forEach(
      (componentGroup) => {
        const componentFormGroup = componentGroup as FormGroup;
        const componentName = componentFormGroup.get('component')!.value;
        const isChecked = componentFormGroup.get('checked')!.value;
        if (isChecked) {
          selectedComponents[componentName] = true;
        }
      }
    );
    return selectedComponents;
  }

  getComponentGroups(dashboardGroup: AbstractControl): FormArray {
    return dashboardGroup.get('components') as FormArray;
  }

  isDashboardSelected(dashboard: string): boolean {
    return this.dashboards.controls.some(
      (control) => control.get('title')!.value === dashboard
    );
  }
  get dashboards(): FormArray {
    return this.roleForm.get('dashboards') as FormArray;
  }

  onChildStateChange(newState: boolean) {
    this.isCreate = newState;
  }

  cancel() {
    this.isCreate = false;
  
    while (this.dashboards.length !== 0) {
      this.dashboards.removeAt(0);
    }
  
    this.roleForm.reset();
  
    this.cd.markForCheck();
  }
  

  onChildEditChange(type: string): void {
    this.isCreate = true;
    this.typeNameChild = type;
    this.roleForm.patchValue({
      typeName: this.typeNameChild,
    });
    this.getDashboardComponents(this.typeNameChild);
  }

  getDashboardComponents(typeName: string) {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.userService.getDashboardsByCompanyId(companyId,typeName).subscribe(
      (data: any) => {
        const outerDashboards: OuterDashboard[] = data.data;

        this.dashboards.clear();
        if (Array.isArray(outerDashboards)) {
          const dashboardTitles: string[] = [];

          outerDashboards.forEach((outerDashboard: OuterDashboard) => {
            if (Array.isArray(outerDashboard.dashboards)) {
              outerDashboard.dashboards.forEach((innerDashboard: Dashboard) => {
                const dashboardGroup = this.fb.group({
                  title: [innerDashboard.title || ''],
                  components: this.fb.array([]),
                });
                const components: Components[] =
                  innerDashboard.components || [];
                const componentsList =
                  this.componentsMap[innerDashboard.title] || [];

                if (Array.isArray(componentsList)) {
                  const componentsSet = new Set(
                    components.map((c) => c.component)
                  );

                  componentsList.forEach((componentName: string) => {
                    const isChecked =
                      (componentsSet.has(componentName) &&
                        components.find((c) => c.component === componentName)
                          ?.checked) ||
                      false;

                    const componentGroup = this.fb.group({
                      checked: [isChecked],
                      component: [componentName],
                    });
                    this.getComponentGroups(dashboardGroup).push(
                      componentGroup
                    );
                  });
                } else {
                  console.warn(
                    'componentsList is not an array:',
                    componentsList
                  );
                }
                this.dashboards.push(dashboardGroup);

                // Add title to the array for patching
                dashboardTitles.push(innerDashboard.title);
              });
            } else {
              console.warn(
                'outerDashboard.dashboards is not an array:',
                outerDashboard.dashboards
              );
            }
          });

          // Patch the form control with the dashboard titles as an array
          this.roleForm.patchValue({ dashboard: dashboardTitles });
        } else {
          console.error('outerDashboards is not an array:', outerDashboards);
        }
      },
      (error) => {
        console.error('Error fetching dashboards:', error);
      }
    );
  }
}
