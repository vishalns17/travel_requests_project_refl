import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestsComponent } from './requests/requests.component';
import { ViewRequestComponent } from './view-request/view-request.component';
// import { PlainNavbarComponent } from '../plain-navbar/plain-navbar.component';
import { EditRequestComponent } from './edit-request/edit-request.component';
import { AddnoteEmployeeComponent } from './addnote-employee/addnote-employee.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    EmployeeComponent,
    NewRequestComponent,
    LoginComponent,
    NavbarComponent,
    DashboardComponent,
    RequestsComponent,
    ViewRequestComponent,
    // PlainNavbarComponent,
    EditRequestComponent,
    AddnoteEmployeeComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule

  ]
})
export class EmployeeModule { }
