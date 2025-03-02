import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameNameDetails, GameSession, GameState } from '../../../models/gamemodels';
import { StompSubscription } from '@stomp/stompjs';

@Component({
  selector: 'app-player-lobby',
  imports: [],
  templateUrl: './player-lobby.component.html',
  styleUrl: './player-lobby.component.css'
})
export class PlayerLobbyComponent implements OnInit,OnDestroy {
  
 

  wsService = inject(WebSocketService);
  gameCode!: number;

  activatedRoute = inject(ActivatedRoute);
  gameNameDetails!:GameNameDetails

  username: string = '';

  router = inject(Router);

  private gameStateSubscription!: StompSubscription;
  

  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = localStorage.getItem("username") || 'player';
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
    } else {
      console.error('Game code not found in route parameters.');
    }
    this.gameNameDetails = {
      gameCode: this.gameCode,
      name: this.username
    };
    
    this.wsService.connect();
    this.wsService.isConnected$.subscribe((isConnected) => {
      if (isConnected) {
       
        console.log(this.gameNameDetails);
        // this.wsService.client.publish({destination:`/app/players/${this.gameCode}`,body:JSON.stringify(this.gameNameDetails)})
        this.wsService.publish(`/app/players/${this.gameCode}`,this.gameNameDetails)

        this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
          console.log(message.body);

          const data = JSON.parse(message.body);
          
          if (data.gameState === GameState.STARTED) {
            // console.log(true);
            this.router.navigate(['player','draw',this.gameCode])
          }
          
         
        })
      }
    })


  }

  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
  }

}
