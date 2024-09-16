
export let MENU_ITEMS: any[] = [];
export let DASHBOARDMENU_LIST: any[] = [];
DASHBOARDMENU_LIST =[
/** 
* Paste one or more documents here
*/
{
    "dashboard": "Admin",
    "content": [
      {
        "_id": {
          "$oid": "6683a4503cd5930624197188"
        },
        "title": "Trainees Survey",
        "viewType": "Pie Chart"
      },
      {
        "_id": {
          "$oid": "6683a4503cd5930624197189"
        },
        "title": "Trainee Performance Chart",
        "viewType": "Bar Chart"
      },
      {
        "_id": {
          "$oid": "6683a4503cd593062419718a"
        },
        "title": "Average Class Attendance",
        "viewType": "Bar Chart"
      },
      {
        "_id": {
          "$oid": "6683a4503cd593062419718b"
        },
        "title": "Users",
        "viewType": "Pie Chart"
      },
      {
        "_id": {
          "$oid": "6683a4503cd593062419718c"
        },
        "title": "New Admission Report",
        "viewType": "Pie Chart"
      },
      {
        "_id": {
          "$oid": "6683a4503cd593062419718d"
        },
        "title": "Fees Collection Report",
        "viewType": "Pie Chart"
      },
      {
        "_id": {
          "$oid": "6683a4503cd593062419718e"
        },
        "title": "Over-all Training Budget",
        "viewType": "Pie Chart"
      },
      {
        "_id": {
          "$oid": "6683a4503cd593062419718f"
        },
        "title": "Actual Cost or Budget",
        "viewType": "Pie Chart"
      }
    ],
  
  },
  /** 
* Paste one or more documents here
*/
{
    "dashboard": "Trainee",
    "content": [
      {
        "_id": {
          "$oid": "664b6c4d39053f49bcc915a8"
        },
        "title": "Good Job",
        "viewType": "Pie Chart",
        "percentage": "100"
      }
    ],
  
  }
]
MENU_ITEMS = [...DASHBOARDMENU_LIST];
