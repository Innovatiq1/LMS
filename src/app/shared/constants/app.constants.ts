

export class AppConstants {
  // static  STUDENT_ROLE = 'Trainee';
  // static  INSTRUCTOR_ROLE = 'Trainer';
  // static  ADMIN_ROLE = 'Admin';
  // static  ASSESSOR_ROLE = 'Assessor';
  // static  ALLTHREEROLES= ['Trainer', 'Admin', 'admin', 'Assessor']


  static  STUDENT_ROLE = '';
  static  INSTRUCTOR_ROLE = '';
  static  ADMIN_ROLE = '';
  static  ASSESSOR_ROLE = '';
  static  ALLTHREEROLES: string[] = [];

  static setRoles(roles: any[]) {
    roles.forEach(role => {
      console.log("seRoles",role)
      if (role.trainer === 'instructor') {
        AppConstants.INSTRUCTOR_ROLE = role.trainer; 
      }
      // Add more conditions as needed
    });
    AppConstants.ALLTHREEROLES = roles.map(role => role.trainer); // Example, adjust according to your roles structure
  }

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
      success: "Saved Successfully",
      error: "Error found"
    }
    
    static readonly STUDENT_INTERESTED_AREAS = [
      {
        name: 'Sports',
      },
      {
        name: 'Music',
      },
      {
        name: 'Performing',
      },
      {
        name: 'Arts',
      },
      {
        name: 'Visual Arts',
      },
      {
        name: 'Volunteer Activity',
      },
      {
        name: 'Music Writing',
      },
      {
        name: 'Photography',
      },
      {
        name: 'Public Speaking',
      },
      {
        name: 'Environment Related Projects',
      },
      {
        name: 'Social Projects',
      },
      {
        name: 'Design Projects',
      },
      {
        name: 'Recycling',
      },
      {
        name: 'Tutoring/Coaching',
      },
  
      {
        name: 'Social Activities',
      },
      {
        name: 'Fundraising',
      },
      {
        name: 'Gardening',
      },
      {
        name: 'Doing Art Projects',
      },
      {
        name: 'Doing Science Projects',
      },
    ];
  
    static readonly STUDENT_CLASS_OPTIONS = [
      '8th or less',
      '9th',
      '10th',
      '11th',
      '12th',
      'high school graduate/college',
    ];
  
    static readonly STUDENT_SCHOOL_BOARD = [
      'IB', 'CBSE', 'IGCSC', 'A-Levels', 'CISCE', 'US High School Diploma', 'CBSE', 'ICSE', 'State board'
    ];
  
    static readonly STUDENT_SUBJECT = [
      {
        key: 'STEM (Science Technology Engineering Mathematics)',
      },
      {
        key: 'Liberal Arts',
      },
      {
        key: 'Humanities',
      },
      {
        key: 'Health Sciences',
      },
      {
        key: 'Other',
      },
    ];
  
    static readonly STUDENT_TESTS = [
      'ACT',
      'AP',
      'SAT',
      'PSAT',
      'TOEFL',
      'IELTS',
      'PTE',
      'Other',
    ];
  
    static readonly STUDENT_SCHOOL_BOARDS = [
      'IB',
      'CBSE',
      'IGCSC',
      'A-Levels',
      'CISCE',
      'US High School Diploma',
      'CBSE',
      'ICSE',
      'State board/other',
    ];
  
    static readonly STUDENT_FAVORITE_SUBJECTS = [
      'Maths',
      'Physics',
      'Chemistry',
      'Biology',
      'Commerce',
      'Languages',
      'Literature',
      'History',
      'Music',
      'Art',
      'Psychology',
      'Economics',
      'Design',
      'Computer Science',
      'Geography',
      'Business',
      'Drama',
      'Dance',
      'Physical',
      'Education',
    ];
  
    static readonly PAY_PER_YEAR = [
      '< $10,000',
      '$10,000-$20,000',
      '$20,000-40,000',
      '$40,000-$60,000',
      '>$60,000',
    ];
  
    static readonly FAMILY_INCOME = [
      '< $10,000',
      '$10,000-$20,000',
      '$20,000-40,000',
      '$40,000-$60,000',
      '$60,000-$80,000',
      '>$80,000',
    ];
  
    static readonly UNIVERSITY_PARTNER_TESTS = [
      'AP',
      'ACT',
      'SAT',
      'TOEFL',
      'IELTS',
      'PTE',
      'GMAT',
      'GRE',
      'NEET',
      'ETC',
    ];
  
    static readonly SDG = [
      'Automation',
      'Cybersecurity',
      'Cloud computing',
      'Talent development',
      'Accessibility',
      'Technology and innovation',
      'Data management and analysis',
      'Communication and collaboration',
      'Quality Education',
      'Access to information and services',
      'Customer engagement',
      'Responsible Consumption and Production',
      'Security'
    ];
  
    static readonly OUTCOME = [
      'A Research Paper',
      'A Campaign',
      'An Article',
      'A Video',
      'A Fundraiser',
      'A Conference',
      'A Summit',
      'An Event'
    ];
  
    static readonly PHONE_PATTERN = /^[6789]{1}[0-9]{9}$/;
    // tslint:disable-next-line:max-line-length
    static readonly EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    static readonly URL_PATTERN = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;



    // static updateRolesFromService(roleService: StudentService): void {
    //   const responseData = roleService.getRolesData();
    //   console.log("rolessss", responseData)
    //   AppConstants.updateRoles(responseData);
    // }
  
    // static updateRoles(responseData: any[]): void {
    //   responseData.forEach(item => {
    //     switch (item.typeName) {
    //       case 'Trainee':
    //         AppConstants.STUDENT_ROLE = item.typeName;
    //         break;
    //       case 'Trainer':
    //         AppConstants.INSTRUCTOR_ROLE = item.typeName;
    //         break;
    //       case 'Admin':
    //         AppConstants.ADMIN_ROLE = item.typeName;
    //         break;
    //       case 'Assessor':
    //         AppConstants.ASSESSOR_ROLE = item.typeName;
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    //   AppConstants.ALLTHREEROLES = [
    //     AppConstants.INSTRUCTOR_ROLE,
    //     AppConstants.ADMIN_ROLE,
    //     AppConstants.ASSESSOR_ROLE
    //   ].filter(role => role); // Filter out any empty values
    // }
  }
  
  