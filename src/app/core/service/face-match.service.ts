import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class FaceMatchService {
      private prefix: string = environment.apiUrl;
        constructor(private _Http : HttpClient) {
      
        }
    
      checkFaceMatch(payload:any):Observable<any> {
        const apiUrl = `${this.prefix}analyzer/face-match`;
        return this._Http.post<any>(apiUrl, payload).pipe(map((response) => response));
      }
}