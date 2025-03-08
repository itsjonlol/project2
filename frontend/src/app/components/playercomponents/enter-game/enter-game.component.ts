import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameEntry } from '../../../models/gamemodels';
import { Router, RouterOutlet } from '@angular/router';
import { WebSocketService } from '../../../services/websocket.service';
import { GameService }from '../../../services/game.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-enter-game',
  imports: [FormsModule,RouterOutlet],
  templateUrl: './enter-game.component.html',
  styleUrl: './enter-game.component.css'
})
export class EnterGameComponent implements OnInit{
  
  errorMessage:string ='';


  gameCode:number=0;

  username: string = '';
  
  gameEntry:GameEntry = {
    gameCode:this.gameCode,
    name:this.username
  }
  
  router = inject(Router);
  gameService = inject(GameService);

  test!:any

  ngOnInit(): void {

    this.username = localStorage.getItem("username") || 'player';
    
  }
  

  onSubmit(gameCode:number) {
    this.test=gameCode

    this.gameEntry.gameCode = this.gameCode;
    this.gameEntry.name = this.username;
    
    console.log(this.gameEntry)

    this.gameService.postAccessRoom(this.gameEntry).subscribe({
        next: (response) => {
          console.log(response);
          this.errorMessage='';
          this.router.navigate(['player','lobby',gameCode])
        },
        error: (err:HttpErrorResponse) => {
         
          this.errorMessage = err.error.message;
        }
    })
  }
  
  // onSubmit2(event:any):void {
  //   this.test=event
  // }
  
}
