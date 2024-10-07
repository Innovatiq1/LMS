import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailConfigService } from '@core/service/email-config.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

export interface DialogData {
 typeName: any;
}


@Component({
  selector: 'app-send-dailog',
  templateUrl: './send-dailog.component.html',
  styleUrls: ['./send-dailog.component.scss']
})
export class SendDailogComponent {
  dataSource: any;
  isLoading = true;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  subscribeParams: any;
  typeName: any;
  usersList: any;
  displayedColumns = [
    'select',
    'User',
    'Email',
  ];
  currentDate!: Date;
  currentTime!: string;
  selectedEmails: any;


  constructor(private router: Router,
    public utils: UtilsService,
    private alluserService: UserService,
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SendDailogComponent>,
    private emailService: EmailConfigService

  ) {

   
}

@ViewChild('filter', { static: true }) filter!: ElementRef;

ngOnInit(): void {
  this.usersList = this.data.users
}

logSelectedEmails(event: any, row: any) {
  row.selected = event.checked; 
  this.selectedEmails = this.usersList
  .filter((user: { selected: any; }) => user.selected)
  .map((user: { email: any; }) => user.email)
  .join(', ');
}
sendEmail() {
  let mail: any = [];
  let userDetails = JSON.parse(localStorage.getItem('currentUser')!);
  this.currentDate = new Date();
  this.currentTime = this.currentDate.toLocaleTimeString();

  mail.push({
    to: this.selectedEmails,
    content: `<a href="http://192.168.1.190:4500/admin/survey/view-feedback/${this.data.surveyId}" target=_blank>${this.data.surveyName}</a>`,
    from: userDetails.user.email,
    fromName: userDetails.user.name,
    fromProfile: userDetails.user.avatar,
    date: this.currentDate,
    time:this.currentTime,
    read: false
  });

  let payload = {
    mail: mail,
    subject: 'Feedback Form',
    toStatus: 'active',
    fromStatus: 'active'
  };

  this.emailService.sendEmail(payload).subscribe((response: any) => {

    Swal.fire({
      title: 'Successful',
      text: 'Email sent successfully',
      icon: 'success',
    });
  });

}
closeDialog(): void {
  this.dialogRef.close();
}

}
