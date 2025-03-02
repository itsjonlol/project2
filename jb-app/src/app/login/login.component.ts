import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  loginWithGoogle(): void {
    // Redirect to your Spring Boot backend's Google OAuth2 endpoint
    window.location.href = 'http://localhost:4000/oauth2/authorization/google';
  }
}
