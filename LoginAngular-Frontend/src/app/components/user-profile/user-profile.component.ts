import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUserData(): void {
    this.userService.getProfile().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email
        });
        
        if (!this.isEditing) {
          this.profileForm.disable();
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar los datos del perfil');
        console.error('Error:', error);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.message = ''; // Limpiar mensajes
    
    if (this.isEditing) {
      this.profileForm.enable();
      // Mantener el email como disabled si quieres (opcional)
      // this.profileForm.get('email')?.disable();
    } else {
      this.profileForm.disable();
      // Recargar datos originales al cancelar
      this.loadUserData();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Prepare non-sensitive data to update directly
      const basicUpdate: User = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        username: this.profileForm.value.username,
        // map to backend via service
      };

      // Detect sensitive changes
      const newEmail = this.profileForm.value.email;
      const newPassword = this.profileForm.value.password;
      const phoneChanged = false; // placeholder if you later add phone field

      const emailChanged = this.currentUser && newEmail !== this.currentUser.email;
      const passwordProvided = !!newPassword;

      const finalizeBasicUpdate = () => {
        // call updateProfile for non-sensitive fields
        // Note: if email or password was changed via verification, backend already updated it
        // so we only update firstName, lastName, username
        const dto: any = {
          firstName: basicUpdate.firstName,
          lastName: basicUpdate.lastName,
          username: basicUpdate.username
          // DON'T include email or password here if they were verified separately
        };
        
        // If no sensitive change happened, include email
        if (!emailChanged && !passwordProvided) {
          dto.email = newEmail;
        }

        this.userService.updateProfile(dto).subscribe({
          next: () => {
            this.isLoading = false;
            this.toastr.success('Perfil actualizado correctamente');
            this.isEditing = false;
            this.profileForm.disable();
            this.profileForm.patchValue({ password: '', confirmPassword: '' });
            // reload user data
            this.loadUserData();
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error('Error al actualizar el perfil');
            console.error('Error:', error);
          }
        });
      };

      const runVerificationThenFinalize = async (type: 'email' | 'password' | 'phone') => {
        try {
          if (type === 'email') {
            await this.userService.requestVerification('email', newEmail).toPromise();
            const code = window.prompt('Se ha enviado un código a tu correo. Introduce el código para confirmar el cambio de email:');
            if (!code) {
              this.isLoading = false;
              this.toastr.info('Operación cancelada');
              return;
            }
            const response: any = await this.userService.confirmVerification('email', code, newEmail).toPromise();
            // Update current user with verified data
            if (response?.user) {
              this.currentUser = response.user;
              this.profileForm.patchValue({
                email: response.user.email
              });
            }
          } else if (type === 'password') {
            await this.userService.requestVerification('password').toPromise();
            const code = window.prompt('Se ha enviado un código a tu correo. Introduce el código para confirmar el cambio de contraseña:');
            if (!code) {
              this.isLoading = false;
              this.toastr.info('Operación cancelada');
              return;
            }
            await this.userService.confirmVerification('password', code, undefined, newPassword).toPromise();
          } else if (type === 'phone') {
            // phone flow (if you add phone field)
            const newPhone = this.profileForm.value['phone'];
            await this.userService.requestVerification('phone', newPhone).toPromise();
            const code = window.prompt('Se ha enviado un código a tu correo. Introduce el código para confirmar el cambio de teléfono:');
            if (!code) {
              this.isLoading = false;
              this.toastr.info('Operación cancelada');
              return;
            }
            await this.userService.confirmVerification('phone', code, newPhone).toPromise();
          }

          // After successful sensitive update, finalize other fields
          finalizeBasicUpdate();
        } catch (err: any) {
          this.isLoading = false;
          const msg = err?.error?.msg || 'Error en verificación';
          this.toastr.error(msg);
          console.error('Verification error:', err);
        }
      };

      // Decide flow: priority to email, then password, then phone
      if (emailChanged) {
        runVerificationThenFinalize('email');
      } else if (passwordProvided) {
        runVerificationThenFinalize('password');
      } else if (phoneChanged) {
        runVerificationThenFinalize('phone');
      } else {
        // only basic update
        finalizeBasicUpdate();
      }
    } else {
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          this.toastr.error(`El campo ${key} es inválido`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/user/dashboard']);
  }

  // Getters para fácil acceso en el template
  get firstName() { return this.profileForm.get('firstName'); }
  get lastName() { return this.profileForm.get('lastName'); }
  get username() { return this.profileForm.get('username'); }
  get email() { return this.profileForm.get('email'); }
  get password() { return this.profileForm.get('password'); }
  get confirmPassword() { return this.profileForm.get('confirmPassword'); } 
}