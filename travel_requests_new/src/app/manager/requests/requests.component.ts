import { Component } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})

export class RequestsComponent {
  requests: any;
  sortOrder = ''
  fromDate = ''
  toDate: string = new Date().toISOString().slice(0, 10)
  status = ''
  managerName: any;
  employee = ''

  constructor(private connector: ConnectorService, private router: Router) {
    this.getRequests()
  }

  resetFilters(): void{
    this.requests = ''
    this.sortOrder=''
    this.fromDate =''
    this.toDate = new Date().toISOString().slice(0, 10)
    this.status = ''
    this.employee=''
    this.getRequests()
  }

  getRequests(): void {
    this.connector.listRequestsManager(this.sortOrder, this.fromDate, this.toDate, this.status,this.employee).subscribe(
      data => {
        console.log('Received data:', data);
        this.requests = data;  
      },
      error => {
        console.log('Error occurred', error);
      }
    );
  }

  dateSort(order: string) {
    this.sortOrder = order
    this.getRequests()
  }

  dateFilter() {
    this.getRequests()
  }

  employeeFilter() {
    this.getRequests()
  }

  statusFilter(status: string) {
    console.log('The selected status is ', status)
    this.status = status
    this.getRequests()
  }

  // dashtoRequest(requestId: number) {

  // }

  logout() {
    localStorage.removeItem('authToken');
    console.log('User logged out');
    this.router.navigate(['/'])

  }

  jumptoRequest(requestId: any) {
    console.log(requestId);
    this.connector.viewRequestManager(requestId).subscribe(
      data => {
        console.log('Request Data:', data);
        this.navigateToRequestPage(data);
      },
      error => {
        console.error('Error occurred while fetching request:', error);
      }
    );
  }

  navigateToRequestPage(data: any) {
    this.router.navigate(['/manager/request', data.id]);
  }

  jumptoEditRequest(requestId: any) {
    console.log("Editing",requestId);
    this.connector.viewRequest(requestId).subscribe(
      data => {
        console.log('Request Data:', data);
        this.navigateToEditRequestPage(data)
      },
      error => {
        console.error('Error occurred while fetching request:', error);
      }
    );
  }

  navigateToEditRequestPage(data: any) {
    this.router.navigate(['/editrequest', data.id]);
  }


  
  jumptoAddnote(requestId: any) {
    console.log(requestId);
    this.connector.viewRequest(requestId).subscribe(
      data => {
        console.log('Request Data:', data);
        this.navigateToAddnoteemp(data);
      },
      error => {
        console.error('Error occurred while fetching request:', error);
      }
    );
  }

  navigateToAddnoteemp(data: any) {
    this.router.navigate(['/addnote', data.id]);
  }

}