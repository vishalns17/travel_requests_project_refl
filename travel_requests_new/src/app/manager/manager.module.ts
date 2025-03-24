import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { LoginComponent } from './login/login.component';
// import { PlainNavbarComponent } from '../plain-navbar/plain-navbar.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestsComponent } from './requests/requests.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ViewRequestComponent } from './view-request/view-request.component';


@NgModule({
  declarations: [
    ManagerComponent,
    LoginComponent,
    DashboardComponent,
    RequestsComponent,
    NavbarComponent,
    ViewRequestComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ManagerModule { }
