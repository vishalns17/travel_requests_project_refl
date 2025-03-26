import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { ManagerListComponent } from './manager-list/manager-list.component';
import { AddmanagerComponent } from './addmanager/addmanager.component';

const routes: Routes = [{ path: '', component: DashboardComponent },
{ path: "login", component: LoginComponent },
// {path:"addnote/:id",component:AddnoteEmployeeComponent},
{ path: "request/:id", component: ViewRequestComponent },
{ path: "employeelist",component:EmployeeListComponent},
{ path: "addemployee", component:AddemployeeComponent},
{ path: "managerlist",component:ManagerListComponent},
{ path: "addmanager", component:AddmanagerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
