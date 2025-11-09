import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
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
    // Simular carga de datos del usuario (reemplaza con tu API real)
    const userData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      username: 'juanperez',
      email: 'juan@example.com'
    };

    this.profileForm.patchValue(userData);
    
    // Deshabilitar el formulario inicialmente
    if (!this.isEditing) {
      this.profileForm.disable();
    }
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
      
      // Preparar datos para enviar
      const formData = { ...this.profileForm.value };
      
      // Si no se cambió la contraseña, eliminar campos de password
      if (!formData.password) {
        delete formData.password;
        delete formData.confirmPassword;
      }

      // Simular llamada a API (reemplaza con tu servicio real)
      setTimeout(() => {
        this.isLoading = false;
        
        // Simular éxito (en un caso real, verificar respuesta de API)
        this.message = 'Perfil actualizado correctamente';
        this.messageType = 'success';
        this.isEditing = false;
        this.profileForm.disable();
        
        // Limpiar campos de contraseña
        this.profileForm.patchValue({
          password: '',
          confirmPassword: ''
        });
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          this.message = '';
        }, 3000);
        
      }, 1500);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
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