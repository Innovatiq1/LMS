import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment.development';

@Component({
  selector: 'app-thrid-party-form',
  templateUrl: './thrid-party-form.component.html',
  styleUrls: ['./thrid-party-form.component.scss']
})
export class ThridPartyFormComponent {
  surveyId!: string;
  surveyData: any;
private apiUrl = environment.apiEndpointNew;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  ngOnInit() {
    // this.surveyId = this.route.snapshot.paramMap.get('surveyId')!;
  this.route.queryParams.subscribe((params: any) => {
    this.surveyId = params['surveyId'];
  })
    this.http.get(`${this.apiUrl}thirdParty/url/${this.surveyId}`)
      .subscribe((res: any) => {
        this.surveyData = res;
      });
  }

  submitForm(form: NgForm) {
    console.log('Submitted:', form.value);
  }
}
