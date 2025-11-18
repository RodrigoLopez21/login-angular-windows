import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-set-password-invite',
  templateUrl: './set-password-invite.component.html',
  styleUrls: ['./set-password-invite.component.css']
})
export class SetPasswordInviteComponent implements OnInit {
  form = {
    Uid: 0,
    inviteCode: '',
    newPassword: '',
    confirmPassword: ''
  };
  loading: boolean = false;
  submitted: boolean = false;
  passwordsMatch: boolean = true;

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get Uid and inviteCode from query params
    this.route.queryParams.subscribe(params => {
      this.form.Uid = Number(params['uid']) || 0;
      this.form.inviteCode = params['code'] || '';

      if (!this.form.Uid || !this.form.inviteCode) {
        this.toastr.error('Parámetros de invitación inválidos');
        this.router.navigate(['/login']);
      }
    });
  }

  onPasswordChange(): void {
    this.passwordsMatch = this.form.newPassword === this.form.confirmPassword;
  }

  setPassword(): void {
    this.submitted = true;

    if (!this.form.newPassword || !this.form.confirmPassword) {
      this.toastr.error('Por favor completa todos los campos');
      return;
    }

    if (this.form.newPassword.length < 8) {
      this.toastr.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!this.passwordsMatch) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    }

    this.loading = true;
    this.userService.setPasswordFromInvite(
      this.form.Uid,
      this.form.inviteCode,
      this.form.newPassword
    ).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.toastr.success('Contraseña establecida correctamente. Inicia sesión ahora.');
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorService.msgError(err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
