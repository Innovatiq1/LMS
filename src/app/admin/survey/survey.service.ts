import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { environment } from 'environments/environment';
import { SurveyBuilderModel } from './survey.model';
import { ApiResponse } from '@core/models/response';
import { Logger } from '@core/service/logger.service';
import { CoursePaginationModel } from '@core/models/course.model';

const Logging = new Logger('SurveyService');

@Injectable({
  providedIn: 'root'
})
export class SurveyService extends UnsubscribeOnDestroyAdapter {
  private prefix: string = environment["apiUrl"];
  isTblLoading = true;
  dataChange: BehaviorSubject<SurveyBuilderModel[]> = new BehaviorSubject<SurveyBuilderModel[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: SurveyBuilderModel;
  constructor(private httpClient: HttpClient) {
    super();
  }

  private buildParams(filter?: Partial<CoursePaginationModel>): HttpParams {
    let params = new HttpParams();
    if (filter) {
      if (filter.sortBy) {
        params = params.set(
          "sortBy",
          `${filter.sortByDirection === "asc" ? "+" : "-"}${filter.sortBy}`
        );
      }
      if (filter.limit) {
        params = params.set("limit", filter.limit?.toString());
      }
      if (filter.page) {
        params = params.set("page", filter.page?.toString());
      }
      if (filter.filterText) {
        params = params.set("title", filter.filterText?.toString());
      }
      if (filter.status && filter.status === "active") {
        params = params.set("status", "active");
      } else if (filter.status && filter.status === "inactive") {
        params = params.set("status", "inactive");
      }
    }
    return params;
  }
  get data(): SurveyBuilderModel[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }


  getAllSurvey(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const apiUrl = `${this.prefix}admin/survey-builder?companyId=${userId}`;
    this.subs.sink = this.httpClient.get<SurveyBuilderModel>(apiUrl).subscribe({
      next: (response) => {
        this.isTblLoading = false;
        this.dataChange.next(response.data.docs);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
      },
    });
  }
  getSurveyList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const apiUrl = `${this.prefix}admin/survey-builder?companyId=${userId}`;
        return this.httpClient
        .get<ApiResponse>(apiUrl, {
          params: {}
        })
        .pipe(map((response) => response));
  }
  addSurveyBuilder(formData:any): Observable<any> {
    return this.httpClient.post<ApiResponse>(`${this.prefix}admin/survey-builder`, formData).pipe(map((response) => {
      return response.data;
    }));
  }
  updateSurveyBuilders(data: FormData, sId:any): Observable<any> {
    return this.httpClient.put<ApiResponse>(`${this.prefix}admin/survey-builder/${sId}`, data).pipe(map(response => {
      Logging.debug(response.data);
      return response.data;
    }));
  }

  deleteSurveyBuilders(sId:any): Observable<any> {
    const apiUrl = `${this.prefix}admin/survey-builder/${sId}`;
    return this.httpClient.delete<ApiResponse>(apiUrl);
  }

  getSurveyBuildersById(surveyBuilderId:any): Observable<any> {
    const apiUrl = `${this.prefix}admin/survey-builder/${surveyBuilderId}`;
    return this.httpClient
      .get<ApiResponse>(apiUrl, {
        params: {}
      })
      .pipe(map((response) => response));
  }
  getSurvey( filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const apiUrl = `${this.prefix}admin/survey?companyId=${userId}`;
    return this.httpClient.get<any>(apiUrl, {
      params: this.buildParams(filter),
    });
  }
  createSurveyQuestions(request: any) {
    const apiUrl = `${this.prefix}admin/survey`;
    return this.httpClient
      .post<ApiResponse>(apiUrl, request)
      .pipe(map((response) => response));
  }
  getSurveyQuestionsById(id?: string) {
    const apiUrl = `${this.prefix}admin/survey/${id}`;
    return this.httpClient.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }
  updateSurveyQuestions(question:any) {
    const apiUrl = `${this.prefix}admin/survey/${question.id}`;
    return this.httpClient
      .put<ApiResponse>(apiUrl, question)
      .pipe(map((response) => { }));
  }
  deleteSurveyQuestions(questionId:string) {
    const apiUrl = `${this.prefix}admin/survey/${questionId}`;
    return this.httpClient
      .delete<ApiResponse>(apiUrl)
      .pipe(map((response) => { }));
  }
  // getSurveyBuilders(filter?: Partial<SurveyBuilderPaginationModel>): Observable<ApiResponse> {
  //   const apiUrl = this.defaultUrl + `admin/survey-builder`;
  //   return this.http
  //     .get<ApiResponse>(apiUrl, {
  //       params: this.buildParams(filter)
  //     })
  // }
}
