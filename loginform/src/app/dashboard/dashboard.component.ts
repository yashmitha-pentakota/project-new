import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private _router: Router) {}

  createcourse(){
    this._router.navigate(['/create-course']);
  }
  displaycourse(){
    this._router.navigate(['/display-course']);
  }
  logout() {
    console.log("User has logged out");

    // Clear any authentication data (example using localStorage)
    localStorage.removeItem('authToken');  // Assuming 'authToken' is used for user authentication

    // Redirect to the login page after logout
    this._router.navigate(['/login']);
  }
}
