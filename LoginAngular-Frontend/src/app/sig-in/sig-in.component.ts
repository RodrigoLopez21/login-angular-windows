import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sig-in',
  templateUrl: './sig-in.component.html',
  styleUrls: ['./sig-in.component.css']
})
export class SigInComponent implements OnInit {

  Uname: string = '';
  Ulastname: string = '';
  Uemail: string = '';
  Upassword: string = '';
  Ucredential: string = '';
  repeatUPassword: string = '';
  loading: boolean = false;
  constructor(
    private toastr: ToastrService,
    private _userService: UserService,
    private router: Router,
    private _errorService: ErrorService  
  ) { }
  ngOnInit(): void {

  }

  addUser() {

    //VALIDAR EL FORMULARIO

    if (this.Uname == '' || this.Ulastname == '' || this.Uemail == '' || this.Ucredential == '' || this.Upassword == '' || this.repeatUPassword == '') {
      this.toastr.error('Todos los campos son obligatorios!', 'Error');
      return
    }

    if (this.Upassword != this.repeatUPassword) {
      this.toastr.warning('Las contreñas son diferentes!', 'Error');
      return
    }

    //CREAR EL OBJETO

    const user: User = {
      Uname: this.Uname,
      Ulastname: this.Ulastname,
      Uemail: this.Uemail,
      Upassword: this.Upassword,
      Ucredential: this.Ucredential,
    }

    this.loading = true

    // this._userService.signIn(user).subscribe({

    // })

    this._userService.signIn(user).subscribe({
      next: (v) => {
        this.loading = false
        this.toastr.success(`El usuario ${this.Uname} ${this.Ulastname} fue registrado exitosamente", "Usuario Registrado`)
        this.router.navigate(['/logIn'])
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false
        this._errorService.msgError(e)
      },
      complete: () => console.info('complete')
    })
  }
  
  // msgError(e: HttpErrorResponse) {
  //   if (e.error.msg) {
  //     console.log(e.error.msg);
  //     this.toastr.error(e.error.msg, 'Error')
  //   } else {
  //     this.toastr.error("Upps, ocurrio un error, comunicate con el administrador", "Error")
  //   }
  // }
  // this._userService.signIn(user).subscribe(data => {
  //   this.loading = false
  //   this.toastr.success(`El usuario ${this.name} ${this.lastname} fue registrado exitosamente", "Usuario Registrado`)
  //   this.router.navigate(['/logIn'])
  // }, (event: HttpErrorResponse) => {
  //   this.loading = false
  //   if(event.error.msg){
  //     console.log(event.error.msg);
  //     this.toastr.error(event.error.msg, 'Error') 
  //   }else{
  //     this.toastr.error("Upps, ocurrio un error, comunicate con el administrador", "Error")
  //   }
  // })



}
