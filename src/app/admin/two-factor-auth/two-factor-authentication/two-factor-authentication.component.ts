import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwoFactorAuthService } from '@core/service/twoFactorAuth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.scss'],
})
export class TwoFactorAuthenticationComponent implements OnInit {
  qrCode!: string;
  secret!: string;
  otp1!: string;
  otp2!: string;
  otp3!: string;
  otp4!: string;
  otp5!: string;
  otp6!: string;
  message!: string;
  email!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private twoFactorAuthService: TwoFactorAuthService
  ) {}

  ngOnInit() {
    if (history.state && history.state.qrCode) {
      this.qrCode = history.state.qrCode.startsWith('data:image/png;base64,')
        ? history.state.qrCode
        : `data:image/png;base64,${history.state.qrCode}`;
      this.secret = history.state.secret;
    } else {
      this.router.navigate(['/dashboard/dashboard']);
    }
  }
  moveToNext(event: Event, nextField: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 1 && nextField) {
      nextField.focus();
    }
  }
  verifyOTP() {
    const otp = `${this.otp1}${this.otp2}${this.otp3}${this.otp4}${this.otp5}${this.otp6}`;
    this.twoFactorAuthService.verifyOTP(otp, this.secret).subscribe(
      (response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: '2FA Verified Successfully!',
            confirmButtonText: 'OK',
          }).then(() => {
            this.router.navigate(['/dashboard/dashboard']);
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Verification Failed',
            text: 'Invalid OTP. Please try again.',
            confirmButtonText: 'OK',
          });
        }
      },
      (error) => {
        console.error('Error verifying OTP:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error verifying OTP.',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
