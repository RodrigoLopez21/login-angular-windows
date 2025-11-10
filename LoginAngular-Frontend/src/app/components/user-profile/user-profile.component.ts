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
      
      const formData: User = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        username: this.profileForm.value.username,
        email: this.profileForm.value.email,
        // Mapear a los campos del backend
        Uname: this.profileForm.value.firstName,
        Ulastname: this.profileForm.value.lastName,
        Uemail: this.profileForm.value.email
      };
      
      if (this.profileForm.value.password) {
        formData.password = this.profileForm.value.password;
        formData.Upassword = this.profileForm.value.password;
      }

      this.userService.updateProfile(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success('Perfil actualizado correctamente');
          this.isEditing = false;
          this.profileForm.disable();
          
          // Limpiar campos de contraseña
          this.profileForm.patchValue({
            password: '',
            confirmPassword: ''
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error('Error al actualizar el perfil');
          console.error('Error:', error);
        }
      });
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