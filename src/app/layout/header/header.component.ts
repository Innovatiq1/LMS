import { ConfigService } from '../../config/config.service';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import {
  LanguageService,
  RightSidebarService,
  InConfiguration,
  Role,
  AuthService,
} from '@core';
import { AuthenService } from '@core/service/authen.service';

import { AnnouncementService } from '@core/service/announcement.service';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'app/ui/modal/simpleDialog.component';

import { LogoService } from 'app/student/settings/logo.service';
import { Subscription } from 'rxjs';
import { StudentsService } from 'app/admin/students/students.service';
import { AppConstants } from '@shared/constants/app.constants';
import { AnyComponent } from '@fullcalendar/core/preact';

interface Notifications {
  message: string;
  time: string;
  icon: string;
  color: string;
  status: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public config!: InConfiguration;
  userImg?: string;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement?: HTMLElement;
  isFullScreen = false;
  userFullName: any;
  userType!: any;
  announcements: any;
  icon = 'announcement';
  color = 'nfc-green';
  userProfile: any;
  studentId: any;
  isAdmin: boolean = false;
  logoTitle: any;
  logoImage: any;
  data: any;
  totalItems: any;
  subscription!: Subscription;
  role: string | null;
  commonRoles:any;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private rightSidebarService: RightSidebarService,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService,
    private authenService: AuthenService,
    private translate: LanguageService,
    private logoService: LogoService,

    private announcementService: AnnouncementService,
    private dialogModel: MatDialog,

    private studentService: StudentsService
  ) {
    super();
    this.role = localStorage.getItem('user_type');
  }
  simpleDialog?: MatDialogRef<SimpleDialogComponent>;
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Chinese', flag: 'assets/images/flags/spain.svg', lang: 'ch' },
    { text: 'Tamil', flag: 'assets/images/flags/germany.svg', lang: 'ts' },
  ];
  // notifications: Notifications[] = [
  //   {
  //     message: 'Please check your mail',
  //     time: '14 mins ago',
  //     icon: 'mail',
  //     color: 'nfc-green',
  //     status: 'msg-unread',
  //   },
  //   {
  //     message: 'New Patient Added..',
  //     time: '22 mins ago',
  //     icon: 'person_add',
  //     color: 'nfc-blue',
  //     status: 'msg-read',
  //   },
  //   {
  //     message: 'Your leave is approved!! ',
  //     time: '3 hours ago',
  //     icon: 'event_available',
  //     color: 'nfc-orange',
  //     status: 'msg-read',
  //   },
  //   {
  //     message: 'Lets break for lunch...',
  //     time: '5 hours ago',
  //     icon: 'lunch_dining',
  //     color: 'nfc-blue',
  //     status: 'msg-read',
  //   },
  //   {
  //     message: 'Patient report generated',
  //     time: '14 mins ago',
  //     icon: 'description',
  //     color: 'nfc-green',
  //     status: 'msg-read',
  //   },
  //   {
  //     message: 'Please check your mail',
  //     time: '22 mins ago',
  //     icon: 'mail',
  //     color: 'nfc-red',
  //     status: 'msg-read',
  //   },
  //   {
  //     message: 'Salary credited...',
  //     time: '3 hours ago',
  //     icon: 'paid',
  //     color: 'nfc-purple',
  //     status: 'msg-read',
  //   },
  // ];
  callLogo() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.logoService.getLogo(userId).subscribe((data) => {
      this.logoTitle = data?.data.docs[0].title;
      this.logoImage = data?.data.docs[0].image;
    });
  }

  ngOnInit() {
    this.commonRoles = AppConstants
    /* getting logo details from logoservice **/
    this.subscription = this.logoService.currentData.subscribe((data) => {
      if (data) {
        this.logoTitle = data?.data.docs[0].title;
        this.logoImage = data?.data.docs[0].image;
      } else {
        this.callLogo();
      }
    });
    this.userProfile = this.authenService.getUserProfile();

    // Subscribe to changes in user profile
    this.authenService.profileUpdated.subscribe((updatedProfile: any) => {
      this.userProfile = updatedProfile;
    });
    if (this.authenService.currentUserValue) {
      const userRole = this.authenService.currentUserValue.user.role;
      this.userFullName = this.authenService.currentUserValue.user.name;
      this.userImg = this.authenService.currentUserValue.user.avatar;
      this.student();
      if (userRole === AppConstants.ADMIN_ROLE) {
        this.userType = AppConstants.ADMIN_ROLE;
      } else if (userRole === AppConstants.INSTRUCTOR_ROLE) {
        this.userType = AppConstants.INSTRUCTOR_ROLE;
      } else if (userRole === AppConstants.STUDENT_ROLE) {
        this.userType = AppConstants.STUDENT_ROLE;
        this.updateLogoForStudent();
      } else {
        this.userType = AppConstants.ADMIN_ROLE;
      }
    }
    this.config = this.configService.configData;

    const userRole = this.authService.currentUserValue.role;
    this.docElement = document.documentElement;

    if (userRole === AppConstants.ADMIN_ROLE) {
      this.homePage = 'admin/dashboard/main';
    } else if (userRole === AppConstants.INSTRUCTOR_ROLE) {
      this.homePage = 'teacher/dashboard';
    } else if (userRole === AppConstants.STUDENT_ROLE) {
      this.homePage = 'student/dashboard';
    } else {
      this.homePage = 'admin/dashboard/main';
    }

    this.langStoreValue = localStorage.getItem('lang') as string;
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = 'assets/images/flags/us.svg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
    this.getAnnouncementForStudents();
  }

  navigateToUserSettings() {
    this.router.navigate(['/student/settings/users']);
  }
  navigateToIntegrateSettings() {
    this.router.navigate(['/student/settings/integration']);
  }
  navigateToAutomateSettings() {
    this.router.navigate(['/student/settings/automation']);
  }
  navigateToCustomsSettings() {
    this.router.navigate(['/student/settings/customization']);
  }
  navigateToProfileSettings() {
    this.router.navigate(['/student/settings/2-factor-authentication']);
  }
  navigateToLmsSettings() {
    this.router.navigate(['/student/settings/all-questions']);
  }
  navigateToConfigSettings() {
    this.router.navigate(['/student/settings/configuration']);
  }
  onClick() {
    let role = localStorage.getItem('user_type');
    if (role == AppConstants.ADMIN_USERTYPE || AppConstants.ADMIN_ROLE) {
      this.router.navigate(['/settings/admin-settings']);
    } else if (role == AppConstants.STUDENT_ROLE) {
      this.router.navigate(['/settings/student-settings']);
    } else if (role == AppConstants.INSTRUCTOR_ROLE) {
      this.router.navigate(['/settings/instructor-settings']);
    }
  }

  getAnnouncementForStudents(filter?: any) {
    let payload = {
      announcementFor: AppConstants.STUDENT_ROLE,
    };
    this.announcementService
      .getAnnouncementsForStudents(payload)
      .subscribe((res: { data: { data: any[] }; totalRecords: number }) => {
        const announcementsData: any = res.data;
        this.announcements = announcementsData.reverse();
      });
  }
  showCustomHtml(data: any) {
    Swal.fire({
      position: 'top-end',
      title: 'Notification',
      html:
        `<div class="align-left"><h4>Title </h4> <p>${data.subject}</p> </div>` +
        `<div class="align-left"><h5>Course Detailed Description </h5> <p class='fs-6' >${data.details}</p></div>`,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
    });
  }

  cancel(id: any) {
    this.announcements = this.announcements.filter(
      (res: { id: any }) => res.id !== id
    );
  }

  student() {
    this.studentId = localStorage.getItem('id');
    // let studentId = localStorage.getItem('id')?localStorage.getItem('id'):null
    this.studentService.getStudentById(this.studentId).subscribe((res: any) => {
      // this.editData = res;
      this.userProfile = res?.avatar;
    });
  }

  callFullscreen() {
    if (!this.isFullScreen) {
      if (this.docElement?.requestFullscreen != null) {
        this.docElement?.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
  setLanguage(event: any) {
    this.langStoreValue = event.target.value;
    this.translate.setLanguage(event.target.value);
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }
  logout() {
    interface OuterObject {
      id: any;
    }
    const storedDataString: string | null = localStorage.getItem('userLogs');
    const data: OuterObject =
      storedDataString !== null ? JSON.parse(storedDataString) : {};
    let data1 = {
      id: data.id,
    };

    this.authService.logout1(data1).subscribe((res) => {
      if (res) {
      }
    });
    this.subs.sink = this.authService.logout().subscribe((res) => {
      if (!res.success) {
        let userType = JSON.parse(localStorage.getItem('user_data')!).user.type;
        if (userType == AppConstants.ADMIN_USERTYPE || AppConstants.ADMIN_ROLE || userType == AppConstants.INSTRUCTOR_ROLE) {
          this.router.navigate(['/authentication/TMS/signin']);
        } else if (userType == AppConstants.STUDENT_ROLE) {
          this.router.navigate(['/authentication/LMS/signin']);
        } else {
          this.router.navigate(['/authentication/TMS/signin']);
        }
        localStorage.clear();
      }
    });
  }
  updateLogoForStudent() {
    let userType = JSON.parse(localStorage.getItem('user_data')!).user.type;
    if (userType === AppConstants.ADMIN_ROLE || userType === AppConstants.INSTRUCTOR_ROLE) {
      this.isAdmin = true;
      const logoSpan = document.querySelector('.logo-name');
      if (logoSpan) {
        logoSpan.textContent = 'TMS';
      }
    } else if (userType === AppConstants.STUDENT_ROLE) {
      const logoSpan = document.querySelector('.logo-name');
      // if (logoSpan) {
      //   logoSpan.textContent = 'LMS';
      // }
    }
  }
  checkViewSettings(role:any){
    return role ? AppConstants.ALLTHREEROLES.includes(role):false;
  }
}
