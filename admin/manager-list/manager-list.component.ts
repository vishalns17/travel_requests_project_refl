import { Component } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-list',
  templateUrl: './manager-list.component.html',
  styleUrl: './manager-list.component.css'
})
export class ManagerListComponent {

  requests:any;

  constructor(private connector: ConnectorService, private router: Router) {
      this.getManagers()
    }

    getManagers(): void {
      this.connector.listManagersAdmin().subscribe(
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

