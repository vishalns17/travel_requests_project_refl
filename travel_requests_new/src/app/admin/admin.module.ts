import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestsComponent } from './requests/requests.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { ManagerListComponent } from './manager-list/manager-list.component';
import { AddmanagerComponent } from './addmanager/addmanager.component';


@NgModule({
  declarations: [
    AdminComponent,
    LoginComponent,
    DashboardComponent,
    ViewRequestComponent,
    NavbarComponent,
    RequestsComponent,
    EmployeeListComponent,
    AddemployeeComponent,
    ManagerListComponent,
    AddmanagerComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
