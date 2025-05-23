import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.scss'],
})
export class TestPreviewComponent {
  questionList: any[] = [];
  totalTime: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  optionsLabel: string[] = ['a)', 'b)', 'c)', 'd)'];
  constructor(
    public dialogRef: MatDialogRef<TestPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("daaaa",data)
    this.questionList = data?.questions || [];
    if (data.timer) {
      this.totalTime = this.questionList.length * data.timer;
      this.minutes = Math.floor(this.totalTime / 60);
      this.seconds = this.totalTime % 60;
    }
  }
  closeModal() {
    this.dialogRef.close();
  }
}
