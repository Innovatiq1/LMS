
import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  
  private baseUrl = 'http://localhost:3001/form/survey';

  constructor(private http: HttpClient) {}

  createSurvey(data: any): Observable<any> {
    console.log('Creating survey with data:', data);
    console.log('API URL:', this.baseUrl);
    return this.http.post<any>(`${this.baseUrl}`, data);
    //  console.log('Survey created:', resultss);
    //  return resultss
  }
  createthirdpartySurvey(data: any): Observable<any> {
    console.log('Creating survey with data:', data);  
   return this.http.post<any>('http://localhost:3001/thirdParty/thirdparty', data);
  }
 
  getLatestSurvey() {
    console.log('fetching with data:');

    return this.http.get<any>('http://localhost:3001/form/last');
  }

  getAllSurveys(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3001/form/survey');
  }
  

  getSurveyById(id: string): Observable<any> {
    return this.http.get(`http://localhost:3001/form/survey/${id}`);
  }

  convertToTrainee(data: any): Observable<any> {
    return this.http.post('http://localhost:3001/x-api/v1/admin/convert-to-trainee', data); // Use your actual API endpoint here
  }

  getActiveCompanies(){
    return this.http.get<any[]>('http://localhost:3001/form/active-companies');
  }

  getthirdpartySurvey(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3001/thirdParty/thirdparty/${id}`);
  }
  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:3001/form/current-user');
  }
  updateSurvey(id: string, data: any): Observable<any> {
    return this.http.put(`http://localhost:3001/form/survey/${id}`, data);
  }
  
  createUser(data: any) {
    return this.http.post('http://localhost:3001/x-api/v1/admin/response', data); 
  }

  getUserRegistration(): Observable<any> {
    return this.http.get(`http://localhost:3001/x-api/v1/admin/responses`);
  }

  deleteSurvey(id: string) {
    return this.http.delete(`http://localhost:3001/form/survey/${id}`);
  }
  
  
}
