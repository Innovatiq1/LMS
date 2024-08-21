export class AppConstants {
  static getRoleData() {
    const roleData = localStorage.getItem('role_data');
    if (roleData) {
      try {
        return JSON.parse(roleData);
      } catch (error) {
        console.error('Error parsing role data from localStorage:', error);
        return {};
      }
    }
    return {};
  }
  static STUDENT_ROLE = (() => {
    const roleData = AppConstants.getRoleData();
    return roleData.learner || 'Trainee';
  })();

  static INSTRUCTOR_ROLE = (() => {
    const roleData = AppConstants.getRoleData();
    return roleData.trainer || 'Trainer';
  })();
  static ADMIN_ROLE = 'Admin';
  static ASSESSOR_ROLE = 'Assessor';
  static ALLTHREEROLES = [ localStorage.getItem('trainer'), 'Admin', 'admin','Assessor', ];

  static readonly ADMIN_USERTYPE = 'admin';
  static readonly TOAST_DISPLAY_TIME = 3000;
  static readonly KEY_USER_DATA = 'user_data';
  static readonly DEFAULT_QUERY_LIMIT = 10;
  static readonly KEY_STATIC_DATA = 'static_data';
  static readonly KEY_COUNTRIES_DATA = 'countries_data';
  static readonly KEY_COUNTRY_PHONE_CODE = 'phone_code';

  static readonly KEY_PARTNER_ID = 'partner_id';
  static readonly KEY_NAV_MINIMIZE = 'true';

  static readonly RESOURCE_ADMIN_ID = 23;

  static readonly ALERT = {
    success: 'Saved Successfully',
    error: 'Error found',
  };
  static readonly PHONE_PATTERN = /^[6789]{1}[0-9]{9}$/;
  // tslint:disable-next-line:max-line-length
  static readonly EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static readonly URL_PATTERN = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
}
