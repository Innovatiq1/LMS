import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { searchData } from '@core/models/class.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})
export class ScheduleMeetingComponent {

  constructor(
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private classService: ClassService,
  ){}

  ngOnInit(): void {
    //  this.route.queryParams.subscribe((params) => {
    //    const code = params['code'];
    //    if (code) {
    //     this.classService.getZoomToken(code).subscribe((job) => {
    //     });
    //    }
    //  });
  }
  searchForm:FormGroup =this.builder.group({
    date:['', Validators.required],
    time:['', Validators.required],
    topic:['', Validators.required],
    duration:['', Validators.required]
  });
  submitSearch(){
     if(this.searchForm.invalid){
       this.showErrors();
     }else{
      const searchData:searchData ={
            date:this.searchForm.get('date')?.value,
         time:this.searchForm.get('time')?.value,
         topic:this.searchForm.get('topic')?.value,
         duration:this.searchForm.get('duration')?.value
       };
       this.classService.scheduleZoomMeeting(searchData).subscribe({
        next:(response)=>{
           this.snackBar.open('Zoom application successful', 'Close', {
             duration: 3000,
             verticalPosition: 'top',
             horizontalPosition: 'right', // Snackbar position
          });
           //this.router.navigate(['/admin-dashboard']); // Navigate to home page after successful application
         },
         error:(error)=>{
           console.error(error);
           this.snackBar.open('Failed to apply Zoom', 'Close', {
             duration: 3000,
             verticalPosition: 'top',
             horizontalPosition: 'right', // Snackbar position
           });
         }
       })
     }
  }

  showErrors() {
    const controlOrder = ['date', 'time','topic']; // Order of controls
    const controlLabels: { [key: string]: string } = {
      date: 'Date',
      time: 'Time',
      topic:'Title'
    };
    for (const name of controlOrder) {
      const control = this.searchForm.get(name);

      if (control && control.invalid) {
        if (control.errors?.['required']) {
          const label = controlLabels[name] || name; // Use label or fallback to the control name
          this.snackBar.open(`${label} is required`, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right', // Snackbar position
          });
        }
        break; // Stop after showing the first error
      }
    }
  }
}

