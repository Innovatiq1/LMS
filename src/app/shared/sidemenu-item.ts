
export let MENU_ITEMS: any[] = [];
export let SIDEMENU_LIST: any[] = [];
SIDEMENU_LIST =[
{

    "MENU_LIST": [
      {
      
        "title": "Dashboard",
        "id": "dashboard",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\dashboard-1712992226514.png",
        "class": "menu-toggle",
        "actions": [],
        "children": []
      },
      {
        
        "title": "Program",
        "id": "admin/program",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\Diploma-Hat-PNG-HD-Image-1712992233666.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
            "title": "Program List",
            "id": "program-list",
            "class": "ml-sub-menu",
            "actions": [],
            "children": [
              {
                "title": "Program Name",
                "id": "program-name",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "Create",
                    "id": "create-program",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "View",
                    "id": "view-program",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
                "title": "Creator",
                "id": "pcreator",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "Create",
                    "id": "create-prog-creator",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "View",
                    "id": "view-prog-creator",
                    "class": "ml-menu3"
                  }
                ]
              }
            ]
          },
          {
            "title": "Submitted Programs",
            "id": "submitted-program",
            "class": "ml-sub-menu",
            "actions": [],
            "children": [
              {
                "title": "Approved Programs",
                "id": "submitted-approved-program",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "View",
                    "id": "view-sub-approved-program",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-sub-approved-program",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
                "title": "Pending Programs",
                "id": "submitted-pending-program",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "Edit",
                    "id": "edit-sub-pending-program",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "View",
                    "id": "view-sub-pending-program",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-sub-pending-program",
                    "class": "ml-menu3"
                  }
                ]
              }
            ]
          },
          {
            "title": "Registered Programs",
            "id": "student-program",
            "class": "ml-sub-menu",
            "actions": [],
            "children": [
              {
                "title": "Approved Programs",
                "id": "registered-approved-program",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "View",
                    "id": "view-reg-approved-program",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-reg-approved-program",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
                "title": "Pending Programs",
                "id": "registered-pending-program",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "Edit",
                    "id": "edit-reg-pending-program",
                    "class": "ml-menu3"
                  },
                  {
                    
                    "title": "View",
                    "id": "view-reg-pending-program",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-reg-pending-program",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
                "title": "Completed Programs",
                "id": "program-completed-program",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "View",
                    "id": "view-completed-program",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-completed-program",
                    "class": "ml-menu3"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "title": "Course",
        "id": "admin/courses",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\programs-1712992238826.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
             
              {
                
                "title": "Course List",
                "id": "course-name",
                "class": "ml-menu",
                "actions": [
                  {
                   
                    "title": "Create",
                    "id": "create-course",
                    "class": "ml-menu3"
                  },
                  {
                    
                    "title": "View",
                    "id": "view-course",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
                "title": "Course Batch",
                "id": "class-list",
                "class": "ml-menu",
                "actions": [
                  {
                    "title": "Create",
                    "id": "create-course-class",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Edit",
                    "id": "edit-course-class",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "View",
                    "id": "view-course-class",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-course-class",
                    "class": "ml-menu3"
                  }
                ],
                "children": []
              },
             
              {
                "title": "Drafts",
                "id": "drafts",
                "class": "ml-menu",
                "actions": [
                  {
                   
                    "title": "Edit",
                    "id": "edit-drafts",
                    "class": "ml-menu3"
                  },
                  {
                    
                    "title": "View",
                    "id": "view-drafts",
                    "class": "ml-menu3"
                  }
                ]
              }, 
          {
            
            "title": "Approval Course",
            "id": "submitted-courses",
            "class": "ml-sub-menu",
            "actions": [],
            "children": [
          
              {
                "title": "Pending",
                "id": "submitted-pending-courses",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "Edit",
                    "id": "edit-sub-pending-course",
                    "class": "ml-menu3"
                  },
                  {
                    
                    "title": "View",
                    "id": "view-sub-pending-course",
                    "class": "ml-menu3"
                  },
                  {
                    
                    "title": "Delete",
                    "id": "delete-sub-pending-course",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
                "title": "Rejected",
                "id": "submitted-rejected-courses",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "View",
                    "id": "view-sub-approved-course",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-sub-approved-course",
                    "class": "ml-menu3"
                  }
                ]
              },
            ]
          },
          {
            
            "title": "Trainee/Student",
            "id": "student-courses",
            "class": "ml-sub-menu",
            "actions": [],
            "children": [
              {
                
                "title": "Approved",
                "id": "registered-approved-courses",
                "class": "ml-menu2",
                "actions": [
                  {
                    
                    "title": "View",
                    "id": "view-reg-approved-course",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-reg-approved-course",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
               
                "title": "Approval Pending",
                "id": "registered-pending-courses",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "Edit",
                    "id": "edit-reg-pending-course",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "View",
                    "id": "view-reg-pending-course",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-reg-pending-course",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
                "title": "Completed",
                "id": "course-completed-courses",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "View",
                    "id": "view-completed-course",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "Delete",
                    "id": "delete-completed-course",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
                "title": "Discount Verification",
                "id": "verification-list",
                "class": "ml-menu2",
                "actions": [
                  {
                    "title": "Edit",
                    "id": "edit-discount",
                    "class": "ml-menu3"
                  },
                  {
                    "title": "View",
                    "id": "view-discount",
                    "class": "ml-menu3"
                  }
                ]
              },
              {
                "title": "Exam Scores",
                "id": "exam-scores",
                "actions": [],
              },
              {
                "title": "Retake Requests",
                "id": "retake-requests",
                "actions": [],
              }
            ]
          },
          {
            "title": "Course Kit",
            "id": "course-kit",
            "class": "ml-menu",
            "actions": [
              {
                "title": "Create",
                "id": "create-coursekit",
                "class": "ml-menu3"
              },
              {
                "title": "Edit",
                "id": "edit-coursekit",
                "class": "ml-menu3"
              },
              {
                "title": "View",
                "id": "view-coursekit",
                "class": "ml-menu3"
              },
              {
                "title": "Delete",
                "id": "delete-coursekit",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
        
        ]
      },
      {
        "title": "Enrollment",
        "id": "student/enrollment",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\Diploma-Hat-PNG-HD-Image-1712992652948.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
            "title": "Programs",
            "id": "program",
            "class": "ml-menu",
            "actions": [
              {
                "title": "All Programs",
                "id": "all-programs",
                "class": "ml-menu3"
              },
              {
                "title": "Registered Programs",
                "id": "registered-programs",
                "class": "ml-menu3"
              },
              {
                "title": "Approved Programs",
                "id": "approved-programs",
                "class": "ml-menu3"
              },
              {
                "title": "Completed Programs",
                "id": "completed-programs",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
          {
            "title": "Courses",
            "id": "course",
            "class": "ml-menu",
            "actions": [
              {
                "title": "All Courses",
                "id": "all-courses",
                "class": "ml-menu3"
              },
              {
                "title": "Registered Courses",
                "id": "registered-courses",
                "class": "ml-menu3"
              },
              {
                "title": "Approved Courses",
                "id": "approved-courses",
                "class": "ml-menu3"
              },
              {
                "title": "Completed Courses",
                "id": "completed-courses",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
          {
            "title": "Assessment",
            "id": "assessment-exam",
            "class": "ml-menu",
            "actions": [
              {
                "title": "Assessment",
                "id": "assessment",
                "class": "ml-menu3"
              },
              {
                "title": "Tutorial",
                "id": "tutorial",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
          {
            "title": "Exam",
            "id": "exam",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Exam Results",
            "id": "exam-results",
            "class": "ml-menu",
            "actions": [],
            "children": []
          }
        ]
      },
      {
        "title": "Lectures",
        "id": "instructor",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\lectures-1712992641027.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
            "title": "Program Lectures",
            "id": "program-lectures",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Course Lectures",
            "id": "course-lectures",
            "class": "ml-menu",
            "actions": [],
            "children": []
          }
        ]
      },
      {
        "title": "Timetable",
        "id": "timetable",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\ttable-1712992287208.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
            "title": "All Programs",
            "id": "program-timetable",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "All Courses",
            "id": "course-timetable",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "My Programs",
            "id": "my-programs",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "My Courses",
            "id": "my-courses",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Program Class",
            "id": "schedule-class",
            "class": "ml-menu",
            "actions": [
              {
                "title": "Create",
                "id": "create-program-class",
                "class": "ml-menu3"
              },
              {
                "title": "Edit",
                "id": "edit-program-class",
                "class": "ml-menu3"
              },
              {
                "title": "View",
                "id": "view-program-class",
                "class": "ml-menu3"
              },
              {
                "title": "Delete",
                "id": "delete-program-class",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
        
          {
            "title": "E-Attendance",
            "id": "e-attendance",
            "class": "ml-menu",
            "actions": [],
            "children": []
          }
        ]
      },
      {
        "title": "Finance",
        "id": "admin/budgets",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\finace-1712992292990.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
            "title": "Training Request",
            "id": "training-request",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Training Approval Request",
            "id": "training-approval-req",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Budget Approval Request",
            "id": "budget-request",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Department Budget Approval",
            "id": "department-budget-request",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "All Requests",
            "id": "all-requests",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Budget",
            "id": "budget",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Allocation ",
            "id": "allocation",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Program Payment ",
            "id": "program-payment",
            "class": "ml-menu",
            "actions": [
              {
                "title": "View",
                "id": "view-program-payment",
                "class": "ml-menu3"
              },
              {
                "title": "Delete",
                "id": "delete-program-payment",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
          {
            "title": "Course Payment ",
            "id": "course-payment",
            "class": "ml-menu",
            "actions": [
              {
                "title": "View",
                "id": "view-course-payment",
                "class": "ml-menu3"
              },
              {
                "title": "Delete",
                "id": "delete-course-payment",
                "class": "ml-menu3"
              }
            ],
            "children": []
          }
        ]
      },
      {
        "title": "Survey",
        "id": "admin/survey",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\survey-1712992306274.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
            "title": "Feedbacks List",
            "id": "feedbacks-list",
            "class": "ml-menu",
            "actions": [
              {
                "title": "View",
                "id": "view-feedback",
                "class": "ml-menu3"
              },
              {
                "title": "Delete",
                "id": "delete-feedback",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
          {
            "title": "Survey List",
            "id": "survey-list",
            "class": "ml-menu",
            "actions": [
              {
                "title": "Create",
                "id": "create-survey",
                "class": "ml-menu3"
              },
              {
                "title": "Edit",
                "id": "edit-survey",
                "class": "ml-menu3"
              },
              {
                "title": "View",
                "id": "view-survey",
                "class": "ml-menu3"
              },
              {
                "title": "Delete",
                "id": "delete-survey",
                "class": "ml-menu3"
              }
            ],
            "children": []
          }
        ]
      },
      {
        "title": "User Profile",
        "id": "admin/user-profile",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\survey-1712992306274.png",
        "class": "menu-toggle",
        "action": [],
        "children": [
          {
            "title": "All Users",
            "id": "all-users",
            "class": "ml-menu",
            "action": [
              {
                "title": "View",
                "id": "view-user",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
          {
            "title": "Managers",
            "id": "all-managers",
            "class": "ml-menu",
            "action": [
              {
                "title": "View",
                "id": "view-manager",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
          {
            "title": "Staff",
            "id": "all-staff",
            "class": "mi-menu",
            "action": [
              {
                "title": "View",
                "id": "view-staff",
                "class": "ml-menu3"
              }
            ],
            "children": []
          }
        ]
      },
      {
        "title": "Logs",
        "id": "admin/audit",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\logs-1712992574082.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
            "title": "List",
            "id": "audit-list",
            "class": "ml-menu",
            "actions": [],
            "children": []
          }
        ]
      },
      {
        "title": "Reschedule",
        "id": "reschedule",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\survey-1712992487929.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
            "title": "Program",
            "id": "programs",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Course",
            "id": "courses",
            "class": "ml-menu",
            "actions": [
              {
                "title": "Create",
                "id": "create-reschedule",
                "class": "ml-menu3"
              },
              {
                "title": "Edit",
                "id": "edit-reschedule",
                "class": "ml-menu3"
              },
              {
                "title": "View",
                "id": "view-reschedule",
                "class": "ml-menu3"
              },
              {
                "title": "Delete",
                "id": "delete-reschedule",
                "class": "ml-menu3"
              }
            ],
            "children": []
          },
          {
            "title": "Rescheduled Courses",
            "id": "rescheduled-courses",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Reschedule Requests",
            "id": "reschedule-requests",
            "class": "ml-menu",
            "actions": [
              {
                "title": "Edit",
                "id": "edit-reschedule-request",
                "class": "ml-menu3"
              },
              {
                "title": "Delete",
                "id": "delete-reschedule-request",
                "class": "ml-menu3"
              }
            ],
            "children": []
          }
        ]
      },
      {
        "title": "Reports",
        "id": "admin/reports",
        "iconsrc": "http://203.118.55.27:3004/uploads\\.png\\reports-1712992460835.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
            "title": "Summary Report",
            "id": "report",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "Feedback Reports ",
            "id": "feedback-report",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
            "title": "User Reports ",
            "id": "user-report",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
           
            "title": "Payment Reports ",
            "id": "payment-report",
            "class": "ml-menu",
            "actions": [],
            "children": []
          },
          {
           
            "title": "Meeting Reports ",
            "id": "meeting-report",
            "class": "ml-menu",
            "actions": [],
            "children": []
          }
        ]
      },
      {
    
        "title": "Gami/Rewards",
        "id": "admin/gami",
        "iconsrc": "http://203.118.55.27:3004/uploads\\\\.png\\\\gami-1713959550797.png",
        "class": "menu-toggle",
        "actions": [],
        "children": [
          {
          
            "title": "Gami",
            "id": "gami",
            "class": "ml-menu",
            "actions": [],
            "children": []
          }
        ]
      }
    ],  
    "name": "Side menu",
  }


]
MENU_ITEMS = [...SIDEMENU_LIST];
