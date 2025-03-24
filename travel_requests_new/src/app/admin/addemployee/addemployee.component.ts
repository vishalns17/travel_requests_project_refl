import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

declare const bootstrap: any;

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrl: './addemployee.component.css'
})
export class AddemployeeComponent implements OnInit {

  requests: any

  employeeForm!: FormGroup

  errors:any



  constructor(private connector: ConnectorService, private router: Router) { }

  ngOnInit() {
    this.getManagers()
    this.employeeForm = new FormGroup({
      name: new FormControl(''),
      password: new FormControl(''),
      email: new FormControl(''),
      manager: new FormControl(''),
      username:new FormControl('')
    }
    )
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

  onSubmit() {
    console.log('Form submitted:', this.employeeForm.value);
  
    this.connector.addEmployee(this.employeeForm).subscribe({
      next: (response) => {
        console.log('Request successful:', response);

        const modalElement = document.getElementById('successModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
          this.employeeForm.reset()
        }
      },
      error: (error) => {
        console.error('Request failed:', error);
      }
    });
  }

  closeModalAndNavigate() {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide(); 
    }
    this.router.navigate(['../employeelist']);
  }

  


}
