
import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { environment } from 'environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  
  // private baseUrl = '${this.baseUrl}form/survey';
  private baseUrl = environment.apiEndpointNew

  constructor(private http: HttpClient) {}

  createSurvey(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}form/survey`, data);
    //  console.log('Survey created:', resultss);
    //  return resultss
  }
  createthirdpartySurvey(data: any): Observable<any> {
   return this.http.post<any>(`${this.baseUrl}thirdParty/thirdparty`, data);
  }
 

  getLatestSurvey(companyId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}form/last/${companyId}`);
  }


  getAllSurveys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}form/survey`);
  }
  

  getSurveyById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}form/survey/${id}`);
  }

  convertToTrainee(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}x-api/v1/admin/convert-to-trainee`, data); // Use your actual API endpoint here
  }

  getActiveCompanies(id: string){
    return this.http.get<any[]>(`${this.baseUrl}form/active-companies/${id}`);
  }

  getthirdpartySurvey(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}thirdParty/thirdparty/${id}`);
  }
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}form/current-user`);
  }
  updateSurvey(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}form/survey/${id}`, data);
  }
  
  createUser(data: any) {
    return this.http.post(`${this.baseUrl}x-api/v1/admin/response`, data); 
  }

  getUserRegistration(): Observable<any> {
    return this.http.get(`${this.baseUrl}x-api/v1/admin/responses`);
  }

  deleteSurvey(id: string) {
    return this.http.delete(`${this.baseUrl}form/survey/${id}`);
  }
  
  
}
