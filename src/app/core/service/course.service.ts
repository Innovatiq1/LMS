
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, map } from "rxjs";
import { ApiResponse } from "@core/models/response";
import { environment } from "environments/environment";
import { CourseKit, CourseModel, CoursePaginationModel, Discount, Program, Vendor } from "@core/models/course.model";
import { FundingGrant, Instructor, MainCategory, SubCategory, Survey } from "@core/models/course.model";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  
  private apiUrl = 'http://localhost:3000/api/';
  private prefix: string = environment.apiUrl;
  private razorpayKeyId :string= "rzp_test_8qBZzDxmgGwhH4";
  // private razorpaySecretKey :string= environment.RAZORPAY_SECRET_KEY

  defaultUrl = environment['apiUrl'];
  dataChange: BehaviorSubject<CourseModel[]> = new BehaviorSubject<CourseModel[]>([]);

  constructor(private _Http : HttpClient,    @Inject(PLATFORM_ID) private platformId: object
) {

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
      if (filter.main_category && +filter.main_category !== 0) {
        params = params.set("main_category", filter.main_category);
      }
      if (filter.sub_category && +filter.sub_category !== 0) {
        params = params.set("sub_category", filter.sub_category);
      }
      if (filter.filterText) {
        params = params.set("title", filter.filterText?.toString());
      }
      if (filter.feeType) {
        params = params.set("feeType", filter.feeType);
      }
      if (filter.status && filter.status === "active") {
        params = params.set("status", "active");
      } else if (filter.status && filter.status === "inactive") {
        params = params.set("status", "inactive");
      }
    }
    return params;
  }


  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {
      return this._window();
    }
  }

  _window(): any {
    return window;
  }

  
  createOrder(payload:any) {
    const apiUrl = `${this.prefix}admin/studentClasses/order/createPaymentOrder`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }


  verifyPaymentSignature(checkoutResponse: any, original_order_id: string) {
    const payload = {
      razorpay_signature: checkoutResponse.razorpay_signature,
      original_order_id: original_order_id,
      razorpay_payment_id: checkoutResponse.razorpay_payment_id,
    };

    return this._Http.post(`${this.prefix}admin/studentClasses/payment/validatePayment`, {
      payload,
    });
  }




  saveVideoPlayTime(payload:any) {
    const apiUrl = `${this.prefix}admin/video-played`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }
  getVideoPlayedById(studentId:any,classId: any,videoId:any) {
    const apiUrl = `${this.prefix}admin/video-played/${studentId}/${classId}/${videoId}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }

  getCourseVideoPlayedById(studentId:any,courseId: any,videoId:any) {
    const apiUrl = `${this.prefix}admin/video-played/${studentId}/${courseId}/${videoId}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }


  saveRegisterClass(payload:any,id?:any) {
    const apiUrl = `${this.prefix}admin/studentClasses?adminId=${id}`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }

  registerProgramClass(payload:any) {
    const apiUrl = `${this.prefix}admin/studentClasses/registerProgram`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }

  getAllCourses(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    let userId = localStorage.getItem('id')
    const apiUrl = `${this.prefix}admin/courses-new?adminId=${userId}`;
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getFilteredCourseData(payload:any, filter:any
    ):Observable<any> {
    const apiUrl = `${this.prefix}admin/courses-new/filter?limit=${filter.limit}&page=${filter.page}`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }

  getCourseProgram(filter?: Partial<Program>): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseprogram`;
    return this._Http
      .get<ApiResponse>(apiUrl, { params: this.buildParams(filter)})
      .pipe(
        map((response) => {
          return response.data
        })
      );
  }

  getFilteredProgramData(payload:any, filter:any
    ):Observable<any> {
    const apiUrl = `${this.prefix}admin/courseprogram/filter?limit=${filter.limit}&page=${filter.page}`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }

  getAllCoursesWithPagination(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    let userId = localStorage.getItem('id')
    const apiUrl = `${this.prefix}admin/courses-new?adminId=${userId}&status=active&status=inactive`;

    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getAllPrograms(filter?: Partial<Program>): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseprogram?status=active&status=inactive`;
    return this._Http
      .get<ApiResponse>(apiUrl, { params: this.buildParams(filter)})
      .pipe(
        map((response) => {
          return response.data
        })
      );
  }

  getPrograms(filter?: Partial<Program>): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseprogram`;
    return this._Http
      .get<ApiResponse>(apiUrl, { params: this.buildParams(filter)})
      .pipe(
        map((response) => {
          return response.data.docs
        })
      );
  }
  getAllProgramsWithoutPagination(filter?: Partial<Program>): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseprogram?status=active&status=inactive`;
    return this._Http
      .get<ApiResponse>(apiUrl, { params: this.buildParams(filter)})
      .pipe(
        map((response) => {
          return response.data.docs
        })
      );
  }


  getCount(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl+'admin/courses-new/count';
    return this._Http.get<ApiResponse>(apiUrl);
  }
  getMainCategories(): Observable<MainCategory[]> {
    const apiUrl = `${this.prefix}admin/main-category/`;
    return this._Http.get<any>(apiUrl).pipe(map((response:any) => response.data.docs));

  }
  getSubCategories(): Observable<SubCategory[]> {
    const apiUrl = `${this.prefix}admin/sub-category/`;
    return this._Http.get<any>(apiUrl).pipe(map((response:any) => response.docs));
  }
  createFundingGrant(payload:any) {
    const apiUrl = `${this.prefix}admin/funding-grant`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }
  updateFundingGrant(id:string,payload:any) {
    const apiUrl = `${this.prefix}admin/funding-grant/${id}`;
    return this._Http.put<any>(apiUrl, payload).pipe(map((response) => response));
  }
  getFundingGrant(): Observable<FundingGrant[]> {
    let userId = localStorage.getItem('id');
    const apiUrl = `${this.prefix}admin/funding-grant?adminId=${userId}`;
    return this._Http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }
  getFundingGrantById(id:string): Observable<FundingGrant[]> {
    const apiUrl = `${this.prefix}admin/funding-grant/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }
  deleteFundingGrant(id: string) {
    const apiUrl = `${this.prefix}admin/funding-grant/${id}`;
    return this._Http
      .delete<FundingGrant[]>(apiUrl)
      .pipe(map((response) => response));
  }
  createVendor(payload:any) {
    const apiUrl = `${this.prefix}admin/vendor`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }
  updateVendor(id:string, payload:any) {
    const apiUrl = `${this.prefix}admin/vendor/${id}`;
    return this._Http.put<any>(apiUrl, payload).pipe(map((response) => response));
  }
  getVendor(): Observable<FundingGrant[]> {
        let userId = localStorage.getItem('id')
    const apiUrl = `${this.prefix}admin/vendor?adminId=${userId}`;
    return this._Http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }
  getVendorById(id:string): Observable<Vendor> {
    const apiUrl = `${this.prefix}admin/vendor/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }
  deleteVendor(id: string) {
    const apiUrl = `${this.prefix}admin/vendor/${id}`;
    return this._Http
      .delete<Vendor>(apiUrl)
      .pipe(map((response) => response));
  }

  createDiscount(payload:any) {
    const apiUrl = `${this.prefix}admin/discount`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }
  updateDiscount(id:string, payload:any) {
    const apiUrl = `${this.prefix}admin/discount/${id}`;
    return this._Http.put<any>(apiUrl, payload).pipe(map((response) => response));
  }
  getDiscount(id:any): Observable<Discount[]> {
   
    const apiUrl = `${this.prefix}admin/discount?adminId=${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }
  getDiscountById(id:string): Observable<Discount> {
    const apiUrl = `${this.prefix}admin/discount/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }
  deleteDiscount(id: string) {
    const apiUrl = `${this.prefix}admin/discount/${id}`;
    return this._Http
      .delete<Discount>(apiUrl)
      .pipe(map((response) => response));
  }


  getSurvey(): Observable<Survey[]> {
    const apiUrl = `${this.prefix}admin/survey/`;
    return this._Http
      .get<any>(apiUrl)
      .pipe(map((response:any) => response.data?.docs));
  }
  getInstructors(): Observable<Instructor[]> {
    const apiUrl = `${this.prefix}admin/instructor/`;
    return this._Http
      .get<any>(apiUrl)
      .pipe(map((response:any) => response.data?.docs));
  }
  getCourseKit(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    let userId = localStorage.getItem('id');
    const apiUrl = `${this.prefix}admin/course-kit?adminId=${userId}`;
    return this._Http
      .get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
      .pipe(
        map((response:any) => {
          return response.data;
        })
      );
  }
  saveCourse(course: any) {
    const apiUrl = `${this.prefix}admin/courses-new/`;
    return this._Http
      .post<ApiResponse>(apiUrl, course)
      .pipe(map((response) => { }));
  }
  getCourseById(id: string) {
    const apiUrl = `${this.prefix}admin/courses-new/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  updateCourse(course:any) {
    const apiUrl = `${this.prefix}admin/courses-new/${course.id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, course)
      .pipe(map((response) => { }));
  }
  deleteCourse(id: string) {
    const apiUrl = `${this.prefix}admin/courses-new/${id}`;
    return this._Http
      .delete<CourseModel>(apiUrl)
      .pipe(map((response) => response));
  }
  getMainCategoriesWithPagination(filter?:Partial<CoursePaginationModel>): Observable<ApiResponse> {
    let userId = localStorage.getItem('id')
    const apiUrl = `${this.prefix}admin/main-category?adminId=${userId}`;
    return this._Http
      .get<ApiResponse>(apiUrl,{
        params: this.buildParams(filter),
      });
  }
  createSubCategory(
    subCategories: Partial<SubCategory>[]
  ): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/sub-category/`;
    return this._Http.post<ApiResponse>(apiUrl, subCategories);
  }
  createMainCategory(mainCategory: MainCategory): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/main-category/`;
    return this._Http.post<ApiResponse>(apiUrl, mainCategory);
  }
  deleteCategory(id: string): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/main-category/${id}`;
    return this._Http.delete<ApiResponse>(apiUrl);
  }
  updateMainCategory(id:any,category:any) {
    const apiUrl = `${this.prefix}admin/main-category/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, category)
      .pipe(map((response) => { }));
  }
  updateSubCategory(id:any,category:any) {
    const apiUrl = `${this.prefix}admin/sub-category/${id}`;
    return this._Http
      .put<ApiResponse>(apiUrl, category)
      .pipe(map((response) => { }));
  }

  deleteSubCategory(id: string): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/sub-category/${id}`;
    return this._Http.delete<ApiResponse>(apiUrl);
  }
  getcategoryById(id: string) {
    const apiUrl = `${this.prefix}admin/main-category/${id}`;
    return this._Http.get<ApiResponse>(apiUrl).pipe(map((response) => response));
  }

  getJobTempletes(): Observable<any>{
    const url = `${this.prefix}admin/job/templates`;
    return this._Http.get(url);
  }
  getVideoById(videoId: string): Observable<any> {
    const apiUrl = `${this.prefix}admin/video/${videoId}`;
    return this._Http.get(apiUrl);
  }
  createCourseKit(courseKit: CourseKit): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/course-kit/`;
    return this._Http.post<ApiResponse>(apiUrl, courseKit);
  }
  uploadVideo(files: File[]): Observable<any> {
    const formData = new FormData();
    for (let file of files) {
      formData.append('Files', file, file.name);
    }
    const apiUrl = `${this.prefix}admin/video/`;
    return this._Http.post(apiUrl, formData);
  }
  getCourseKitById(id?: string) {
    const apiUrl = `${this.prefix}admin/course-kit/${id}`;
    return this._Http.get<CourseKit>(apiUrl).pipe(map((response) => response));
  }
  editCourseKit(
    courseKitId: string,
    courseKit: CourseKit
  ): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/course-kit/${courseKitId}`;
    return this._Http.put<ApiResponse>(apiUrl, courseKit);
  }
  deleteCourseKit(courseKitId: string): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/course-kit/${courseKitId}`;
    return this._Http.delete<ApiResponse>(apiUrl);
  }
  getClassList(courseId: string): Observable<any> {
    const apiUrl = `${this.prefix}admin/class?courseId=${courseId}`;
    return this._Http.get<any>(apiUrl);
  }

  getCourseReports(payload:any
    ):Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses/reports`;
    return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
  }


  getStudentClass( studentId: any,classId:any): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses?classId=${classId}&studentId=${studentId}`;
    return this._Http.get<any>(apiUrl);
  }
  
  getStudentFreeCourse( studentId: any,courseId:any): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses?courseId=${courseId}&studentId=${studentId}`;
    return this._Http.get<any>(apiUrl);
  }

  getStudentClassesByCourseId( courseId: any,studentId:any): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses/student/${courseId}/${studentId}`;
    return this._Http.get<any>(apiUrl);
  }

  getProgramRegisteredClasses(studentId: any,classId:any): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses/studentApproveList?classId=${classId}&studentId=${studentId}`;
    return this._Http.get<any>(apiUrl);
  }
  
  getStudentRegisteredByCourseId(studentId: any,courseId:any): Observable<any> {
    const apiUrl = `${this.prefix}admin/studentClasses/course/${studentId}/${courseId}`;
    return this._Http.get<any>(apiUrl);
  }

  getProgramKitsById(id: any) {
    const apiUrl = `${this.prefix}admin/course-kit/ListProgramCourseKit/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }
  getProgramById(id: any) {
    const apiUrl = `${this.prefix}admin/courseprogram/${id}`;
    return this._Http.get<any>(apiUrl).pipe(map((response) => response));
  }

  deleteProgram(id: string) {
    const apiUrl = `${this.prefix}admin/courseprogram/${id}`;
    return this._Http
      .delete(apiUrl)
      .pipe(map((response) => response));
  }

  createCourseProgram(formData?:any): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseprogram`;
    return this._Http.post<ApiResponse>(apiUrl, formData);
  }
  updateCourseProgram(
    programId: string,
    program: any
  ): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/courseprogram/${programId}`;
    return this._Http.put<ApiResponse>(apiUrl, program);
  }

  getProgramCourseKit(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/course-kit/ListProgramCourseKit`;
    return this._Http
      .get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
      .pipe(
        map((response:any) => {
          return response.data;
        })
      );
  }
  uploadProgramVideo(files: File[]): Observable<any> {
    const formData = new FormData();
    for (let file of files) {
      formData.append('Files', file, file.name);
    }
    const apiUrl = `${this.prefix}admin/video/uploadProgram`;
    return this._Http.post(apiUrl, formData);
  }
  createProgramCourseKit(courseKit: CourseKit): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/course-kit/CreateProgramCourseKit`;
    return this._Http.post<ApiResponse>(apiUrl, courseKit);
  }
  deleteProgramCourseKit(courseKitId: string): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/course-kit/deletedProgramCourseKit/${courseKitId}`;
    return this._Http.delete<ApiResponse>(apiUrl);
  }
  editProgramCourseKit(
    courseKitId: string,
    courseKit: CourseKit
  ): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/course-kit/updateProgramCourseKit/${courseKitId}`;
    return this._Http.put<ApiResponse>(apiUrl, courseKit);
  }
  getUploadedVideos(): Observable<any> {
    const url = `${this.prefix}admin/video/`;
    return this._Http.get(url);
  }
  convertMediaAws(currentVideoId: string, jobTemplateName: string): Observable<any> {
    const url = `${this.prefix}admin/video/convert/${currentVideoId}`;
    const payload = {
      jobTemplateName
    };
    return this._Http.post(url, payload);
  }
  getAllPayments(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl+'paymentHistory/userPaymentHistory';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }
  getAllProgramsPayments(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl+'paymentHistory/programsPaymentHistory';
    return this._Http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getAllPaymentsById(Id:any
  ): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl+`paymentHistory/userPaymentHistory/${Id}`;
    return this._Http.get<ApiResponse>(apiUrl);
  }
  getAllProgramsPaymentsById(Id:any
    ): Observable<ApiResponse> {
      const apiUrl = this.defaultUrl+`paymentHistory/programsPaymentHistory/${Id}`;
      return this._Http.get<ApiResponse>(apiUrl);
    }
    getAllChats(
      filter?: Partial<any>
    ): Observable<ApiResponse> {
      const apiUrl = this.defaultUrl + 'admin/chatbot';
      return this._Http.get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      });
    }
  
    getChatById(Id: any
    ): Observable<ApiResponse> {
      const apiUrl = this.defaultUrl + `admin/chatbot/${Id}`;
      return this._Http.get<ApiResponse>(apiUrl);
    }
  
    saveChat(payload: any) {
      const apiUrl = `${this.prefix}admin/chatbot`;
      return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
    }
 

    uploadCourseThumbnail(file:any) {
      const apiUrl = `${this.defaultUrl}admin/thumbnail/`;
      return this._Http.post<any>(apiUrl, file).pipe(
        map((response) => {
          return response
        })
      );
    }
  
    saveVideo(payload: any){
      const apiUrl = `${this.prefix}uploadVideo/`;
      return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
    }


    updateVideo(id:string,payload: any){
        const apiUrl = `${this.prefix}uploadVideo/${id}`;
        return this._Http.put<ApiResponse>(apiUrl, payload);
      }

    getAllCourseKit(
      filter?: Partial<any>
    ): Observable<ApiResponse> {
      const apiUrl = `${this.prefix}uploadVideo/`;
      return this._Http.get<ApiResponse>(apiUrl, {
        params: this.buildParams(filter),
      });
    }

      getCoursekitVideoById(id: any) {
        const apiUrl = `${this.prefix}uploadVideo/${id}`;
        return this._Http.get<any>(apiUrl).pipe(map((response) => response));
      }
      createCurrency(currencyData: any): Observable<any> {
        const apiUrl = `${this.prefix}admin/configuration/currency`;
        return this._Http.put<any>(apiUrl, currencyData).pipe(map((response) => response));
      }
      createTimer(currencyData: any): Observable<any> {
        const apiUrl = `${this.prefix}admin/configuration/timer`;
        return this._Http.put<any>(apiUrl, currencyData).pipe(map((response) => response));
      }
      createExamTimer(currencyData: any): Observable<any> {
        const apiUrl = `${this.prefix}admin/configuration/examTimer`;
        return this._Http.put<any>(apiUrl, currencyData).pipe(map((response) => response));
      }
      createAssessment(currencyData: any): Observable<any> {
        const apiUrl = `${this.prefix}admin/configuration/assessment`;
        return this._Http.put<any>(apiUrl, currencyData).pipe(map((response) => response));
      }
      createExamAssessment(currencyData: any): Observable<any> {
        const apiUrl = `${this.prefix}admin/configuration/examAssessment`;
        return this._Http.put<any>(apiUrl, currencyData).pipe(map((response) => response));
      }
      createAssessmentAlgorithm(currencyData: any): Observable<any> {
        const apiUrl = `${this.prefix}admin/configuration/assessmentAlgorithm`;
        return this._Http.put<any>(apiUrl, currencyData).pipe(map((response) => response));
      }
      createExamAlgorithm(currencyData: any): Observable<any> {
        const apiUrl = `${this.prefix}admin/configuration/examAlgorithm`;
        return this._Http.put<any>(apiUrl, currencyData).pipe(map((response) => response));
      }
      getStudentClassById(id?: string) {
        const apiUrl = `${this.prefix}admin/studentClasses/${id}`;
        return this._Http.get<any>(apiUrl).pipe(map((response) => response));
      }
      getStudentProgramClassById(id?: string) {
        const apiUrl = `${this.prefix}admin/studentClasses/programs/${id}`;
        return this._Http.get<any>(apiUrl).pipe(map((response) => response));
      }
      getUserById(id: string) {
        const apiUrl = `${this.prefix}auth/instructorListByID/${id}`;
        return this._Http.get<any>(apiUrl).pipe(map((response) => response));
      }
     
      deleteUser(userId: string): Observable<ApiResponse> {
        const apiUrl = `${this.prefix}auth/instructorDelete/${userId}`;
        return this._Http.delete<ApiResponse>(apiUrl);
      }

      saveReport(formData:any): Observable<ApiResponse> {
        const apiUrl = `${this.prefix}admin/reports`;
        return this._Http.post<ApiResponse>(apiUrl, formData);
      }

      getAllSavedReports(
        filter?: Partial<any>
      ): Observable<ApiResponse> {
        const apiUrl = `${this.prefix}admin/reports`;
        return this._Http.get<ApiResponse>(apiUrl, {
          params: this.buildParams(filter),
        });
      }
      getStudentsByCourseId(courseId: any) {
        const apiUrl = `${this.prefix}admin/studentClasses/studentcourses/${courseId}`;
        return this._Http.get<any>(apiUrl).pipe(map((response) => response));
      }
    
}



