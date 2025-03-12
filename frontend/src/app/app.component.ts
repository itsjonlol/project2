import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FireAuthService } from './services/fire-auth.service';
import { AudioComponent } from './components/extcomponents/audio/audio.component';
import { EmailRequest, EmailResponse, EmailService } from './services/email.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule,AudioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent implements OnInit {

  fireAuthService = inject(FireAuthService);

  emailService = inject(EmailService)

  router = inject(Router)
  errorMessage!:string;

  ngOnInit(): void {
    this.fireAuthService.user$.subscribe(user => {
      if (user) {
        
        this.fireAuthService.currentUserSig.set({
          userId: user.uid,
          email:user.email!,
          username: user.displayName!
        })
        sessionStorage.setItem('userid',user.uid || 'blank')
        sessionStorage.setItem('email',user.email || 'blank')
        localStorage.setItem('username',user.displayName || '');
      } else {
        this.fireAuthService.currentUserSig.set(null)
      }
      console.log(this.fireAuthService.currentUserSig())
    })
  }


  logout(): void {
    this.fireAuthService.logout()
    localStorage.removeItem('username')
    sessionStorage.removeItem('userid')
    sessionStorage.removeItem('email')
    this.router.navigate(['/login'])

    
  }

  sendEmailRequest():void {
    const email = sessionStorage.getItem("email");
    const name = localStorage.getItem("username")
  
    let emailRequest:EmailRequest = {
      to:email!,
      name:name!
    }

    this.emailService.requestEmailUpdates(emailRequest).subscribe({
      next: (response:EmailResponse)=> {
        alert(response.message)
      },
      error: (error:HttpErrorResponse)=> {
        this.errorMessage = error.error.message;
        alert(this.errorMessage)
      }
    })

  }
}
