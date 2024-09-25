import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Event } from '@angular/router';
import { Message, ChatbotService } from './chatbot.service';
import { CourseService } from '../../../app/core/service/course.service';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent {
  @ViewChild('msgInput') msgInput!: ElementRef;
  @ViewChild('msgSubmit') msgSubmit!: ElementRef;
  showBotSubject: boolean = false;
  showMessenger: boolean = false;
  messages: any[] = [];
  name: string = '';
  initialLoad: any;
  userSelectedItem = '';
  userMsg: string = '';
  mainval: any;
  emailId: string = '';
  email: boolean = false;

  constructor(public courseService: CourseService) {
    
  }

  ngOnInit() {}

  onIconClick() {
    this.showBotSubject = !this.showBotSubject;
    this.messages=[];
    this.initialLoad = []
  }

  onBotSubjectSubmit() {
    this.showBotSubject = false;
    this.showMessenger = true;
  }
  chooseIssues(selectedItem: string) {
    this.userMsg = selectedItem;
  }
  onMessengerSubmit(event: any) {
    const inputValue = this.msgInput.nativeElement.value.trim();
    if (!this.emailId) {
      this.emailId = inputValue.trim(); 

    }
    this.userMsg = '';
    // let student = JSON.parse(localStorage.getItem('user_data')!)?.user?.name;
    // let studentId = JSON.parse(localStorage.getItem('user_data')!)?.user?.id;
    const val = this.msgInput.nativeElement.value.toLowerCase();
    this.mainval = this.msgInput.nativeElement.value;
    
    const userMsg = {
      type: 'user',
      role: this.emailId, 
      text: this.mainval,
      status: 'open',
    };

    const appendMsg = (msg: string) => {
      this.messages.push({ type: 'bot', text: msg });
      this.msgInput.nativeElement.value = '';
    };

    this.messages.push(userMsg);
    console.log(this.emailId); // Log the emailId

    if (this.emailId) {
      this.initialLoad = ['Courses', 'Programs','Login','Signup','Others'];
    }
      if (val === 'courses') {
      appendMsg(
        '1.Payment 2.Course registration 3.Course Approval 4.Certificate issue '
      );
    } else if (
      val === 'payment' ||
      val === 'course registration' ||
      val === 'course approval' ||
      val === 'certificate issue'
    ) {
      console.log(val);
      appendMsg('Could you give us some more details on ...?');

      this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
        setTimeout(() => {
          this.sayBye();
        }, 3000);
      });
    } else if (val === 'programs') {
      appendMsg(
        '1.Payment 2.Program registration 3.Program Approval 4.Certificate issue'
      );
      // this.sayBye();
    } else if (
      val === 'payment' ||
      val === 'program registration' ||
      val === 'program approval' ||
      val === 'certificate issue'
    ) {
      appendMsg('Could you give us some more details on ...?');

      this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
        setTimeout(() => {
          this.sayBye();
        }, 3000);
      });
    } else if (val === 'login') {
      console.log(val)
      appendMsg(
        '1.Wait for Admin approval 2.Looks like your login information is incorrect  3.Others Issues'
      );
      this.sayBye();
    } else if (val.includes('wait for admin approval')) {
      appendMsg(
        'Please wait for administrator to approve it .Thank you for your patience...'
      );
      this.sayBye();
    } else if (val.includes('looks like your login information is incorrect')) {
      appendMsg(
        'Please enter correct details which you used while signup.Thank you...'
      );
      this.sayBye();
    } else if (val.includes('other issues')) {
      appendMsg('Could you give us some more details on ...?');
      // this.sayBye();
      this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
        setTimeout(() => {
          this.sayBye();
        }, 3000);
      });
    } else if (val === 'signup') {
      appendMsg('Could you please clarify what you want us to do?');
      // this.sayBye();
      this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
        setTimeout(() => {
          this.sayBye();
        }, 3000);
      });
    } else if (val === 'others') {
      appendMsg('Could you please clarify what you want us to do?');
      // this.sayBye();
      this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
        setTimeout(() => {
          this.sayBye();
        }, 3000);
      });
    }
  }

  sayBye() {
    this.messages.push({
      type: 'bot',
      text: 'We understood your issue .please wait for us to resolve.Thank you for your patience....! ',
    });
    this.messages.push({ type: 'bot', text: 'Have a nice day! :)' });
    console.log(this.messages)
    let payload = {
      messages: this.messages,
    };
    this.courseService.saveChat(payload).subscribe((response) => {
    });
    
  }
}