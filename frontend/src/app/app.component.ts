import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FireAuthService } from './services/fire-auth.service';

import { EmailRequest, EmailResponse, EmailService } from './services/email.service';
import { HttpErrorResponse } from '@angular/common/http';
import {  BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [BsModalService]
  
})
export class AppComponent implements OnInit {

  //Firebase auth service
  fireAuthService = inject(FireAuthService);

  emailService = inject(EmailService)

  router = inject(Router)
  errorMessage!:string;

  gameStart:boolean = false;
  
  // put details on session storage
  ngOnInit(): void {
    this.fireAuthService.user$.subscribe(user => {
      if (user) {
        
        this.fireAuthService.currentUserSig.set({
          userId: user.uid,
          email:user.email!,
          username: user.displayName!
        })
        sessionStorage.setItem('userId',user.uid || 'blank')
        sessionStorage.setItem('email',user.email || 'blank')
        sessionStorage.setItem('username',user.displayName || '');
      } else {
        this.clearStorage();
        this.fireAuthService.currentUserSig.set(null)
      }
      console.log(this.fireAuthService.currentUserSig())
    })
    

    
  }
  //clear storage when session ends
  private clearStorage(): void {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userId');
  }


  logout(): void {
    this.clearStorage();
    this.fireAuthService.logout()
    
    this.router.navigate(['/login'])

    
  }
  //details required for email request
  sendEmailRequest():void {
    const email = sessionStorage.getItem("email");
    const name = sessionStorage.getItem("username")
  
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
  // to not display the nav bar when in a game
  checkIfInGame(): boolean {
    if (this.router.url.includes('/player') || this.router.url.includes('/host')) {
      this.gameStart = true;
    } else {
      this.gameStart = false;
    }

    return this.gameStart
  }
}
