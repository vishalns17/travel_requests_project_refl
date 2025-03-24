import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
constructor(private connector: ConnectorService, private router:Router) {

  }
  loginForm !: FormGroup



  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    })

  }
  response: any

  onLogin() {
    console.log('Trying to login :', this.loginForm.value);

    this.connector.manager_login(this.loginForm).subscribe(
      data => {
        console.log('Received data:', data);
        this.response = data;
        this.connector.storeToken(this.response.token)
        console.log(this.response.token)
        this.router.navigate(['manager/'])
        

      },
      error => {
        console.log('Error occurred', error);
      }
    );
  }
}

