import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Logger } from './logger.service';
import { Student, UsersPaginationModel } from '../models/user.model';
// import { CoursePaginationModel } from '../models/course.model';
import { AppConstants } from '@shared/constants/app.constants';
import { ApiResponse } from '@core/models/general.response';
import { environment } from 'environments/environment';
import { CoursePaginationModel } from '@core/models/course.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private currentUserSubject!: BehaviorSubject<any>;
  public currentUser!: Observable<any>;
  defaultUrl = environment['apiUrl'];
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  private buildParams(filter?: Partial<CoursePaginationModel>): HttpParams {
    let params = new HttpParams();
    if (filter) {
      if (filter.sortBy) {
        params = params.set(
          'sortBy',
          `${filter.sortByDirection === 'asc' ? '+' : '-'}${filter.sortBy}`
        );
      }
      if (filter.limit) {
        params = params.set('limit', filter.limit?.toString());
      }
      if (filter.page) {
        params = params.set('page', filter.page?.toString());
      }

      if (filter.filterText) {
        params = params.set('title', filter.filterText?.toString());
      }
      if (filter.status && filter.status === 'active') {
        params = params.set('status', 'active');
      }else if (filter.status && filter.status === 'approved')  {
        params = params.set('status', 'approved')
      }
      if (filter.status && filter.status === 'active') {
        params = params.set('status', 'active');
      } else if (filter.status && filter.status === 'inactive') {
        params = params.set('status', 'inactive');
      }
      if(filter.filterName) {
        params = params.set('name', filter.filterName)
      }
      if(filter.companyId) {
        params = params.set('companyId', filter.companyId)
      }

    }
    return params;
  }

  getQuestionById(Id: any): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl + `admin/assesment/${Id}`;
    return this.http.get<ApiResponse>(apiUrl);
  }

  createQuestion(request: any) {
    const apiUrl = `${this.defaultUrl}admin/assesment`;
    return this.http
      .post<ApiResponse>(apiUrl, request)
      .pipe(map((response) => response));
  }
  updateQuestions(question:any) {
    const apiUrl = `${this.defaultUrl}admin/assesment/${question.id}`;
    return this.http
      .put<ApiResponse>(apiUrl, question)
      .pipe(map((response) => { }));
  }

  updateExamQuestions(question:any) {
    const apiUrl = `${this.defaultUrl}admin/exam-assessment/${question.id}`;
    return this.http
      .put<ApiResponse>(apiUrl, question)
      .pipe(map((response) => { }));
  }
  getQuestionsById(id?: string) {
    const apiUrl = `${this.defaultUrl}admin/assesment/${id}`;
    return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }

  createAnswerQuestion(request: any) {
    const apiUrl = `${this.defaultUrl}admin/exam-assessment`;
    return this.http
      .post<ApiResponse>(apiUrl, request)
      .pipe(map((response) => response));
  }

  getAnswerQuestionById(id?: string) {
    const apiUrl = `${this.defaultUrl}admin/exam-assessment/${id}`;
    return this.http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }

  updateAnswerQuestions(question:any) {
    const apiUrl = `${this.defaultUrl}admin/exam-assessment/${question.id}`;
    return this.http
      .put<ApiResponse>(apiUrl, question)
      .pipe(map((response) => { }));
  }

  getQuestionJson( filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    const apiUrl = `${this.defaultUrl}admin/assesment`;
    return this.http.get<any>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getExamQuestionJson( filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    const apiUrl = `${this.defaultUrl}admin/exam-assessment`;
    return this.http.get<any>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getExamAssessmentsAndAssesments( filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const apiUrl = `${this.defaultUrl}admin/exam-assessment/assessments?companyId=${userId}`;
    return this.http.get<any>(apiUrl, {
      params: this.buildParams(filter),
    });
  }
}
