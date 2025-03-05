import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FireAuthService } from './services/fire-auth.service';
import { AudioComponent } from './components/extcomponents/audio/audio.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule,AudioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent implements OnInit {

  fireAuthService = inject(FireAuthService);

  router = inject(Router)

  ngOnInit(): void {
    this.fireAuthService.user$.subscribe(user => {
      if (user) {
        
        this.fireAuthService.currentUserSig.set({
          email:user.email!,
          username: user.displayName!
        })
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
    this.router.navigate(['/login'])

    
  }
}
