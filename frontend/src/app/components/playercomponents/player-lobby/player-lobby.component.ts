import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameNameDetails, GameSession, GameState, Submission, Transition } from '../../../models/gamemodels';
import { Stomp, StompSubscription } from '@stomp/stompjs';
import { PlayerDrawingComponent } from '../player-drawing/player-drawing.component';
import { GameService } from '../../../services/game.service';
import { PlayerVoteInputComponent } from '../player-vote-input/player-vote-input.component';
import { PlayerResultsComponent } from '../player-results/player-results.component';
import { PlayerTransitionComponent } from "../player-transition/player-transition.component";
import { Observable, Subscribable, Subscription } from 'rxjs';
import { GameStore } from '../../../store/GameStore.store';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-player-lobby',
  imports: [PlayerDrawingComponent, PlayerVoteInputComponent, PlayerResultsComponent,PlayerTransitionComponent,AsyncPipe,JsonPipe],
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
  gameStore = inject(GameStore);
  storeGameState$!: Observable<string | null>
  


  submissionSubscription!:StompSubscription
  submission !: Submission

  transition!:Transition

  gameStoreSubscription!: Subscription
  connectionSub!:Subscription

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.gameCode = parseInt(params['gameCode']);
      // this.storeGameState$= this.gameStore.selectGameState(this.gameCode);
      // this.storeGameState$= this.gameStore.selectGameState(this.gameCode);
    })

    // const gameCodeParam = this.activatedRoute.snapshot.params['gameCode'];
    this.username = localStorage.getItem("username") || 'player';
    
    // if (gameCodeParam) {
    //   // Convert the parameter to a number
    //   this.gameCode = +gameCodeParam;
      
    // } else {
    //   console.error('Game code not found in route parameters.');
    // }
    // this.storeGameState$ = this.gameStore.selectGameState(this.gameCode);
    
    // this.gameStore.getGameStateForRoom(this.gameCode);
    
    this.gameNameDetails = {
      gameCode: this.gameCode,
      name: this.username,
      role: "player"
    };
  
    this.wsService.connect();

    this.connectionSub = this.wsService.isConnected$.subscribe((isConnected) => {
      if (isConnected) {
       
        console.log(this.gameNameDetails);
        
        // this.wsService.client.publish({destination:`/app/players/${this.gameCode}`,body:JSON.stringify(this.gameNameDetails)})
        // to send player name to the host
        this.wsService.publish(`/app/players/${this.gameCode}`,this.gameNameDetails)

        // this.gameStore.getGameStateForRoom(this.gameCode);
        // this.storeGameState$= this.gameStore.selectGameState(this.gameCode);
        this.gameService.getGameRoomState(this.gameCode).subscribe(d=>this.currentGameState=d.gameState)
        // this.gameStoreSubscription = this.gameStore.selectGameState(this.gameCode).subscribe(d => this.currentGameState = d);
        
        // to listen if host has disconnected.
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
          const gamePrompt = data.gamePrompt;
          const playerSubmissions = data.playerSubmissions;
          this.submission = {
            gameCode:this.gameCode,
            gamePrompt:gamePrompt,
            players:players,
            playerSubmissions:playerSubmissions
          }
         })

        
        // to listen for game state updates from backend. and to update store
        this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
          console.log(message.body);

          const data = JSON.parse(message.body);
          
          if (data.gameState === GameState.STARTED) {
            this.currentGameState = GameState.TRANSITION
            // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.TRANSITION})
            // this.gameStore.updateGameState(GameState.TRANSITION);
            this.transition = {
              gameCode: this.gameCode,
              fromState: GameState.QUEUING,
              ToState:GameState.STARTED
            }
            
            setTimeout(()=>{
              this.currentGameState = GameState.STARTED
              // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.STARTED})
              // this.gameStore.updateGameState(GameState.STARTED);
            },10000)
            // console.log(true);
            // this.currentGameState=GameState.STARTED
            // this.gameStarted=true;
            // this.router.navigate(['player','draw',this.gameCode])
          }
          if (data.gameState === GameState.DESCRIBE){
            this.currentGameState = GameState.DESCRIBE
            // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.DESCRIBE})
            // this.gameStore.updateGameState(GameState.DESCRIBE);
          }

          // if (data.gameState === GameState.VOTING) {
          //   // this.currentGameState = GameState.TRANSITION
          //   this.gameStore.updateGameState(GameState.TRANSITION);
          //   this.transition = {
          //     gameCode: this.gameCode,
          //     fromState: GameState.DESCRIBE,
          //     ToState:GameState.VOTING
          //   }

          //   setTimeout(()=>this.currentGameState=GameState.VOTING,10000)
          //   // this.currentGameState = GameState.VOTING
          // }
          if (data.gameState === GameState.VOTING) {
            this.currentGameState = GameState.TRANSITION
            // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.TRANSITION})
            // this.gameStore.updateGameState(GameState.TRANSITION);
            this.transition = {
              gameCode: this.gameCode,
              fromState: GameState.DESCRIBE,
              ToState:GameState.VOTING
            }

            setTimeout(()=>{
              this.currentGameState=GameState.VOTING
              // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.VOTING})
              // this.gameStore.updateGameState(GameState.VOTING);
            },10000)
            // this.currentGameState = GameState.VOTING
          }

        
          if (data.gameState === GameState.RESULTS) {

            this.currentGameState = GameState.TRANSITION
            // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.TRANSITION})
            // this.gameStore.updateGameState(GameState.TRANSITION);
            this.transition = {
              gameCode: this.gameCode,
              fromState: GameState.VOTING,
              ToState:GameState.RESULTS
            }

            setTimeout(()=>{
              this.currentGameState=GameState.RESULTS
              // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.RESULTS})
              // this.gameStore.updateGameState(GameState.RESULTS);
              },10000)

            // setTimeout(()=>this.currentGameState=GameState.RESULTS,2000)
            
          }
          if (data.gameState === GameState.FINISHED) {
            // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.FINISHED})
            this.currentGameState = GameState.FINISHED
            // this.gameStore.updateGameState(GameState.FINISHED);

            setTimeout(() => {
                  
              this.router.navigate(['/dashboard']);
              // this.gameStore.updateGameState(GameState.AVAILABLE);
              
            }, 2000);
            
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

    if (this.gameStoreSubscription) {
      this.gameStoreSubscription.unsubscribe();
    }

    if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    }

    if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
      console.log("✅ Unsubscribed from submissionSubscription");
  }
    this.wsService.publish(`/app/disconnect/${this.gameCode}`,this.gameNameDetails)
    this.wsService.disconnect()
    this.router.navigate(['/dashboard'])
  }

  ngOnDestroy(): void {
    console.log("got destroyed...")
    // if (this.gameStateSubscription) {
    //   this.gameStateSubscription.unsubscribe();
    // }
    // if (this.disconnectSubscription){
    //   this.disconnectSubscription.unsubscribe();
    // }
    // this.wsService.publish(`/app/disconnect/${this.gameCode}`,this.gameNameDetails)
    // this.wsService.disconnect()
    this.disconnect();
  }

}
