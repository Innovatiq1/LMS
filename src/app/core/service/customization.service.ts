// form.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from "environments/environment";


@Injectable({
  providedIn: 'root'
})
export class FormService {
    private prefix: string = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getAllForms(id:any,name?:String): Observable<any[]> {
    const apiUrl = `${this.prefix}admin/forms?companyId=${id}`+(name? `&name=${name}`:'');

    return this.http.get<any>(apiUrl).pipe(map((response) => response));
  }


  updateLabelStatus(companyId:any,formId: string, labelName: string, checked: boolean): Observable<any> {
    return this.http.put<any>(`${this.prefix}admin/forms/${formId}`, { companyId,labelName, checked });
  }
}
