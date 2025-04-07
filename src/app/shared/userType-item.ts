
export let MENU_ITEMS: any[] = [];
export let MENU_LIST: any[] = [];
MENU_LIST =[
{
  "menuItems": [
    {
      "title": "Dashboard",
      "id": "dashboard",
      "children": [],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\dashboard-1712992226514.png",
      "class": "menu-toggle"
    },
    {
      "title": "Program",
      "id": "admin/program",
      "children": [
        {
          "title": "Program List",
          "id": "program-list",
          "children": [
            {
              "title": "Program Name",
              "id": "program-name",
              "children": [],
              "actions": [
                {
                  "title": "Create",
                  "id": "create-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "View",
                  "id": "view-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            {
              "title": "Creator",
              "id": "pcreator",
              "children": [],
              "actions": [
                {
                  "title": "Create",
                  "id": "create-prog-creator",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "View",
                  "id": "view-prog-creator",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            }
          ],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-sub-menu",
          "isLeaf": true
        },
        {
          "title": "Submitted Programs",
          "id": "submitted-program",
          "children": [
            {
              "title": "Approved Programs",
              "id": "submitted-approved-program",
              "children": [],
              "actions": [
                {
                  "title": "View",
                  "id": "view-sub-approved-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-sub-approved-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            {
              "title": "Pending Programs",
              "id": "submitted-pending-program",
              "children": [],
              "actions": [
                {
                  "title": "Edit",
                  "id": "edit-sub-pending-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "View",
                  "id": "view-sub-pending-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-sub-pending-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            }
          ],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-sub-menu",
          "isLeaf": true
        },
        {
          "title": "Registered Programs",
          "id": "student-program",
          "children": [
            {
              "title": "Approved Programs",
              "id": "registered-approved-program",
              "children": [],
              "actions": [
                {
                  "title": "View",
                  "id": "view-reg-approved-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-reg-approved-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            {
              "title": "Pending Programs",
              "id": "registered-pending-program",
              "children": [],
              "actions": [
                {
                  "title": "Edit",
                  "id": "edit-reg-pending-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "View",
                  "id": "view-reg-pending-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-reg-pending-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            {
              "title": "Completed Programs",
              "id": "program-completed-program",
              "children": [],
              "actions": [
                {
                  "title": "View",
                  "id": "view-completed-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-completed-program",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            }
          ],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-sub-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\Diploma-Hat-PNG-HD-Image-1712992233666.png",
      "class": "menu-toggle"
    },
    {
      "title": "Course",
      "id": "admin/courses",
      "children": [
        {
          "title": "Course List",
          "id": "course-name",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-course",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-course",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Course Batch",
          "id": "class-list",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-course-class",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-course-class",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-course-class",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-course-class",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Drafts",
          "id": "drafts",
          "children": [],
          "actions": [
            {
              "title": "Edit",
              "id": "edit-drafts",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-drafts",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Approval Course",
          "id": "submitted-courses",
          "children": [
            {
              "title": "Rejected",
              "id": "submitted-rejected-courses",
              "children": [],
              "actions": [
                {
                  "title": "View",
                  "id": "view-sub-rejected-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-sub-rejected-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            {
              "title": "Pending",
              "id": "submitted-pending-courses",
              "children": [],
              "actions": [
                {
                  "title": "Edit",
                  "id": "edit-sub-pending-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "View",
                  "id": "view-sub-pending-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-sub-pending-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            }
          ],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-sub-menu",
          "isLeaf": true
        },
        {
          "title": "Trainee/Student",
          "id": "student-courses",
          "children": [
            {
              "title": "Approved",
              "id": "registered-approved-courses",
              "children": [],
              "actions": [
                {
                  "title": "View",
                  "id": "view-reg-approved-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-reg-approved-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            {
              "title": "Approval Pending",
              "id": "registered-pending-courses",
              "children": [],
              "actions": [
                {
                  "title": "Edit",
                  "id": "edit-reg-pending-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "View",
                  "id": "view-reg-pending-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-reg-pending-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            {
              "title": "Completed",
              "id": "course-completed-courses",
              "children": [],
              "actions": [
                {
                  "title": "View",
                  "id": "view-completed-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-completed-course",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            // {
            //   "title": "Discount Verification",
            //   "id": "verification-list",
            //   "children": [],
            //   "actions": [
            //     {
            //       "title": "Edit",
            //       "id": "edit-discount",
            //       "checked": true,
            //       "indeterminate": false,
            //       "isLeaf": true,
            //       "isAction": true
            //     },
            //     {
            //       "title": "View",
            //       "id": "view-discount",
            //       "checked": true,
            //       "indeterminate": false,
            //       "isLeaf": true,
            //       "isAction": true
            //     }
            //   ],
            //   "isAction": false,
            //   "checked": true,
            //   "indeterminate": false,
            //   "class": "ml-menu2",
            //   "isLeaf": true
            // },
            {
              "title": "Retake Requests",
              "id": "retake-requests",
              "children": [],
              "actions": [],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "isLeaf": true
            },
            {
              "title": "Enquiry List",
              "id": "enquiry-list",
              "children": [],
              "actions": [],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "isLeaf": true
            },
            {
              "title": "Exam Scores",
              "id": "exam-scores",
              "children": [],
              "actions": [],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "isLeaf": true
            }
          ],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-sub-menu",
          "isLeaf": true
        },
        {
          "title": "Course Kit",
          "id": "course-kit",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-coursekit",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-coursekit",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-coursekit",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-coursekit",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\programs-1712992238826.png",
      "class": "menu-toggle"
    },
    {
      "title": "Timetable",
      "id": "timetable",
      "children": [
        {
          "title": "All Programs",
          "id": "program-timetable",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "All Courses",
          "id": "course-timetable",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Program Class",
          "id": "schedule-class",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-program-class",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-program-class",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-program-class",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-program-class",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "E-Attendance",
          "id": "e-attendance",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": false,
      "indeterminate": true,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\ttable-1712992287208.png",
      "class": "menu-toggle"
    },
    {
      "title": "Finance",
      "id": "admin/budgets",
      "children": [
        {
          "title": "Program Payment ",
          "id": "program-payment",
          "children": [],
          "actions": [
            {
              "title": "View",
              "id": "view-program-payment",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-program-payment",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Course Payment ",
          "id": "course-payment",
          "children": [],
          "actions": [
            {
              "title": "View",
              "id": "view-course-payment",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-course-payment",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": false,
      "indeterminate": true,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\finace-1712992292990.png",
      "class": "menu-toggle"
    },
    {
      "title": "Survey",
      "id": "admin/survey",
      "children": [
        {
          "title": "Feedbacks List",
          "id": "feedbacks-list",
          "children": [],
          "actions": [
            {
              "title": "View",
              "id": "view-feedback",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-feedback",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Survey List",
          "id": "survey-list",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-survey",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-survey",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-survey",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-survey",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\survey-1712992306274.png",
      "class": "menu-toggle"
    },
    {
      "title": "Logs",
      "id": "admin/audit",
      "children": [
        {
          "title": "List",
          "id": "audit-list",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\logs-1712992574082.png",
      "class": "menu-toggle"
    },
    {
      "title": "Reports",
      "id": "admin/reports",
      "children": [
        {
          "title": "Summary Report",
          "id": "report",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Feedback Reports ",
          "id": "feedback-report",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "User Reports ",
          "id": "user-report",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Payment Reports ",
          "id": "payment-report",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Meeting Reports",
          "id": "meeting-report",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\reports-1712992460835.png",
      "class": "menu-toggle"
    }
  ],
  "isAdmin": false,
  "status": "active",
  "typeName": "admin",
  "description": "Admin Role",
  "settingsMenuItems": [
    {
      "title": "Manage Users",
      "id": "student/settings",
      "children": [
        {
          "title": "Module Access",
          "id": "user-type",
          "children": [],
          "actions": [
            {
              "title": "Edit",
              "id": "edit-module-access",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-module-access",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Role",
          "id": "create-user-role",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-role",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-role",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Department",
          "id": "create-department",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-dept",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-dept",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-dept",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-dept",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "User Profile",
          "id": "all-user",
          "children": [
            {
              "title": "All Users",
              "id": "all-users",
              "children": [],
              "actions": [
                {
                  "title": "Create",
                  "id": "create-user",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Edit",
                  "id": "edit-user",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "View",
                  "id": "view-user",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-user",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            {
              "title": "Trainees",
              "id": "all-students",
              "children": [],
              "actions": [
                {
                  "title": "Create",
                  "id": "create-student",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Edit",
                  "id": "edit-student",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "View",
                  "id": "view-student",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-student",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            },
            {
              "title": "Trainers",
              "id": "all-instructors",
              "children": [],
              "actions": [
                {
                  "title": "Create",
                  "id": "create-trainer",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Edit",
                  "id": "edit-trainer",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "View",
                  "id": "view-trainer",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                },
                {
                  "title": "Delete",
                  "id": "delete-trainer",
                  "checked": true,
                  "indeterminate": false,
                  "isLeaf": true,
                  "isAction": true
                }
              ],
              "isAction": false,
              "checked": true,
              "indeterminate": false,
              "class": "ml-menu2",
              "isLeaf": true
            }
          ],
          "actions": [],
          "isAction": false,
          "checked": false,
          "indeterminate": true,
          "class": "ml-sub-menu",
          "isLeaf": true
        },
        {
          "title": "User Group",
          "id": "user-group",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-user-group",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-user-group",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-user-group",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": false,
      "indeterminate": true,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\role-1720701432283.png",
      "class": "menu-toggle"
    },
    {
      "title": "Customize",
      "id": "student/settings/customize",
      "children": [
        {
          "title": "Side Menu",
          "id": "sidemenu",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Forms",
          "id": "customization-forms",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Certificate",
          "id": "certificate/template",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-certificate",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-certificate",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-certificate",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Survey",
          "id": "create-feedback",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Logo",
          "id": "logo-customization",
          "children": [],
          "actions": [
            {
              "title": "Edit",
              "id": "edit-logo",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-logo",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Email Templates",
          "id": "email-configuration",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Dashboards",
          "id": "student-dashboard",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": false,
      "indeterminate": true,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\custom-1720701452926.png",
      "class": "menu-toggle"
    },
    {
      "title": "Configuration",
      "id": "student/settings/configuration",
      "children": [
        {
          "title": "Forms",
          "id": "forms",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Languages",
          "id": "languages",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Vendor",
          "id": "vendor",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-vendor",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-vendor",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-vendor",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Funding/Grant",
          "id": "funding-grant",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-grant",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-grant",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-grant",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Assessment Configuration",
          "id": "all-questions",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-assess",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-assess",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-assess",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Currency",
          "id": "currency",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Passing Criteria",
          "id": "passing-criteria",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-criteria",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-criteria",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-criteria",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Discount",
          "id": "discount",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-discount",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-discount",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-discount",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Score Algorithm",
          "id": "score-algorithm",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-score",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-score",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-score",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Time Algorithm",
          "id": "time-algorithm",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-time",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-time",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-time",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Meeting Platform",
          "id": "meeting-platform",
          "children": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true,
          "actions": [
            {
              "title": "Create",
              "id": "create-meeting-platform",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-meeting-platform",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-meeting-platform",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
        },
        {
          "title": "Scorm Kit",
          "id": "scorm-kit",
          "children": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true,
          "actions": [
            {
              "title": "Create",
              "id": "create-scorm-kit",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-scorm-kit",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-scorm-kit",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
        },
      ],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\system-configuration1-1720701460834.png",
      "class": "menu-toggle"
    },
    {
      "title": "Integration",
      "id": "student/settings/integration",
      "children": [
        {
          "title": "Third Party Integrations",
          "id": "3rd-party-integrations",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "SMTP",
          "id": "smtp",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Singpass",
          "id": "singpass",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Payment Gateway",
          "id": "payment-gateway",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Social Login",
          "id": "social-login",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "zoom credentials",
          "id": "zoom-credentials",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.jpg\\integrate-1720701471857.jpg",
      "class": "menu-toggle"
    },
    {
      "title": "Security",
      "id": "student/settings/security",
      "children": [
        {
          "title": "2FA",
          "id": "2-factor-authentication",
          "children": [],
          "actions": [],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\security1-1720701479296.png",
      "class": "menu-toggle"
    },
    {
      "title": "Automation",
      "id": "student/settings/automation",
      "children": [
        {
          "title": "Announcement",
          "id": "announcement",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-announce",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-announce",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-announce",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-announce",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        },
        {
          "title": "Approval Workflow",
          "id": "approval-workflow",
          "children": [],
          "actions": [
            {
              "title": "Create",
              "id": "create-flow",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Edit",
              "id": "edit-flow",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "View",
              "id": "view-flow",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            },
            {
              "title": "Delete",
              "id": "delete-flow",
              "checked": true,
              "indeterminate": false,
              "isLeaf": true,
              "isAction": true
            }
          ],
          "isAction": false,
          "checked": true,
          "indeterminate": false,
          "class": "ml-menu",
          "isLeaf": true
        }
      ],
      "actions": [],
      "isAction": false,
      "checked": true,
      "indeterminate": false,
      "icon": "http://203.118.55.27:3004/uploads\\.png\\automate1-1720701485746.png",
      "class": "menu-toggle"
    }
  ]
}
]
MENU_ITEMS = [...MENU_LIST];
