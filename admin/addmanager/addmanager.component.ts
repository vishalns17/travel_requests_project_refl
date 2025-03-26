import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConnectorService } from '../../connector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addmanager',
  templateUrl: './addmanager.component.html',
  styleUrl: './addmanager.component.css'
})
export class AddmanagerComponent implements OnInit {

  requests: any

  managerForm!: FormGroup

  errors:any



  constructor(private connector: ConnectorService, private router: Router) { }

  ngOnInit() {
    this.managerForm = new FormGroup({
      name: new FormControl(''),
      password: new FormControl(''),
      email: new FormControl(''),
      manager: new FormControl(''),
      username:new FormControl('')
    }
    )
  }
  onSubmit() {
    console.log('Form submitted:', this.managerForm.value);
  
    this.connector.addManager(this.managerForm).subscribe({
      next: (response) => {
        console.log('Request successful:', response);

        const modalElement = document.getElementById('successModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
          this.managerForm.reset()
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
    this.router.navigate(['/admin/managerlist']);
  }

  


}

