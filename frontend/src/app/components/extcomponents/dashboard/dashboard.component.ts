import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { GameService } from '../../../services/game.service';
import { GameRoomResponse } from '../../../services/game.service';
import { HttpErrorResponse } from '@angular/common/http';




@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], 
  standalone: true
})
export class DashboardComponent {

  

  constructor(private router: Router) {}

  gameService = inject(GameService)
 

  

  
  hostGame(): void {
    // Navigate to host lobby
    
    this.gameService.getGameRoom().subscribe({
      next: (response:GameRoomResponse) => {
        const gameCode = response.gameCode;
        this.router.navigate(['/host','lobby',gameCode])

      },error: (error:HttpErrorResponse) => {
        console.log(error.error.message);
      }
    })

  }


  enterGame(): void {
    this.router.navigate(['/enter-game']);
  }

  viewGallery():void {
    this.router.navigate(['/gallery'])
  }

 

 
}
