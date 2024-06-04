import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.scss']
})
export class CreateCertificateComponent implements OnInit {
  breadscrums = [
    {
      title: 'Certificate',
      items: ['Customize'],
      active: 'Edit certificate',
    },
  ];
  certificateForm!: FormGroup;


  constructor(private fb:FormBuilder){

  }

  ngOnInit(){
    this.certificateForm = this.fb.group({
      studentName: ['', Validators.required],
      courseName: ['', Validators.required],
      completionDate: ['', Validators.required],
      website: ['www.lms.com', Validators.required],
      companyName: ['LMS Inc.', Validators.required],
      recognitionText: ['hereby recognizes that', Validators.required],
      completionText: ['has successfully completed the', Validators.required],
      authorizedText: ['Authorized and issued by:', Validators.required]
    });  }

}
