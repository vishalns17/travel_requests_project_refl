import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private connector: ConnectorService, private router:Router) {

  }
  loginForm !: FormGroup
  loading = false;



  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
    })

  }
  response: any

  onLogin() {

    if (this.loginForm.invalid) return; // Prevent submission if the form is invalid

    this.loading = true; // Show "Logging in..." message

    console.log('Trying to login :', this.loginForm.value);

    this.connector.employee_login(this.loginForm).subscribe(
      data => {
        console.log('Received data:', data);
        this.response = data;
        this.connector.storeToken(this.response.token)
        console.log(this.response.token)
        this.router.navigate(['employee/'])
        

      },
      error => {
        console.log('Error occurred', error);
        console.error('Login failed:', error);
        this.loading = false;
      }
    );
  }
}

