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
    if (!this.showBotSubject) {
      this.messages=[];
      this.initialLoad = [];
      this.emailId = '';
      this.mainval = '';
      this.userMsg = '';
      this.email = false;
      this.msgInput.nativeElement.value = '';
    }
    
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
    };

    const appendMsg = (msg: string) => {
      this.messages.push({ type: 'bot', text: msg });
      this.msgInput.nativeElement.value = '';
    };
    this.messages.push(userMsg);
    console.log(this.emailId); 

    if (this.emailId) {
      this.initialLoad = ['Courses', 'Programs','Login','Signup','Others'];
    }
    if(this.initialLoad){
      switch (val) {
        case 'courses':
          appendMsg('1.Payment 2.Course registration 3.Course Approval 4.Certificate issue');
          break;
    
        case 'payment':
        case 'course registration':
        case 'course approval':
        case 'certificate issue':
          appendMsg('Could you give us some more details on ...?');
          this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
            this.handleMsgSubmit();
          });
          break;
    
        case 'programs':
          appendMsg('1.Payment 2.Program registration 3.Program Approval 4.Certificate issue');
          break;
    
        case 'program registration':
        case 'program approval':
          appendMsg('Could you give us some more details on ...?');
          this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
            this.handleMsgSubmit();
          });
          break;
    
        case 'login':
          appendMsg('1.Wait for Admin approval 2.Looks like your login information is incorrect 3.Other Issues');
          break;
    
        case 'wait for admin approval':
          appendMsg('Please wait for administrator to approve it. Thank you for your patience...');
          // this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
            this.handleMsgSubmit();
          // });
          break;
    
        case 'looks like your login information is incorrect':
          appendMsg('Please enter correct details which you used while signing up. Thank you...');
          // this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
            this.handleMsgSubmit();
          // });
          break;
    
        case 'other issues':
          appendMsg('Could you give us some more details on ...?');
          this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
            this.handleMsgSubmit();
          });
          break;
    
        case 'signup':
        case 'others':
          appendMsg('Could you please clarify what you want us to do?');
          this.msgSubmit.nativeElement.addEventListener('click', (event: any) => {
          this.handleMsgSubmit();
        });
          break;
    
        // default:
        //   appendMsg('Sorry, I didn’t understand your request.');
        //   break;
      }
    }
   
  }
  private handleMsgSubmit() {
    console.log('handlecalled')
      setTimeout(() => {
        this.sayBye();
      }, 3000);
  
  }
  
  sayBye() {
    console.log('handlecalled')
    this.messages.push({
      type: 'bot',
      text: 'We understood your issue .please wait for us to resolve.Thank you for your patience....! ',
    });
    this.messages.push({ type: 'bot', text: 'Have a nice day! :)' });
    console.log(this.messages)
    let payload = {
      messages: this.messages,
      status:'open'
    };
    this.courseService.saveChat(payload).subscribe((response) => {
    });
    
  }
}