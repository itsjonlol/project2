import { Component, inject,OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameNameDetails, GameState, Submission, Transition } from '../../../models/gamemodels';
import { StompSubscription } from '@stomp/stompjs';
import { PlayerDrawingComponent } from '../player-drawing/player-drawing.component';
import { GameService } from '../../../services/game.service';
import { PlayerVoteInputComponent } from '../player-vote-input/player-vote-input.component';
import { PlayerResultsComponent } from '../player-results/player-results.component';
import { PlayerTransitionComponent } from "../player-transition/player-transition.component";
import { Observable, Subscription } from 'rxjs';

import { DisconnectComponent } from './disconnect.component';

@Component({
  selector: 'app-player-lobby',
  imports: [PlayerDrawingComponent, PlayerVoteInputComponent, PlayerResultsComponent,PlayerTransitionComponent,
    DisconnectComponent],
  templateUrl: './player-lobby.component.html',
  styleUrl: './player-lobby.component.css'
})
export class PlayerLobbyComponent implements OnInit,OnDestroy {
  
 

  wsService = inject(WebSocketService);
  gameCode!: number;
  gamePrompt!: string;

  activatedRoute = inject(ActivatedRoute);
  gameNameDetails!:GameNameDetails

  username: string = '';

  router = inject(Router);

  private gameStateSubscription!: StompSubscription;
  private disconnectSubscription!:StompSubscription

  //trial
  gameStarted:boolean=false;
  
  gameService = inject(GameService)

  currentGameState:string | null = ''

  storeGameState$!: Observable<string | null>
  


  submissionSubscription!:StompSubscription
  submission !: Submission

  transition!:Transition

  gameStoreSubscription!: Subscription
  connectionSub!:Subscription
  // get a random mascot
  mascotNo: number = Math.floor(Math.random() * 6) + 1;
  mascot:string = `/mascot/mascot${this.mascotNo}.svg`

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.gameCode = parseInt(params['gameCode']);
    
    })

    this.username = sessionStorage.getItem("username") || 'player';
    
    this.gameNameDetails = {
      gameCode: this.gameCode,
      name: this.username,
      role: "player",
      mascot: this.mascot
    };
  
    this.wsService.connect();

    // ensure websocket is connected before subscribing to the various topics
    this.connectionSub = this.wsService.isConnected$.subscribe((isConnected) => {
      if (isConnected) {
       
        console.log(this.gameNameDetails);
        
        // player send name to backend
        this.wsService.publish(`/app/players/${this.gameCode}`,this.gameNameDetails)

        // subscribe to game state to keep track
        this.gameService.getGameRoomState(this.gameCode).subscribe(d=>this.currentGameState=d.gameState)

        
        // to listen if host has disconnected.
        this.disconnectSubscription=this.wsService.client.subscribe(`/topic/disconnect/${this.gameCode}`, message =>
          {
            // console.log(message.body)  
          const data = JSON.parse(message.body)
          if (data.disconnect) {
            this.disconnect();
          }
          }

        )
        // to get the room submission object to display data
        this.submissionSubscription=this.wsService.client.subscribe(`/topic/submission/${this.gameCode}`,(message) => {
          // console.log(message.body)

          const data = JSON.parse(message.body);
          const players = data.players;
          const gamePrompt = data.gamePrompt;
          const playerSubmissions = data.playerSubmissions;
          this.submission = {
            gameCode:this.gameCode,
            gamePrompt:gamePrompt,
            players:players,
            playerSubmissions:playerSubmissions
          }
         })

        
        // to listen for game state updates from backend, for updating the UI
        this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
          // console.log(message.body);

          const data = JSON.parse(message.body);
          
          if (data.gameState === GameState.STARTED) {

            //transition states for players to read the instructions
            this.currentGameState = GameState.TRANSITION
        
            this.transition = {
              gameCode: this.gameCode,
              fromState: GameState.QUEUING,
              ToState:GameState.STARTED
            }
            
            setTimeout(()=>{
              this.currentGameState = GameState.STARTED
            
            },10000)
           
          }
          // time for players to start describing their image and description
          if (data.gameState === GameState.DESCRIBE){
            this.currentGameState = GameState.DESCRIBE
          
          }
          // time for players to vote
          if (data.gameState === GameState.VOTING) {
            this.currentGameState = GameState.TRANSITION
          
            this.transition = {
              gameCode: this.gameCode,
              fromState: GameState.DESCRIBE,
              ToState:GameState.VOTING
            }

            setTimeout(()=>{
              this.currentGameState=GameState.VOTING
           
            },10000)
          
          }

          // time for players to see the results
          if (data.gameState === GameState.RESULTS) {

            this.currentGameState = GameState.TRANSITION
           
            this.transition = {
              gameCode: this.gameCode,
              fromState: GameState.VOTING,
              ToState:GameState.RESULTS
            }

            setTimeout(()=>{
              this.currentGameState=GameState.RESULTS
              },10000)


            
          }
          // players will be navigated to dashboard once game ends
          if (data.gameState === GameState.FINISHED) {
        
            this.currentGameState = GameState.FINISHED
  

            setTimeout(() => {
                  
              this.router.navigate(['/dashboard']);
              
            }, 2000);
            
          }
          
          
         
        })
      }
    })


  }
  // should player want to disconnect
  handleDisconnection($event:boolean):void {
    if ($event) {
      this.disconnect();
    }
   
  }

  // clean up disconnections
  disconnect():void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.disconnectSubscription){
      this.disconnectSubscription.unsubscribe();
    }

    if (this.gameStoreSubscription) {
      this.gameStoreSubscription.unsubscribe();
    }

    if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    }

    if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
    
  }
    this.wsService.publish(`/app/disconnect/${this.gameCode}`,this.gameNameDetails)
    this.wsService.disconnect()
    this.router.navigate(['/dashboard'])
  }
  // clean up subscriptions
  ngOnDestroy(): void {
    // console.log("got destroyed...")
  
    this.disconnect();
  }

}
