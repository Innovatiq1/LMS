import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trainer-analytics-dashboard',
  templateUrl: './trainer-analytics-dashboard.component.html',
  styleUrls: ['./trainer-analytics-dashboard.component.scss']
})
export class TrainerAnalyticsDashboardComponent {
  @Input() selectedComponents!: { [key: string]: boolean };
}
