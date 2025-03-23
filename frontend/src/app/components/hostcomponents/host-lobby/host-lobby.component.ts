import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ImageData } from '../../../models/image-data'; // Import class
import { ActivatedRoute, Router } from '@angular/router';
import { GameRoomResponse, GameService } from '../../../services/game.service';
import { GameNameDetails,GameSession, GameState, GameStateManager, Player, Submission, Transition } from '../../../models/gamemodels';
import { Stomp, StompSubscription } from '@stomp/stompjs';
import { HostPromptComponent } from "../host-prompt/host-prompt.component";
import { GameStateService } from '../../../services/gamestate.service';
import { HostPlayerVotesComponent } from '../host-player-votes/host-player-votes.component';
import { HostShowDrawingsComponent } from '../host-show-drawings/host-show-drawings.component';
import { HostResultsComponent } from '../host-results/host-results.component';
import { AudioComponent } from "../../extcomponents/audio/audio.component";
import { HostTransitionComponent } from '../host-transition/host-transition.component';
import { HostWaitingRoomComponent } from "../host-waiting-room/host-waiting-room.component";
import { GameStore } from '../../../store/GameStore.store';
import { QrcodeComponent } from "../../extcomponents/qrcode/qrcode.component";

@Component({
  selector: 'app-host-lobby',
  standalone:true,
  imports: [CommonModule, NgFor, HostPromptComponent, HostPlayerVotesComponent, HostShowDrawingsComponent, HostResultsComponent, AudioComponent, HostTransitionComponent, HostWaitingRoomComponent, AsyncPipe, AudioComponent, QrcodeComponent],
  templateUrl: './host-lobby.component.html',
  styleUrl: './host-lobby.component.css'
})


export class HostLobbyComponent implements OnInit ,OnDestroy{



  images: ImageData[] = [];
  gameCode: number = 0;
  gamePrompt!:string


  username: string = '';
  players: Player[] = [];

  activatedRoute = inject(ActivatedRoute);


  randomData:any; // to change
  
  private connectionSub!: Subscription;
  private lobbyUpdatesSub!: Subscription;

  gameService = inject(GameService);

  gameRoomResponse?: GameRoomResponse

  gameStarted:boolean=false

  gameNameDetails!:GameNameDetails

  // gameStateManagerService = inject(GameStateService)

  currentGameState:string|null ='' 
  gameStore = inject(GameStore);
  storeGameState$!: Observable<string | null>
  
  gameRoomState$!: Observable<GameStateManager>;
  submission!:Submission

//   submission:Submission = {
//     gameCode: 2,
//     gamePrompt: 'test string',
//     players: [
//         { name: "jon1", vote: 0, mascot: "/mascot/mascot1.svg" },
//         { name: "jon2", vote: 0, mascot: "/mascot/mascot1.svg" },
//         { name: "jon3", vote: 0, mascot: "/mascot/mascot1.svg" },
//         { name: "jon4", vote: 0, mascot: "/mascot/mascot1.svg" }
//     ],
//     playerSubmissions: [
//         {
//             userId: "jon1",
//             playerName: "jon1",
//             title: "title1",
//             description: "description1",
//             aiComments: "aicomments1",
//             imageUrl: "https://artistick.sgp1.digitaloceanspaces.com/ec1306ad_canvas-image.png",
//             total: 0,
//             isWinner: false
//         },
//         {
//             userId: "jon2",
//             playerName: "jon2",
//             title: "title2",
//             description: "description2",
//             aiComments: "aicomments2",
//             imageUrl: "https://artistick.sgp1.digitaloceanspaces.com/2c2d0bb7_canvas-image.png",
//             total: 0,
//             isWinner: false
//         },
//         {
//             userId: "jon3",
//             playerName: "jon3",
//             title: "title3",
//             description: "description3",
//             aiComments: "aicomments3",
//             imageUrl: "https://artistick.sgp1.digitaloceanspaces.com/dc1a312c_canvas-image.png",
//             total: 0,
//             isWinner: false
//         },
//         {
//             userId: "jon4",
//             playerName: "jon4",
//             title: "title4",
//             description: "description4",
//             aiComments: "aicomments4",
//             imageUrl: "https://artistick.sgp1.digitaloceanspaces.com/b4eb2a7f_canvas-image.png",
//             total: 0,
//             isWinner: false
//         }
//     ]
// };

  submissionSubscription!:StompSubscription;

  playSound:boolean = false;

  gameStoreSubscription!: Subscription

  // isTransition:boolean=false;
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
    // Assume the host's username is stored in localStorage (set after Google OAuth)
    this.username = localStorage.getItem('username') || 'Host';
    
    this.wsService.connect();
    

    this.activatedRoute.params.subscribe({
      next: (params) => {
        // this.gameRoomResponse = response;
        // this.gameCode = this.gameRoomResponse.gameCode;
        this.gameCode = parseInt(params['gameCode']);
       
       
        // this.holdGameCode = this.gameCode;

        // trial
        
        // this.router.navigate([`/host/lobby/${this.gameCode}`]);
        // this.gameService.getGameRoomState(this.gameCode).subscribe(d=>this.currentGameState=d.gameState)
      
        
        
       this.connectionSub= this.wsService.isConnected$.subscribe((isConnected) => {
          if (isConnected) {
            
            this.wsService.publish(`/app/initialisegame/${this.gameCode}`, { gameCode: this.gameCode });
            
            // this.gameStore.getGameStateForRoom(this.gameCode);
            // this.storeGameState$= this.gameStore.selectGameState(this.gameCode);
            // this.storeGameState$.subscribe((gameCode) => console.log( "subscribed observable is.. " + gameCode))
            
           
            this.currentGameStateSub = this.gameService.getGameRoomState(this.gameCode).subscribe(d=>this.currentGameState=d.gameState)
            // this.storeGameState$ = this.gameStore.selectGameState(this.gameCode);
            // this.gameStoreSubscription =  this.gameStore.selectGameState(this.gameCode).subscribe(d => this.currentGameState = d);
            
            //game store
            
            
            
            
            
            
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
            
          //   this.gameStateManagerService.gameStateManager$.subscribe(d=>{
          //     this.currentGameState = d?.gameState
          // })
            // this.gameService.getGameRoomState(this.gameCode).subscribe(d=> this.currentGameState=d.gameState)
            this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
              console.log(message.body);

              const data = JSON.parse(message.body);
              
              if (data.gameState === GameState.STARTED) {
              
                this.currentGameState = GameState.TRANSITION


                // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.TRANSITION})
               
                this.transition = {
                  gameCode: this.gameCode,
                  fromState: GameState.QUEUING,
                  ToState:GameState.STARTED
                }
                // this.gameStore.updateGameState(GameState.TRANSITION);

               
                setTimeout(()=>{
                  this.currentGameState = GameState.STARTED
                  // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.STARTED})
                  // this.gameStore.updateGameState(GameState.STARTED);
                },10000)
                // this.currentGameState = GameState.STARTED
                // this.gameStarted=true;
                // this.router.navigate(['host','prompt',this.gameCode])
              }
              if (data.gameState === GameState.DESCRIBE){
                this.currentGameState = GameState.DESCRIBE
                // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.DESCRIBE})
                // this.gameStore.updateGameState(GameState.DESCRIBE);
              }

              if (data.gameState === GameState.VOTING) {
                this.currentGameState = GameState.TRANSITION

                this.transition = {
                  gameCode: this.gameCode,
                  fromState: GameState.DESCRIBE,
                  ToState:GameState.VOTING
                }

                // this.gameStore.updateGameState(GameState.TRANSITION);
                // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.TRANSITION})
                

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

                this.transition = {
                  gameCode: this.gameCode,
                  fromState: GameState.VOTING,
                  ToState:GameState.RESULTS
                }
                // this.gameStore.updateGameState(GameState.TRANSITION);
                

                setTimeout(()=>{
                  this.currentGameState=GameState.RESULTS
                  // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.RESULTS})
                  // this.gameStore.updateGameState(GameState.RESULTS);
                  },10000)

                // setTimeout(()=>this.currentGameState=GameState.RESULTS,2000)
                
              }
              

              if (data.gameState === GameState.FINISHED) {

                this.currentGameState = GameState.FINISHED
                // this.gameStore.updateGameState({gameCode:this.gameCode,gameState: GameState.FINISHED})
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

  processEvent($event:string) {
    if ($event === 'start') {
      this.startGame();
    }
    if ($event === 'exit') {
      this.disconnect()
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
      console.log("✅ Unsubscribed from playerSubscription");
  }
  if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
      console.log("✅ Unsubscribed from gameStateSubscription");
  }
  if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
      console.log("✅ Unsubscribed from submissionSubscription");
  }

  // ✅ Unsubscribe from gameStore state subscription
  if (this.gameStoreSubscription) {
      this.gameStoreSubscription.unsubscribe();
      console.log("✅ Unsubscribed from gameStoreSubscription");
  }

  // ✅ Unsubscribe from WebSocket connection observable
  if (this.connectionSub) {
      this.connectionSub.unsubscribe();
      console.log("✅ Unsubscribed from connectionSub");
  }

  // ✅ Unsubscribe from ActivatedRoute params
  if (this.lobbyUpdatesSub) {
      this.lobbyUpdatesSub.unsubscribe();
      console.log("✅ Unsubscribed from lobbyUpdatesSub (ActivatedRoute params)");
  }

  if (this.currentGameStateSub) {
    this.currentGameStateSub.unsubscribe();
  }
    console.log("lobby destroyed...")
    
    this.wsService.disconnect();
  }

  
  
}


