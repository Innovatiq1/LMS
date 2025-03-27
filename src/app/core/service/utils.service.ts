import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {
  }
  isLoggedIn(): boolean {
    let user =localStorage.getItem('currentUser')
    if(user){
      return true
    } else {
      return false
    }
}
  pageSizeArr = [10, 25, 50, 100];

  validationMessages: any = {
    dname: [
      { type: 'required', message: 'Enter Department Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    deptname: [
      { type: 'required', message: 'Select Department' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    grant_type: [
      { type: 'required', message: 'Enter Funding Grant' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    vendor: [
      { type: 'required', message: 'Enter Vendor' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    discountTitle: [
      { type: 'required', message: 'Enter Discount Title' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    discountType: [
      { type: 'required', message: 'Select Discount Type' },
    ],

    role: [
      { type: 'required', message: 'Enter Role' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    assessment : [
      // { type: 'required', message: 'Select Assessment ' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    tutorial : [
      // { type: 'required', message: 'Select Assessment ' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    e_assessment : [
    //  { type: 'required', message: 'Select Exam Assessment ' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    roll_no: [
      { type: 'required', message: 'Enter Roll No' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
  
    budget: [
      { type: 'required', message: 'Enter Budget' },
      { type: 'min', message: 'Enter Budget between 1-999999' },
      { type: 'max', message: 'Enter Budget between 1-999999' },
      { type: 'pattern', message: 'Enter Digits' },
    ],
    director: [{ type: 'required', message: 'Select Director' }],
    dept: [{ type: 'required', message: 'Select any Department' }],
    ro: [{ type: 'required', message: 'Select any RO' }],
    trainingAdmin: [{ type: 'required', message: 'Select any Training Admin' }],
    percentage: [
      { type: 'required', message: 'Enter Percentage' },
      { type: 'min', message: 'Percentage must be at least 1%' },
      { type: 'max', message: 'Percentage must be at most 100%' },
    ],
    value: [
      { type: 'required', message: 'Enter Value' },
      { type: 'min', message: 'Value must be at least 1' },
    ],
    scores: [
      { type: 'required', message: 'Enter Score' },
      { type: 'min', message: 'Score must be at least 1' },
    ],
    times: [
      { type: 'required', message: 'Enter Score' },
      { type: 'min', message: 'Score must be at least 1' },
    ],
    total: [
      { type: 'required', message: 'Enter Total Budget' },
      { type: 'min', message: 'Total must be at least 1' },
    ],
    ename: [
      { type: 'required', message: 'Enter Employee Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    fname: [
      { type: 'required', message: 'Enter First Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    designation: [
      { type: 'required', message: 'Enter Designation' },
      { type: 'min', message: 'Total must be at least 2' },
    ],
    department: [
      { type: 'required', message: 'Enter Department' },
      { type: 'min', message: 'Total must be at least 2' },
    ],
    sname: [
      { type: 'required', message: 'Enter RO Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    lname: [
      { type: 'required', message: 'Enter Training Admin Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    dhname: [
      { type: 'required', message: 'Enter Director Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    cname: [
      { type: 'required', message: 'Enter Course Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    vname: [
      { type: 'required', message: 'Enter Vendor Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    gender: [
      { type: 'required', message: 'Select Gender' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    uname: [
      { type: 'required', message: 'Enter Username' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    cost: [
      { type: 'required', message: 'Enter Course Cost' },
      { type: 'min', message: 'Value must be at least 1' },
    ],
    timeline: [
      { type: 'required', message: 'Enter Course Timeline' },
      { type: 'min', message: 'Timeline must be at least 1 day' },
    ],
    userGroup: [
      { type: 'required', message: 'Enter User Group' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    user: [
      { type: 'required', message: 'Select User' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    edu: [
      { type: 'required', message: 'Enter Education' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    address:[
      { type: 'required', message: 'Enter Address' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    mobile: [
      { type: 'required', message: 'Enter Mobile Number' },
      
    ],
    port: [
      { type: 'required', message: 'Enter Port' },
      
    ],
    host: [
      { type: 'required', message: 'Enter Email Host' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    salary: [
      { type: 'required', message: 'Enter Salary' },
      { type: 'min', message: 'Enter Fees between 0-999999' },
      { type: 'max', message: 'Enter Fees between 0-999999' },
      { type: 'pattern', message: 'Enter Digits' },
      
    ],
    programfee: [
      { type: 'required', message: 'Enter Program Fee' },
      { type: 'min', message: 'Enter Fees between 0-999999' },
      { type: 'max', message: 'Enter Fees between 0-999999' },
      { type: 'pattern', message: 'Enter Digits' },
      
    ],
    city: [
      { type: 'required', message: 'Enter City' },
      
    ],
    dob: [
      { type: 'required', message: 'Select Date' },
      
    ],
    'title': [
      { type: 'required', message: 'Enter Course Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    'name': [
      { type: 'required', message: 'Enter Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    'documentLink': [
     // { type: 'required', message: 'Enter Document link' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },

    ],
    'bannerFor': [
      { type: 'required', message: 'Select bannerFor' },
    ],
    'imagePath': [
      { type: 'required', message: 'Please Upload Banner' }
    ],
    'courseCode': [
      { type: 'required', message: 'Enter Course Code' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    'programCode': [
      { type: 'required', message: 'Enter Program Code' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    'main_category': [
      { type: 'required', message: 'Select Main Category' },
    ],
    'sub_category': [
      { type: 'required', message: 'Select Sub Category' },
    ],
    'course_duration_in_days': [
      { type: 'required', message: 'Enter Days ' },
      { type: 'min', message: 'Enter minimum 1 Day' },
      { type: 'pattern', message: 'Enter Digits' },

    ],
    'training_hours': [
      { type: 'required', message: 'Enter Training ' },
      { type: 'min', message: 'Enter minimum 0.5' },
      { type: 'pattern', message: 'Enter Digits' },
    ],
    'fee': [
      { type: 'required', message: 'Enter Fees ' },
      { type: 'min', message: 'Enter Fees between 0-999999' },
      { type: 'max', message: 'Enter Fees between 0-999999' },
      { type: 'pattern', message: 'Enter Digits' },
    ],
    'currency': [
      { type: 'required', message: 'Select Currency ' },
    ],
    'skill_connect_code': [
      { type: 'required', message: 'Enter Skill Connect Code' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    'course_description': [
      { type: 'required', message: 'Enter Description' },
      { type: 'maxlength', message: 'Enter maximum 100 characters' },
    ],
    'course_detailed_description': [
      { type: 'required', message: 'Enter Course Detailed Description' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    'pdu_technical': [
      { type: 'required', message: 'Enter PDU Technical' },
      { type: 'min', message: 'Enter minimum 0' },
      { type: 'max', message: 'Enter maximum 999' },
      { type: 'pattern', message: 'Enter Digits' },
    ],
    'pdu_leadership': [
      { type: 'required', message: 'Enter PDU Leadership' },
      { type: 'min', message: 'Enter minimum 0' },
      { type: 'max', message: 'Enter maximum 999' },
      { type: 'pattern', message: 'Enter Digits' },
    ],
    'pdu_strategic': [
      { type: 'required', message: 'Enter PDU Strategic' },
      { type: 'min', message: 'Enter minimum 0' },
      { type: 'max', message: 'Enter maximum 999' },
      { type: 'pattern', message: 'Enter Digits' },
    ],
    'funding_grant': [
      { type: 'required', message: 'Select Funding/Grant' }
    ],
    'survey': [
      { type: 'required', message: 'Select Survey' }
    ],
    'course_instructor': [
      { type: 'required', message: 'Select Instructor' }
    ],
    'assign_exam': [
      { type: 'required', message: 'Select Exam' }
    ],
    'course_kit': [
      { type: 'required', message: 'Select Course Kit' }
    ],
    'category_name': [
      { type: 'required', message: 'Enter Main Category' },
      ],
     
    'certificates': [
      { type: 'required', message: 'Select Certificate' }
    ],
    'website_link': [
      { type: 'required', message: 'Enter Website' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
      { type: 'pattern', message: 'Enter a valid Website' },
    ],
    'shortDescription': [
      { type: 'required', message: 'Enter Short Description' },
      { type: 'maxlength', message: 'Enter maximum 100 characters' },

    ],
    'longDescription': [
     // { type: 'required', message: 'Enter Long Description' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
    'coursekitName': [
      { type: 'required', message: 'Enter Course Kit Name' },
    ],
    'document': [
      { type: 'required', message: 'Select Document' },
    ],
    'media': [
      { type: 'required', message: 'Select Media' },
    ],
    'courseId': [
      {type: 'required', message: 'Enter Course Name'},
    ],
    'classDeliveryType': [
      {type: 'required', message: 'Enter Class Delivery Type'}
    ],
    'instructorCost': [
      {type: 'required', message: 'Enter Instructor Cost'}
    ],
    'minimumEnrollment': [
      {type: 'required', message: 'Enter Minimum Enrollment'}
    ],
    'maximumEnrollment': [
      {type: 'required', message: 'Enter Maximum Enrollment'}
    ],
    'sections': [
      { type: 'required', message: 'Select section under which video needs to display' },
    ],
    'typeName': [
      {type: 'required', message: 'Enter User Type'}
    ],
    'qualification': [
      {type: 'required', message: 'Enter Qualification'}
    ],
    'country': [
      {type: 'required', message: 'Enter Country'},
      {type: 'minlength', message: 'Enter minimum 2 characters'}

    ],
    'text': [
      {type: 'required', message: 'Enter Review'},
      {type: 'maxlength', message: 'Enter maximum 150 characters'}

    ],
    'position': [
      {type: 'required', message: 'Enter Position'}
    ],

    'email':[
      {type:'required', message: 'Enter Email'},
      {type:'pattern', message: 'Enter a Valid email'}
    ],
    'password':[
      {type:'required', message: 'Enter Password'}
    ],
    're-enterPsw':[
      {type:'required', message: 'Re-Enter Password'}
    ],
    'type':[
      {type: 'required', message: 'Select User Type'}
    ],
    'courseName':[
      {type: 'required', message: 'Select Course Name'}
    ],
    'subject':[
      {type:'required',message:'Enter Title'}
    ],
    'details':[
      {type:'required', message:'Enter Description'}
    ],
    'shortdescription':[
      {type:'required', message:'Enter Description'}
    ],
    'description':[
      {type:'required',message:'Enter Description'}
    ],
    'email_subject':[
      {type:'required',message:'Enter Email Subject'}
    ],
    'email_top_welcome_text':[
      {type:'required',message:'Enter Top Header Text'}
    ],
    'email_top_header_text':[
      {type:'required',message:'Enter Top Header Text'}
    ],
    'email_content1':[
      {type:'required',message:'Enter Text'}
    ],
    'email_content':[
      {type:'required',message:'Enter Text'}
    ],
    'bottom_button_text':[
      {type:'required',message:'Enter Bottom Button Text'}
    ],
    'electiveCourseCount':[
      {type: 'required',message:'Enter Elective Count'}
    ],
    'coreCourseCount':[
      {type: 'required',message:'Enter Compulsary Count'},
      {type:'required',message:'Enter Course Count'}
    ],
    'deliveryMode':[ 
    {type: 'required',message:'Select Mode'}
    ],
    'course':[
      {type: 'required',message:'Enter Program Name'}
    ],
    'program_name':[
      {type: 'required', message:'Enter Program Name'}
    ],
    'document_Link':[
      {type: 'required', message:'Enter Document Link'}
    ],
    'descripton':[
      {type: 'required', message:'Enter Description'}
    ],
    'roles':[
      {type: 'required', message:'Select Role'}
    ],
    'view':[
      {type: 'required', message:'Select View Type'}
    ],
    'percent':[
      {type: 'required', message:'Select Percentage'}
    ],
    'public':[
      {type:'required', message: 'Enter Public Key'}
    ],
    'webhook':[
      {type:'required', message: 'Enter Webhook Secret Key'}
    ],
    'clientId':[
      {type:'required', message: 'Enter Client ID'}
    ],
    'clientSecret':[
      {type:'required', message: 'Enter Client Secret'}
    ],
    'redirectUri':[
      {type:'required', message: 'Enter Redirect URI'}
    ],
    'secret':[
      {type:'required', message: 'Enter Secret Key'}
    ],
    'test-secret':[
      {type:'required', message: 'Enter Test Secret Key'}
    ],
    'company':[
      {type:'required', message: 'Enter Company Name'}
    ],
    'meetingPlatform': [
      {
        type:'required', message:'Enter Meeting Platform Name'
      }
    ],
    'scormPkgName': [
      { type: 'required', message: 'Enter SCORM Package Name' },
      { type: 'minlength', message: 'Enter minimum 2 characters' },
      { type: 'maxlength', message: 'Enter maximum 255 characters' },
    ],
  };


  validators: any = {
    dname: [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(150),
    ],
    coreCourseCount:[Validators.required],
    electiveCourseCount:[Validators.required],
    deptname:[
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(150),
    ],
    ename: [
      // Validators.required,
      Validators.minLength(2),
      Validators.maxLength(150),
    ],
    fname: [
      // Validators.required,
      Validators.minLength(2),
      Validators.maxLength(150),
    ],
    password:[
      Validators.required,
    ],
    currentPsw:[
      Validators.required,
    ],
    currency:[Validators.required,],
    city: [
      Validators.required,
    ],
    assessment:[Validators.minLength(2), Validators.maxLength(150)],
    e_assessment:[Validators.minLength(2), Validators.maxLength(150)],
    tutorial:[Validators.minLength(2), Validators.maxLength(150)],
    gender:[Validators.required,Validators.minLength(2), Validators.maxLength(150)],
    budget: [Validators.required, Validators.min(1), Validators.max(99999999)],
    percentage: [Validators.required, Validators.min(1), Validators.max(100)],
    value: [Validators.required, Validators.min(1)],
    onlyAlphabets: [Validators.pattern(/^[a-zA-Z\s]+$/)],
    designation: [Validators.required, Validators.min(2)],
    userGroup:[Validators.required, Validators.min(2)],
    user: [Validators.required],
    title: [ Validators.required,Validators.minLength(2), Validators.maxLength(255)],
    bannerFor: [Validators.required],
    imagePath: [Validators.required],
    sections: [ Validators.required],
    email: [Validators.pattern(/^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,15})+$/),
    (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return {
          required: true
        }
      }
      else {
        return null;
      }
    }],
    uname:[Validators.required],
    dob:[Validators.required,Validators.min(2)],
    address:[Validators.required,Validators.min(5),Validators.max(250)],
    country:[Validators.required],
    edu:[Validators.required,Validators.minLength(2), Validators.maxLength(150)],
    mobile:[Validators.required, Validators.pattern('[0-9]+')],
    roll_no:[Validators.required, Validators.minLength(2), Validators.maxLength(150)],
    name: [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
    documentLink: [ 
      //Validators.required,
      Validators.minLength(2), Validators.maxLength(255)],
    course_duration_in_days: [ Validators.min(1), Validators.pattern(/^\d+(\.\d+)?$/)],
    training_hours: [  Validators.min(0.5), Validators.pattern(/^\d+(\.\d+)?$/)],
    fee: [ Validators.min(0), Validators.max(99999999), Validators.pattern(/^\d+(\.\d+)?$/)],
    course: [Validators.maxLength(20)],
    longDescription: [
      // Validators.required, 
       Validators.min(2),
        Validators.max(255)],
    descripton: [ Validators.maxLength(100)],
    website: [ Validators.maxLength(255), Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/)],
    pdu: [ Validators.min(0), Validators.max(999), Validators.pattern(/^\d+(\.\d+)?$/)],
    category_name:[Validators.required,Validators.minLength(2),Validators.maxLength(255)],
    sub_category:[Validators.required,Validators.minLength(2),Validators.maxLength(255)],
    noLeadingSpace: [Validators.pattern(/^\S/), (control: AbstractControl) => {
      if (Array.isArray(control.value)) {
        if (control && control?.value && !control?.value[0]?.trim().length) {
          control.setValue('');
        }
      }
      else {
        if (control && control?.value && !control?.value?.trim().length) {
          control.setValue('');
        }
      }
      return null;
    }],
  };
  getErrorMessage1(
    control: AbstractControl | null,
    fieldName: string
  ): string | null {
    if (!control) {
      return null;
    }
    
    for (const validator of this.validationMessages[fieldName]) {
      if (control.hasError(validator.type)) {
        return validator.message;
      }
    }

    return null;
  }

  noLeadingSpace(control: AbstractControl) {
    if (control && control.value && !control.value?.trim().length) {
      control.setValue('');
    }
    return null;
  }
  getErrorMessage(userForm: FormGroup, key: string) {
    let err = this.validationMessages[key].find((val: any) => {
      return userForm?.get(key)?.hasError(val.type);
    });
    return err;
  }
}
