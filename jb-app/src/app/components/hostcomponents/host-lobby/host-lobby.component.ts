import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { CommonModule, NgFor } from '@angular/common';
import { Subscription } from 'rxjs';
import { ImageData } from '../../../models/image-data'; // Import class
import { Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { GameRoomResponse, GameSession, GameState, Player } from '../../../models/gamemodels';
import { Stomp, StompSubscription } from '@stomp/stompjs';

@Component({
  selector: 'app-host-lobby',
  standalone:true,
  imports: [CommonModule,NgFor],
  templateUrl: './host-lobby.component.html',
  styleUrl: './host-lobby.component.css'
})


export class HostLobbyComponent implements OnInit ,OnDestroy{
  images: ImageData[] = [];
  gameCode: number = 0;
  username: string = '';
  players: Player[] = [];
  messagestrings: string[]=[];

  randomData:any; // to change
  


  private connectionSub!: Subscription;
  private lobbyUpdatesSub!: Subscription;

  gameService = inject(GameService);

  gameRoomResponse?: GameRoomResponse

  constructor(private wsService: WebSocketService,private ngZone: NgZone,private router: Router) {}
  
  private playerSubscription!: StompSubscription;
  private gameStateSubscription!: StompSubscription;

  ngOnInit(): void {
    // Assume the host's username is stored in localStorage (set after Google OAuth)
    this.username = localStorage.getItem('username') || 'Host';
    this.wsService.connect();
    this.gameService.getGameRoom().subscribe({
      next: (response:GameRoomResponse) => {
        this.gameRoomResponse = response;
        this.gameCode = this.gameRoomResponse.gameCode;
        console.log(this.gameCode);
        

        this.wsService.isConnected$.subscribe((isConnected) => {
          if (isConnected) {
            this.wsService.publish(`/app/initialisegame/${this.gameCode}`, { gameCode: this.gameCode });

            
            this.playerSubscription = this.wsService.client.subscribe(`/topic/players/${this.gameCode}`, (message) => {
              console.log(message.body);
              const data = JSON.parse(message.body);
              this.players = data.players;
            })


            this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
              console.log(message.body);

              const data = JSON.parse(message.body);
              
              if (data.gameState === GameState.STARTED) {
              
                this.router.navigate(['host','prompt',this.gameCode])
              }
              
             
            })
          }
        })

      }
    })
  }


  startGame(): void {
    console.log("game started");
    this.randomData = {
      gameCode:this.gameCode,
      gameState:GameState.STARTED
    }  
  
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,this.randomData);
  }

  disconnect(): void {
    this.wsService.disconnect();
    setTimeout(()=>this.router.navigate(['/dashboard']),3000);
  }

  ngOnDestroy(): void {
    
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe(); 
    }
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
  }
  
}