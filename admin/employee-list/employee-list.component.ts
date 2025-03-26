import { Component } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {

  requests:any;

  constructor(private connector: ConnectorService, private router: Router) {
      this.getEmployees()
    }

    getEmployees(): void {
      this.connector.listEmployeesAdmin().subscribe(
        data => {
          console.log('Received data:', data);
          this.requests = data;  
        },
        error => {
          console.log('Error occurred', error);
        }
      );
    }

}
