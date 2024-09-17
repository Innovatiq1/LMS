
export let MENU_ITEMS: any[] = [];
export let DASHBOARDMENU_LIST: any[] = [];
DASHBOARDMENU_LIST =[
{
    "dashboard": "Admin",
    "content": [
      {
        "title": "Trainees Survey",
        "viewType": "Pie Chart"
      },
      {
        "title": "Trainee Performance Chart",
        "viewType": "Bar Chart"
      },
      {
        "title": "Average Class Attendance",
        "viewType": "Bar Chart"
      },
      {
        "title": "Users",
        "viewType": "Pie Chart"
      },
      {
        "title": "New Admission Report",
        "viewType": "Pie Chart"
      },
      {
        "title": "Fees Collection Report",
        "viewType": "Pie Chart"
      },
      {
        "title": "Over-all Training Budget",
        "viewType": "Pie Chart"
      },
      {
        "title": "Actual Cost or Budget",
        "viewType": "Pie Chart"
      }
    ],
  
  },
{
    "dashboard": "Trainee",
    "content": [
      {
        "title": "Good Job",
        "viewType": "Pie Chart",
        "percentage": "100"
      }
    ],
  
  }
]
MENU_ITEMS = [...DASHBOARDMENU_LIST];
