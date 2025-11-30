import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  email: string = '';
  password: string = '';
  code: string = '';
  loading: boolean = false;
  twoFactorRequired: boolean = false;
  recaptchaToken: string = '';
  siteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Google test key
  recaptchaWidgetId: any = null;

  constructor(
    private toastr: ToastrService,
    private _userService:  UserService,
    private router: Router,
    private _errorService: ErrorService,
    private authService: AuthService
  ){}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Renderizar el widget de reCAPTCHA cuando la vista esté lista
    this.renderRecaptcha();
  }

  renderRecaptcha() {
    if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
      try {
        const container = document.getElementById('recaptcha-container');
        if (container && !this.recaptchaWidgetId) {
          this.recaptchaWidgetId = grecaptcha.render('recaptcha-container', {
            'sitekey': this.siteKey,
            'callback': (token: string) => {
              this.recaptchaToken = token;
            },
            'expired-callback': () => {
              this.recaptchaToken = '';
            }
          });
        }
      } catch (error) {
        console.error('Error rendering reCAPTCHA:', error);
        // Si falla, intentar de nuevo después de un delay
        setTimeout(() => this.renderRecaptcha(), 500);
      }
    } else {
      // Si grecaptcha no está listo, esperar y reintentar
      setTimeout(() => this.renderRecaptcha(), 500);
    }
  }
  
  onRecaptchaResolved(token: string) {
    this.recaptchaToken = token;
  }

  login(){
    if (this.email == '' || this.password == '') {
      this.toastr.error('Todos los campos son obligatorios!', 'Error');
      return
    }

    // Validar reCAPTCHA
    if (!this.recaptchaToken) {
      this.toastr.error('Por favor, complete el reCAPTCHA', 'Error');
      return;
    }

    const user: User = {
      email: this.email,
      password: this.password
    }
    this.loading =  true

    this._userService.login(user, this.recaptchaToken).subscribe({
      next: (response: any) => {
        this.loading =  false;
        // Resetear reCAPTCHA después de envío exitoso
        this.resetRecaptcha();
        if (response.twoFactorRequired) {
          this.twoFactorRequired = true;
          this.toastr.info('Se ha enviado un código de verificación a su correo.');
        } else {
            const token = response.token;
            const loginHistoryId = response.loginHistoryId;
            this.toastr.success("", "Bienvenido");
            localStorage.setItem('myToken',token);
            if (loginHistoryId) localStorage.setItem('loginHistoryId', String(loginHistoryId));
          let rid = this.authService.getRoleFromToken();
          if (rid == null) {
            // fallback: ask backend for role (older flow)
            this._userService.getRole().subscribe({
              next: (r: any) => {
                const backendRid = Number(r.Rid);
                if (backendRid === 1) this.router.navigate(['/admin/dashboard']);
                else this.router.navigate(['/user/dashboard']);
              },
              error: () => this.router.navigate(['/user/dashboard'])
            });
          } else {
            if (rid === 1) this.router.navigate(['/admin/dashboard']);
            else this.router.navigate(['/user/dashboard']);
          }
        }
      },
      error: (e: HttpErrorResponse) => {
        this.loading =  false
        this.resetRecaptcha();
        this._errorService.msgError(e)
      },
    })   
  }

  resetRecaptcha() {
    this.recaptchaToken = '';
    if (typeof grecaptcha !== 'undefined' && this.recaptchaWidgetId !== null) {
      try {
        grecaptcha.reset(this.recaptchaWidgetId);
      } catch (error) {
        console.error('Error resetting reCAPTCHA:', error);
      }
    }
  }

  verifyCode() {
    if (this.code == '') {
      this.toastr.error('El código es obligatorio!', 'Error');
      return;
    }
    this.loading = true;
    this._userService.loginVerify(this.email, this.code).subscribe({
      next: (response: any) => {
        this.loading = false;
        const token = response.token;
        const loginHistoryId = response.loginHistoryId;
        this.toastr.success("", "Bienvenido");
        localStorage.setItem('myToken', token);
        if (loginHistoryId) localStorage.setItem('loginHistoryId', String(loginHistoryId));
        let rid = this.authService.getRoleFromToken();
        if (rid == null) {
          this._userService.getRole().subscribe({
            next: (r: any) => {
              const backendRid = Number(r.Rid);
              if (backendRid === 1) this.router.navigate(['/admin/dashboard']);
              else this.router.navigate(['/user/dashboard']);
            },
            error: () => this.router.navigate(['/user/dashboard'])
          });
        } else {
          if (rid === 1) this.router.navigate(['/admin/dashboard']);
          else this.router.navigate(['/user/dashboard']);
        }
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msgError(e);
      }
    });
  }

}
