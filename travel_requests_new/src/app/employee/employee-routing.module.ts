import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { EmployeeComponent } from './employee.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { LoginComponent } from './login/login.component';
import { EditRequestComponent } from './edit-request/edit-request.component';
import { AddnoteEmployeeComponent } from './addnote-employee/addnote-employee.component';

const routes: Routes = [
  {path:"newrequest",component:NewRequestComponent},
  {path:"request/:id",component:ViewRequestComponent},
  {path:"editrequest/:id",component:EditRequestComponent},
  {path:"addnote/:id",component:AddnoteEmployeeComponent},
  {path:"login",component:LoginComponent},
  { path: '', component: DashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
