import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GameRoomResponse, GameService } from '../../../services/game.service';
import { GameNameDetails, GameState, GameStateManager, Player, Submission, Transition } from '../../../models/gamemodels';
import { StompSubscription } from '@stomp/stompjs';
import { HostPromptComponent } from "../host-prompt/host-prompt.component";
import { HostPlayerVotesComponent } from '../host-player-votes/host-player-votes.component';
import { HostShowDrawingsComponent } from '../host-show-drawings/host-show-drawings.component';
import { HostResultsComponent } from '../host-results/host-results.component';
import { AudioComponent } from "../../extcomponents/audio/audio.component";
import { HostTransitionComponent } from '../host-transition/host-transition.component';
import { HostWaitingRoomComponent } from "../host-waiting-room/host-waiting-room.component";

import { QrcodeComponent } from "../../extcomponents/qrcode/qrcode.component";

@Component({
  selector: 'app-host-lobby',
  standalone:true,
  imports: [CommonModule, HostPromptComponent, HostPlayerVotesComponent, HostShowDrawingsComponent, HostResultsComponent, AudioComponent, HostTransitionComponent, HostWaitingRoomComponent, AudioComponent, QrcodeComponent],
  templateUrl: './host-lobby.component.html',
  styleUrl: './host-lobby.component.css'
})


export class HostLobbyComponent implements OnInit ,OnDestroy{


  gameCode: number = 0;
  gamePrompt!:string

  username: string = '';
  players: Player[] = [];

  activatedRoute = inject(ActivatedRoute);

  startData:any;
  
  private connectionSub!: Subscription;
  private lobbyUpdatesSub!: Subscription;

  gameService = inject(GameService);

  gameRoomResponse?: GameRoomResponse

  gameStarted:boolean=false

  gameNameDetails!:GameNameDetails



  currentGameState:string|null ='LOADING';

  storeGameState$!: Observable<string | null>

  audioVolume:number = 1;
  
  gameRoomState$!: Observable<GameStateManager>;
  submission!:Submission


  submissionSubscription!:StompSubscription;

  playSound:boolean = false;

  gameStoreSubscription!: Subscription


  transition: Transition =  {
    gameCode: this.gameCode,
    fromState: GameState.QUEUING,
    ToState:GameState.STARTED
  }

  constructor(private wsService: WebSocketService,private router: Router) {}
  
  private playerSubscription!: StompSubscription;
  private gameStateSubscription!: StompSubscription;
  private currentGameStateSub!:Subscription
  private disconnectionSubscription!: StompSubscription;
  

  activatedRouteSub!: Subscription
  

  ngOnInit(): void {
    //get username from sessionstorage
    this.username = sessionStorage.getItem('username') || 'Host';

    // connect websocket with backend
    this.wsService.connect();
    
    //get the game code from params
    this.activatedRoute.params.subscribe({
      next: (params) => {

        this.gameCode = parseInt(params['gameCode']);
       
      //ensure websocket is first connected before subscribing to the various topics
       this.connectionSub= this.wsService.isConnected$.subscribe((isConnected) => {
          if (isConnected) {
            // initialising the game; i.e. set game state from available to queuing
            this.wsService.publish(`/app/initialisegame/${this.gameCode}`, { gameCode: this.gameCode });
            
            // subscribe to the game state, getting the game state from backend
            this.currentGameStateSub = this.gameService.getGameRoomState(this.gameCode).subscribe(d=>this.currentGameState=d.gameState)
        
            // topic to get the list of players in the game
            this.playerSubscription = this.wsService.client.subscribe(`/topic/players/${this.gameCode}`, (message) => {
              // console.log(message.body);
              const data = JSON.parse(message.body);
              this.players = data.players;
            })
            // get the overall room submission object, holding the list of players and their submissions
            this.submissionSubscription=this.wsService.client.subscribe(`/topic/submission/${this.gameCode}`, (message) => {
              // console.log(message.body)
    
              const data = JSON.parse(message.body);
              const players = data.players;
              const gamePrompt = data.gamePrompt;
              this.players = data.players;
              const playerSubmissions = data.playerSubmissions;
              this.submission = {
                gameCode:this.gameCode,
                gamePrompt:gamePrompt,
                players:players,
                playerSubmissions:playerSubmissions
              }
     
             })
            
             // subscribe to game state, to keep track of game state at all times. will update the
            //ui according to each game state
            this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
              // console.log(message.body);

              const data = JSON.parse(message.body);
              // game has started and players start drawing
              if (data.gameState === GameState.STARTED) {
                // to hear the voice commentary and make the volume of the music lower
                this.audioVolume=0.1;
                this.currentGameState = GameState.TRANSITION
                // transition states to tell players what is happening
                this.transition = {
                  gameCode: this.gameCode,
                  fromState: GameState.QUEUING,
                  ToState:GameState.STARTED
                }
                // change the game state for the display/ui
                setTimeout(()=>{
                  this.audioVolume=1;
                  this.currentGameState = GameState.STARTED
             
                },10000)
            
              }
              // host tells players to start giving their images a title and describing
              if (data.gameState === GameState.DESCRIBE){
                this.currentGameState = GameState.DESCRIBE
              }
              // host tells players start voting for each image
              if (data.gameState === GameState.VOTING) {
                this.audioVolume=0.1;
                this.currentGameState = GameState.TRANSITION
                 // transition states to tell players what is happening
                this.transition = {
                  gameCode: this.gameCode,
                  fromState: GameState.DESCRIBE,
                  ToState:GameState.VOTING
                }
                
                setTimeout(()=>{
                  this.audioVolume=1;
                  this.currentGameState=GameState.VOTING
              
                },10000)
  
              }
              // host tells players the results section
              if (data.gameState === GameState.RESULTS) {
                this.audioVolume=0.1;
                this.currentGameState = GameState.TRANSITION
                 // transition states to tell players what is happening
                this.transition = {
                  gameCode: this.gameCode,
                  fromState: GameState.VOTING,
                  ToState:GameState.RESULTS
                }
              

                setTimeout(()=>{
                  this.audioVolume=1;
                  this.currentGameState=GameState.RESULTS
                 
                  },10000)
                
              }
              // game has ended, go back to dashboard
              if (data.gameState === GameState.FINISHED) {

                this.currentGameState = 'LOADING'
              
                setTimeout(() => {
  
                  this.router.navigate(['/dashboard']);
   
                  
                }, 2000);
              }
            })
          }
        })

      }
    })
  }
  // for when the host clicks on the start or exit button
  processEvent($event:string) {
    if ($event === 'start') {
      this.startGame();
    }
    if ($event === 'exit') {
      this.disconnect()
    }
  }
  // to start the game
  startGame(): void {
    // console.log("game started");
    this.startData = {
      gameCode:this.gameCode,
      gameState:GameState.STARTED
    }  
    // host publish to the backend that the game has started
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,this.startData);
  }
  // for disconnections
  disconnect(): void {

    this.gameNameDetails = {
      gameCode: this.gameCode,
      name: this.username,
      role: "host"
    };
    console.log(this.gameCode)
    // host publish to the backend that the host is disconnecting/exiting
    this.wsService.publish(`/app/disconnect/${this.gameCode}`,this.gameNameDetails)
    this.wsService.disconnect();
    setTimeout(()=>this.router.navigate(['/dashboard']),3000);
  }

  ngOnDestroy(): void {

   

    //clean up subscriptions
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe();
    
    }
    if (this.gameStateSubscription) {
        this.gameStateSubscription.unsubscribe();
    }
    if (this.submissionSubscription) {
        this.submissionSubscription.unsubscribe();
    }

    if (this.gameStoreSubscription) {
        this.gameStoreSubscription.unsubscribe();
    }

    if (this.connectionSub) {
        this.connectionSub.unsubscribe();
    }

    if (this.lobbyUpdatesSub) {
        this.lobbyUpdatesSub.unsubscribe();
    }

    if (this.currentGameStateSub) {
      this.currentGameStateSub.unsubscribe();
    }
      // console.log("lobby destroyed...")
      this.disconnect();
      // this.wsService.disconnect();
    }

  
  
}


