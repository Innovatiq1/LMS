import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TwoFactorAuthService {
  private apiUrl = 'http://uatskillera.innovatiqconsulting.com/api';

  constructor(private http: HttpClient) {}

  setup2FA(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/fasetup`, { email });
  }

  verifyOTP(token: string, secret: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/faverify`, { token, secret });
  }
}
