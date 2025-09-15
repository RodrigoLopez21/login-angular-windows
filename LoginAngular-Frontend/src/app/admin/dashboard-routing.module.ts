import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'listProduct', component: ProductComponent},
  { path: 'listCategory', component: CategoryComponent},
  { path: 'roles', component: RoleComponent},
  { path: 'users', component: UserComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
