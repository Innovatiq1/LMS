import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  private records: any[] = [];

  setRecords(records: any[]) {
    this.records = records;
  }

  getRecords() {
    return this.records;
  }

  clearRecords() {
    this.records = [];
  }
}