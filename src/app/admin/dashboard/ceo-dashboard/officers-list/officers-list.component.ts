import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-officers-list',
  templateUrl: './officers-list.component.html',
  styleUrls: ['./officers-list.component.scss']
})
export class OfficersListComponent {
  officers:any;
displayedColumns: string[] = [
  // 'select',
  'img',
  'Name',
  'User Type',
  'gender',
  'department',
  'Status',
  // 'Actions'
];
breadscrums = [
  {
    title: 'All User',
    items: ['Dashboard'],
    active: 'Staff',
  },
];
isLoading = true;

constructor(private route:ActivatedRoute){

}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params =>{
    this.officers = params['managers'] ? JSON.parse(params['managers']) : null;
  });
  if (this.officers.length !== 0) {
    this.isLoading = false;
  }
  }
}
