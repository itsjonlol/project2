import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { CommonModule, NgFor } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ImageData } from '../../../models/image-data'; // Import class
import { Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { GameNameDetails, GameRoomResponse, GameSession, GameState, GameStateManager, Player, Submission, Transition } from '../../../models/gamemodels';
import { Stomp, StompSubscription } from '@stomp/stompjs';
import { HostPromptComponent } from "../host-prompt/host-prompt.component";
import { GameStateService } from '../../../services/gamestate.service';
import { HostPlayerVotesComponent } from '../host-player-votes/host-player-votes.component';
import { HostShowDrawingsComponent } from '../host-show-drawings/host-show-drawings.component';
import { HostResultsComponent } from '../host-results/host-results.component';
import { AudioComponent } from "../../extcomponents/audio/audio.component";
import { HostTransitionComponent } from '../host-transition/host-transition.component';

@Component({
  selector: 'app-host-lobby',
  standalone:true,
  imports: [CommonModule, NgFor, HostPromptComponent, HostPlayerVotesComponent, HostShowDrawingsComponent, HostResultsComponent, AudioComponent,HostTransitionComponent],
  templateUrl: './host-lobby.component.html',
  styleUrl: './host-lobby.component.css'
})


export class HostLobbyComponent implements OnInit ,OnDestroy{


  images: ImageData[] = [];
  gameCode: number = 0;


  username: string = '';
  players: Player[] = [];


  randomData:any; // to change
  
  private connectionSub!: Subscription;
  private lobbyUpdatesSub!: Subscription;

  gameService = inject(GameService);

  gameRoomResponse?: GameRoomResponse

  gameStarted:boolean=false

  gameNameDetails!:GameNameDetails

  // gameStateManagerService = inject(GameStateService)

  currentGameState:string|undefined ='' 
  
  gameRoomState$!: Observable<GameStateManager>;

  submission!:Submission;

  submissionSubscription!:StompSubscription;

  playSound:boolean = false;

  // isTransition:boolean=false;
  transition!:Transition

  


  constructor(private wsService: WebSocketService,private ngZone: NgZone,private router: Router) {}
  
  private playerSubscription!: StompSubscription;
  private gameStateSubscription!: StompSubscription;
  private disconnectionSubscription!: StompSubscription;

  ngOnInit(): void {
    // Assume the host's username is stored in localStorage (set after Google OAuth)
    this.username = localStorage.getItem('username') || 'Host';
    this.wsService.connect();
    

    this.gameService.getGameRoom().subscribe({
      next: (response:GameRoomResponse) => {
        this.gameRoomResponse = response;
        this.gameCode = this.gameRoomResponse.gameCode;
        // this.holdGameCode = this.gameCode;

        // trial
        
        this.router.navigate([`/host/lobby/${this.gameCode}`]);
        this.gameService.getGameRoomState(this.gameCode).subscribe(d=>this.currentGameState=d.gameState)
      
        
        
        this.wsService.isConnected$.subscribe((isConnected) => {
          if (isConnected) {
            this.wsService.publish(`/app/initialisegame/${this.gameCode}`, { gameCode: this.gameCode });
            
            
            // this.gameStateManagerService.setGameState(this.gameCode,GameState.QUEUING)
            
            this.playerSubscription = this.wsService.client.subscribe(`/topic/players/${this.gameCode}`, (message) => {
              console.log(message.body);
              const data = JSON.parse(message.body);
              this.players = data.players;
            })

            this.submissionSubscription=this.wsService.client.subscribe(`/topic/submission/${this.gameCode}`, (message) => {
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
            
          //   this.gameStateManagerService.gameStateManager$.subscribe(d=>{
          //     this.currentGameState = d?.gameState
          // })
            // this.gameService.getGameRoomState(this.gameCode).subscribe(d=> this.currentGameState=d.gameState)
            this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
              console.log(message.body);

              const data = JSON.parse(message.body);
              
              if (data.gameState === GameState.STARTED) {
                this.currentGameState = GameState.TRANSITION
                this.transition = {
                  gameCode: this.gameCode,
                  fromState: GameState.QUEUING,
                  ToState:GameState.STARTED
                }
                
                setTimeout(()=>{
                  this.currentGameState = GameState.STARTED
                },10000)
                // this.currentGameState = GameState.STARTED
                // this.gameStarted=true;
                // this.router.navigate(['host','prompt',this.gameCode])
              }
              if (data.gameState === GameState.DESCRIBE){
                this.currentGameState = GameState.DESCRIBE
              }

              if (data.gameState === GameState.VOTING) {
                this.currentGameState = GameState.TRANSITION
                this.transition = {
                  gameCode: this.gameCode,
                  fromState: GameState.DESCRIBE,
                  ToState:GameState.VOTING
                }

                setTimeout(()=>this.currentGameState=GameState.VOTING,10000)
                // this.currentGameState = GameState.VOTING
              }

              if (data.gameState === GameState.RESULTS) {

                this.currentGameState = GameState.TRANSITION
                this.transition = {
                  gameCode: this.gameCode,
                  fromState: GameState.VOTING,
                  ToState:GameState.RESULTS
                }

                setTimeout(()=>this.currentGameState=GameState.RESULTS,10000)

                // setTimeout(()=>this.currentGameState=GameState.RESULTS,2000)
                
              }
              

              if (data.gameState === GameState.FINISHED) {
                
              
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
  
  audio = new Audio('/music/track1.mp3'); // Create the audio object once

  playMusic(): void {
      this.playSound = !this.playSound;
  
      if (this.playSound) {
          this.audio.currentTime = 0; // Reset to the beginning
          this.audio.load();
          this.audio.play().catch(err => console.error("Error playing audio:", err));
      } else {
          this.audio.pause();
      }
  }

  startGame(): void {
    console.log("game started");
    this.randomData = {
      gameCode:this.gameCode,
      gameState:GameState.STARTED
    }  
    // this.gameStateManagerService.setGameState(this.gameCode,GameState.STARTED)
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,this.randomData);
  }

  disconnect(): void {

    this.gameNameDetails = {
      gameCode: this.gameCode,
      name: this.username,
      role: "host"
    };
    console.log(this.gameCode)
    this.wsService.publish(`/app/disconnect/${this.gameCode}`,this.gameNameDetails)
    this.wsService.disconnect();
    setTimeout(()=>this.router.navigate(['/dashboard']),3000);
  }

  ngOnDestroy(): void {

    this.gameNameDetails = {
      gameCode: this.gameCode,
      name: this.username,
      role: "host"
    };
    this.wsService.publish(`/app/disconnect/${this.gameCode}`,this.gameNameDetails)
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe(); 
    }
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
    }
    console.log("lobby destroyed...")
    
    this.wsService.disconnect();
  }
  
}


