import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  activeform: 'login' | 'register' = 'register';
  registerobj: registermodel = new registermodel();
  loginobj: loginmodel = new loginmodel();

  constructor(private _router: Router, private http: HttpClient) {}

  toggleform(form: 'login' | 'register') {
    this.activeform = form;
  }
   
  // Register form submission
  registerform() {
    this.http.post('http://localhost:3000/register', this.registerobj)
      .subscribe({
        next: (response: any) => {
          alert(response.message);  // Show success message
          this.toggleform('login');  // Switch to login form
        },
        error: (error) => {
          alert(error.error.message);  // Show error message
        }
      });
  }

  // Login form submission
  loginform() {
    this.http.post('http://localhost:3000/login', this.loginobj)
      .subscribe({
        next: (response: any) => {
          alert(response.message);  // Show success message
          this._router.navigate(['/dashboard']);  // Redirect to dashboard on successful login
          
          localStorage.setItem('token', response.token);  // Store token in local storage
        },
        error: (error) => {
          alert(error.error.message);  // Show error message
        }
      });
  }
}

// Register model for capturing registration form data
export class registermodel {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  age: number;

  constructor() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.phone = '';
    this.address = '';
    this.age = 18;  // Default age to 18
  }
}

// Login model for capturing login form data
export class loginmodel {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}
