import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SigInComponent } from './sig-in/sig-in.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { ProductComponent } from './components/dashboard/product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { SecurityService } from './services/security.service';

// TOAST CON ANIMACIONES
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AddTokenInterceptor } from './utils/add-token.interceptor';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

// Inicializar seguridad
export function initializeSecurity(securityService: SecurityService) {
  return (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        securityService.preventClickjacking();
        resolve();
      }, 100);
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SigInComponent,
    SpinnerComponent,
    MaintenanceComponent,
    ProductComponent,
    ErrorPageComponent,
    UserDashboardComponent,
    UserProfileComponent,
    AdminDashboardComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenInterceptor,
      multi: true
    },

    {
      provide: APP_INITIALIZER,
      useFactory: initializeSecurity,
      deps: [SecurityService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
