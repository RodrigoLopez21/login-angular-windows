import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SigInComponent } from './sig-in/sig-in.component';
import { AuthGuard } from './utils/auth.guard';
import { DashboardComponent } from './admin/dashboard.component';
import { HomeComponent } from './admin/home/home.component';
import { CategoryComponent } from './admin/category/category.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  // {path: 'category', component: CategoryComponent},
  {path: 'signIn', component: SigInComponent},
  { path: 'user/dashboard', component: UserDashboardComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'user/profile', component: UserProfileComponent },
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
