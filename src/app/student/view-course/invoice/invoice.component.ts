import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  isDiscount:boolean = false;
  isDiscounttypeValue:boolean = false;
  dicountValueType:number = 0;
  constructor(
    public dialogRef: MatDialogRef<InvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    
  ) {
    console.log('invoice',this.data);

    if(this.data.discountType)
    {
      this.isDiscount = true;
    }else{
      
      this.isDiscounttypeValue = true;
    }

    this.dicountValueType = this.data.discountValue; 
  }

  submit() {
      let discountedValue: number;
      let totalValue: number;
  
      if (this.data.discountType === 'fixed') {
        discountedValue = this.data.discountValue;
        totalValue = this.data.courseFee - discountedValue;
        this.data.discountedValue = discountedValue
        this.data.totalValue = totalValue

      } else if (this.data.discountType === 'percentage') {
        discountedValue = (this.data.courseFee * this.data.discountValue) / 100;
        totalValue = this.data.courseFee - discountedValue;
        this.data.discountedValue = discountedValue
        this.data.totalValue = totalValue
      }else 
      {
        discountedValue = this.data.discountValue;
        totalValue = this.data.courseFee - discountedValue;
        this.data.discountedValue = discountedValue
        this.data.totalValue = totalValue
      }
      this.dialogRef.close(this.data); 

  
    }
  }

