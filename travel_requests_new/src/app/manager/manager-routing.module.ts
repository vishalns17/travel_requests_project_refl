import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ManagerComponent } from './manager.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewRequestComponent } from './view-request/view-request.component';

const routes: Routes = [{ path: '', component: DashboardComponent },
   {path:"login",component:LoginComponent},
  // {path:"addnote/:id",component:AddnoteEmployeeComponent},
  {path:"request/:id",component:ViewRequestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
