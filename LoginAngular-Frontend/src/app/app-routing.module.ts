import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SigInComponent } from './sig-in/sig-in.component';
import { AuthGuard } from './utils/auth.guard';
import { DashboardComponent } from './admin/dashboard.component';
import { HomeComponent } from './admin/home/home.component';
import { CategoryComponent } from './admin/category/category.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  // {path: 'category', component: CategoryComponent},
  {path: 'signIn', component: SigInComponent},
  {path: 'admin', 
    // canActivate: [AuthGuard],     
    component: DashboardComponent, 
    children:[
      { path: '', loadChildren:() => import('./admin/dashboard.module').then(m => m.DashboardModule)},
      { path: 'product', loadChildren:() => import('./admin/dashboard.module').then(m => m.DashboardModule) },
      { path: 'category', loadChildren:() => import('./admin/dashboard.module').then(m => m.DashboardModule) }
    ]
  },
  {path: '**', redirectTo: '/login', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
