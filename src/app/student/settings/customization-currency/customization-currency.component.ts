import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from '@core/service/course.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { StudentsService } from 'app/admin/students/students.service';


@Component({
  selector: 'app-customization-currency',
  templateUrl: './customization-currency.component.html',
  styleUrls: ['./customization-currency.component.scss']
})
export class CustomizationCurrencyComponent {
  breadscrums = [
    {
      title: 'Customization',
      items: ['Configuration'],
      active: 'Currency',
    },
  ];
  currencyCodes: string[] = ['USD', 'SGD', 'NZD', 'YEN', 'GBP', 'KWN', 'IDR', 'TWD', 'MYR', 'AUD'];

  selectedCurrency: string = "";
  dialogRef: any;
  studentId: any;
  configuration: any;
  configurationSubscription!: Subscription;
  defaultCurrency: string = '';
 
  constructor(
    
    private courseService: CourseService,
    public dialog: MatDialog,
    private studentsService: StudentsService,
  ){}

  ngOnInit(): void { 
    this.getCurrency();
    this.loadData();
   }

   loadData(){
    this.studentId = localStorage.getItem('id')
    this.studentsService.getStudentById(this.studentId).subscribe(res => {
    })
  }
  
  getCurrency() : any {
    this.configurationSubscription = this.studentsService.configuration$.subscribe(configuration => {
      this.configuration = configuration;
      const config = this.configuration.find((v:any)=>v.field === 'currency')
      if (config) {
        this.defaultCurrency = config.value;
        this.selectedCurrency = this.defaultCurrency
      }
    });
  }

  updateCurrency() {
    const selectedCurrency = this.selectedCurrency;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to update this Currency!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        let userId = localStorage.getItem('id');    
    this.courseService.createCurrency({ value: selectedCurrency,adminId:userId }).subscribe(
      response => {
        Swal.fire({
          title: 'Successful',
          text: 'Currency Configuration Success',
          icon: 'success'
        });
        // dialogRef.close(selectedCurrency);
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
      }
    );
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CustomizationCurrencyComponent, {
      width: '500px',
      data: { selectedCurrency: this.selectedCurrency }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result: ', result);

        this.selectedCurrency = result;
      }
    });
  }
  
}