import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.scss']
})
export class TermsDialogComponent {
  constructor(public dialogRef: MatDialogRef<TermsDialogComponent>) {
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
