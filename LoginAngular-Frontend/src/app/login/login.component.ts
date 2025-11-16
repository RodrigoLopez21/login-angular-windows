import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit{

  email: string = '';
  password: string = '';
  code: string = '';
  loading: boolean = false;
  twoFactorRequired: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _userService:  UserService,
    private router: Router,
    private _errorService: ErrorService
  ){}

  ngOnInit(): void {}
  login(){
    if (this.email == '' || this.password == '') {
      this.toastr.error('Todos los campos son obligatorios!', 'Error');
      return
    }

    //CREAMOS EL OBJETO
    const user: User = {
      email: this.email,
      password: this.password
    }
    this.loading =  true

    this._userService.login(user).subscribe({
      next: (response: any) => {
        this.loading =  false;
        if (response.twoFactorRequired) {
          this.twoFactorRequired = true;
          this.toastr.info('Se ha enviado un código de verificación a su correo.');
        } else {
          const token = response.token;
          this.toastr.success("", "Bienvenido");
          localStorage.setItem('myToken',token);
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (e: HttpErrorResponse) => {
        this.loading =  false
        this._errorService.msgError(e)
      },
    })   
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
        this.toastr.success("", "Bienvenido");
        localStorage.setItem('myToken', token);
        this.router.navigate(['/user/dashboard']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msgError(e);
      }
    });
  }

}
