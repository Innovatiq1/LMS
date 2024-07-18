import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-support-dashboard',
  templateUrl: './support-dashboard.component.html',
  styleUrls: ['./support-dashboard.component.scss']
})
export class SupportDashboardComponent {
  @Input() selectedComponents!: { [key: string]: boolean };
  displayedColumns: string[] = ['name', 'ticket', 'status', 'date'];
}
