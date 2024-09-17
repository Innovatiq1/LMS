export let MENU_ITEMS: any[] = [];
export let EMAILCONFIGURATION_LIST: any[] = [];
EMAILCONFIGURATION_LIST =[
{
    "isDeleted": false,
    "forget_password_template": [
      {
        "email_subject": "Reset: Your TMS Password",
        "email_content": "We have received a Password Reset Request from your TMS account. If you have not made this request, you can safely ignore this message, and your account will not be affected. If you have made this request, please <b><font color=\"#f9e1e1\">login</font></b> with the password below and then reset your password....<br>",
        "bottom_button_text": "Click"
      }
    ],
   
    "welcome_email_template": [
      {
        "email_subject": "Welcome mail",
        "email_top_welcome_text": "Welcome",
        "email_content1": "<p>Welcome to Innovatiq...</p>",
        "bottom_button_text": "Confirm"
      }
    ],
    "new_project_add_template": [
      {
        "email_subject": "New Course Registered",
        "email_top_header_text": "Course Registered",
        "email_content": "Your payment has been successful.Please wait for approval.",
        "bottom_button_text": "Download"
      }
    ],
    "new_member_reffered_template": [
      {
        "email_subject": "New Program Registered",
        "email_top_header_text": "Program Registered",
        "email_content": "Your payment has been Successful, please wait for admin's approval<font face=\"Arial\">.</font>"
      }
    ],
    "completed_project_template": [
      {
        "email_subject": "Congratulations!!!",
        "email_top_header_text": "You have successfully completed the course. ",
        "email_content": "<font color=\"#0f0f0f\">Please click on the below download button to download the certificate</font><font face=\"Arial\"></font>",
        "bottom_button_text": "Download"
      }
    ],
    "mentor_project_invite_template": [
      {
        "email_subject": "Program Completed",
        "email_top_header_text": "Program Completed",
        "email_content": "Program completed successfully<font face=\"Arial\">.</font>",
        "bottom_button_text": "Download"
      }
    ],
    "new_waitlist_template": [
      {
        "email_subject": "Program Approved",
        "email_top_header_text": "Program Approved",
        "email_content": "Program approved successfully<font face=\"Arial\">.</font>"
      }
    ],
    "admin_email_template": [
      {
        "email": "support@traininginstitute.com"
      }
    ],
    "admin_email": [
      {
        "email_subject": "Reset: Your TI Password",
        "email_content": "<table style=\"box-sizing: inherit; margin: 0px; padding: 0px; border-collapse: collapse; border: none; empty-cells: show; max-width: 100%; color: rgb(51, 71, 91); font-family: Lato, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\" width=\"100%\"><tbody style=\"box-sizing: inherit; margin: 0px; padding: 0px;\"><tr style=\"box-sizing: inherit; margin: 0px; padding: 0px; user-select: none;\"><td align=\"center\" bgcolor=\"#00A4BD\" style=\"box-sizing: inherit; margin: 0px; padding: 0px; user-select: text; min-width: 5px; border: 1px solid rgb(221, 221, 221); vertical-align: top; color: white;\"><img alt=\"Flower\" src=\"https://hs-8886753.f.hubspotemail.net/hs/hsstatic/TemplateAssets/static-1.60/img/hs_default_template_images/email_dnd_template_images/ThankYou-Flower.png\" width=\"400px\" align=\"middle\" class=\"fr-fic fr-dii\"><br><h1 style='box-sizing: inherit; margin: 0px 0px 16px; padding: 0px; color: rgb(34, 43, 69); font: 700 56px / 3rem \"Open Sans\", sans-serif; letter-spacing: normal;'><span style=\"font-size: 30px;\">Reset Your Password</span></h1></td></tr></tbody></table><table border=\"0\" cellpadding=\"0\" cellspacing=\"10px\" style=\"box-sizing: inherit; margin: 0px; padding: 30px 30px 30px 60px; border-collapse: collapse; border: none; empty-cells: show; max-width: 100%; color: rgb(51, 71, 91); font-family: Lato, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"></table><table border=\"0\" cellpadding=\"0\" cellspacing=\"10px\" style=\"box-sizing: inherit; margin: 0px; padding: 30px 30px 30px 60px; border-collapse: collapse; border: none; empty-cells: show; max-width: 100%; color: rgb(51, 71, 91); font-family: Lato, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\" width=\"100%\"><tbody style=\"box-sizing: inherit; margin: 0px; padding: 0px;\"><tr style=\"box-sizing: inherit; margin: 0px; padding: 0px; user-select: none;\"><td style=\"box-sizing: inherit; margin: 0px; padding: 0px; user-select: text; min-width: 5px; border: 1px solid rgb(221, 221, 221); vertical-align: top; width: 49.5062%;\"><br></td><td style=\"box-sizing: inherit; margin: 0px; padding: 0px; user-select: text; min-width: 5px; border: 1px solid rgb(221, 221, 221); vertical-align: top; width: 50.4938%;\"><br></td></tr></tbody></table><table bgcolor=\"#EAF0F6\" style=\"box-sizing: inherit; margin: 50px 0px 0px; padding: 0px; border-collapse: collapse; border: none; empty-cells: show; max-width: 100%; color: rgb(51, 71, 91); font-family: Lato, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\" width=\"100%\"><tbody style=\"box-sizing: inherit; margin: 0px; padding: 0px;\"><tr style=\"box-sizing: inherit; margin: 0px; padding: 0px; user-select: none;\"><td align=\"center\" style=\"box-sizing: inherit; margin: 0px; padding: 30px; user-select: text; min-width: 5px; border: 1px solid rgb(221, 221, 221); vertical-align: top;\"><h2 style='box-sizing: inherit; margin: 0px 0px 16px; padding: 0px; color: rgb(34, 43, 69); font: 900 28px / 2.5rem \"Open Sans\", sans-serif; letter-spacing: normal;'><span style=\"font-size: 18px;\">We have received a Password Reset Request from your TI account. If you have not made this request, you can safely ignore this message, and your account will not be affected. Please login with the password below.</span></h2><p><br></p></td></tr></tbody></table><table bgcolor=\"#F5F8FA\" style=\"box-sizing: inherit; margin: 0px; padding: 0px; border-collapse: collapse; border: none; empty-cells: show; max-width: 100%; color: rgb(51, 71, 91); font-family: Lato, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\" width=\"100%\"><tbody style=\"box-sizing: inherit; margin: 0px; padding: 0px;\"><tr style=\"box-sizing: inherit; margin: 0px; padding: 0px; user-select: none;\"><td align=\"left\" style=\"box-sizing: inherit; margin: 0px; padding: 30px; user-select: text; min-width: 5px; border: 1px solid rgb(221, 221, 221); vertical-align: top;\"><p style=\"font-weight: 100;\"><br></p><div style=\"text-align: center;\"><button style=\"font-style: inherit; font-variant: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; background-color: rgb(255, 122, 89); border: none; padding: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; color: white; border-radius: 5px; box-shadow: rgb(217, 76, 83) 3px 3px;\">&nbsp;Login</button></div></td></tr></tbody></table><p><br></p>"
      }
    ],
    "new_course_request_template": [
      {
        "email_top_header_text": "Course Requested",
        "email_subject": "New Course Requested",
        "email_content": "Please wait for approval."
      }
    ],
    "ro_course_approved_template": [
      {
        "email_top_header_text": "has been approved by your RO.",
        "email_subject": "Course Approved",
        "email_content": "Please wait for Director & Training Admin approval"
      }
    ],
    "trainingadmin_course_approved_template": [
      {
        "email_subject": "Course Approved",
        "email_content": "You can login & check",
        "email_top_header_text": "has been approved by Training Admin."
      }
    ],
    "ro_course_rejected_template": [
      {
        "email_subject": "Course Rejected",
        "email_content": "Please login & check the reason",
        "email_top_header_text": "has been rejected by your RO."
      }
    ],
    "director_course_rejected_template": [
      {
        "email_subject": "Course Rejected",
        "email_top_header_text": "has been rejected by your Director.",
        "email_content": "Please login & check the reason"
      }
    ],
    "trainingadmin_course_rejected_template": [
      {
        "email_top_header_text": "has been rejected by your Training Admin.",
        "email_subject": "Course Rejected",
        "email_content": "Please login & check the reason"
      }
    ],
    "ro_course_notification": [
      {
        "email_subject": "New Course Request",
        "email_top_header_text": "has been requested for",
        "email_content": "Please login & approve it."
      }
    ],
    "course_request_expiry": [
      {
        "email_top_header_text": "has requested for",
        "email_subject": "Course Request Approval",
        "email_content": "course 3 days back.Please login & approve."
      }
    ],
    "new_budget_request_template": [
      {
        "email_top_header_text": "You have received a new budget request from ",
        "email_subject": "New Budget Requested",
        "email_content": "Please login & approve it."
      }
    ],
    "new_dept_budget_request_template": [
      {
        "email_top_header_text": "You have received a new department budget request",
        "email_subject": "New Department Budget Requested",
        "email_content": "Please login & approve it."
      }
    ],
    "budget_approval_template": [
      {
        "email_subject": "Budget Approved",
        "email_top_header_text": "Your requested budget has been approved by Director.",
        "email_content": "You can login & check"
      }
    ],
    "budget_rejected_template": [
      {
        "email_subject": "Budget Rejected",
        "email_top_header_text": "Your requested budget has been rejected by Director.",
        "email_content": "Please login &amp; check the reaso<font face=\"Arial\">n</font>"
      }
    ],
    "budget_requested_template": [
      {
        "email_top_header_text": "You have requested a new budget.",
        "email_subject": "New Budget Requested",
        "email_content": "Please wait for director approval."
      }
    ],
    "dept_budget_requested_template": [
      {
        "email_subject": "New Department Budget Requested",
        "email_top_header_text": "You have requested a new department budget.",
        "email_content": "Please wait for director approval<font face=\"Arial\">.</font>"
      }
    ],
    "dept_budget_approval_template": [
      {
        "email_subject": "Department Budget Approved",
        "email_top_header_text": "Your requested department budget has been approved by Director.",
        "email_content": "You can login &amp; chec<font face=\"Arial\">k</font>"
      }
    ],
    "dept_budget_rejected_template": [
      {
        "email_subject": "Department Budget Rejected",
        "email_top_header_text": "Your requested department budget has been rejected by Director.",
        "email_content": "Please login &amp; check the reaso<font face=\"Arial\">n</font>"
      }
    ],
    "admin_course_notification": [
      {
        "email_subject": "Discount Verification Request",
        "email_top_header_text": "You have received a discount verification request.",
        "email_content": "Please login & verify the discount submitted."
      }
    ],
    "admin_discount_verififed_template": [
      {
        "email_subject": "Discount Approved",
        "email_top_header_text": "Your requested discount has been approved.",
        "email_content": "Please login & do the payment."
      }
    ],
    "admin_payment_notification": [
      {
        "email_subject": "Payment Verification",
        "email_top_header_text": "You have received a new payment.",
        "email_content": "Please login & approve the user"
      }
    ],
    "payment_approved_template": [
      {
        "email_subject": "Welcome onboard",
        "email_top_header_text": "You have been successfully enrolled into the course.",
        "email_content": "Please login & start your training."
      }
    ],
    
  }


]
MENU_ITEMS = [...EMAILCONFIGURATION_LIST];
