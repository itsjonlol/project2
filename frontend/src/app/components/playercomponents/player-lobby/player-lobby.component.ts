import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameNameDetails, GameSession, GameState, Submission } from '../../../models/gamemodels';
import { Stomp, StompSubscription } from '@stomp/stompjs';
import { PlayerDrawingComponent } from '../player-drawing/player-drawing.component';
import { GameService } from '../../../services/game.service';
import { PlayerVoteInputComponent } from '../player-vote-input/player-vote-input.component';
import { PlayerResultsComponent } from '../player-results/player-results.component';

@Component({
  selector: 'app-player-lobby',
  imports: [PlayerDrawingComponent,PlayerVoteInputComponent,PlayerResultsComponent],
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
  private disconnectSubscription!:StompSubscription

  //trial
  gameStarted:boolean=false;
  
  gameService = inject(GameService)
  currentGameState:string | undefined = ''
  submissionSubscription!:StompSubscription
  submission !: Submission

  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = localStorage.getItem("username") || 'player';
    
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
    } else {
      console.error('Game code not found in route parameters.');
    }
    this.gameService.getGameRoomState(this.gameCode).subscribe(d=>this.currentGameState=d.gameState)
   
    this.gameNameDetails = {
      gameCode: this.gameCode,
      name: this.username,
      role: "player"
    };
    
    this.wsService.connect();
    this.wsService.isConnected$.subscribe((isConnected) => {
      if (isConnected) {
       
        console.log(this.gameNameDetails);
        // this.wsService.client.publish({destination:`/app/players/${this.gameCode}`,body:JSON.stringify(this.gameNameDetails)})
        this.wsService.publish(`/app/players/${this.gameCode}`,this.gameNameDetails)

        this.disconnectSubscription=this.wsService.client.subscribe(`/topic/disconnect/${this.gameCode}`, message =>
          {console.log(message.body)  
          const data = JSON.parse(message.body)
          if (data.disconnect) {
            this.disconnect();
          }
          }

        )

        this.submissionSubscription=this.wsService.client.subscribe(`/topic/submission/${this.gameCode}`,(message) => {
          console.log(message.body)

          const data = JSON.parse(message.body);
          const players = data.players;
          const playerSubmissions = data.playerSubmissions;
          this.submission = {
            gameCode:this.gameCode,
            players:players,
            playerSubmissions:playerSubmissions
          }
         })

        
        
        this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
          console.log(message.body);

          const data = JSON.parse(message.body);
          
          if (data.gameState === GameState.STARTED) {
            // console.log(true);
            this.currentGameState=GameState.STARTED
            this.gameStarted=true;
            // this.router.navigate(['player','draw',this.gameCode])
          }
          if (data.gameState === GameState.DESCRIBE) {
            this.currentGameState= GameState.DESCRIBE
          }

          if (data.gameState === GameState.VOTING) {
            this.currentGameState = GameState.VOTING
          }

          if (data.gameState === GameState.RESULTS) {
            this.currentGameState = GameState.RESULTS
          }
          if (data.gameState === GameState.FINISHED) {
            this.currentGameState = GameState.FINISHED
          }
          
          
         
        })
      }
    })


  }
  // ngOnChanges():void {
  //   console.log("on changes...")
  //   this.gameService.getGameRoomState(this.gameCode).subscribe(d=>this.currentGameState=d.gameState)
  // }

  disconnect():void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.disconnectSubscription){
      this.disconnectSubscription.unsubscribe();
    }
    this.wsService.publish(`/app/disconnect/${this.gameCode}`,this.gameNameDetails)
    this.wsService.disconnect()
    this.router.navigate(['/dashboard'])
  }

  ngOnDestroy(): void {
    console.log("got destroyed...")
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.disconnectSubscription){
      this.disconnectSubscription.unsubscribe();
    }
    this.wsService.publish(`/app/disconnect/${this.gameCode}`,this.gameNameDetails)
    this.wsService.disconnect()
  }

}
