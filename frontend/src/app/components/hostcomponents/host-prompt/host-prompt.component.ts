import { Component, inject, Input, input, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameState, GameStateManager, Submission } from '../../../models/gamemodels';
import { StompSubscription } from '@stomp/stompjs';
import { HostShowDrawingsComponent } from '../host-show-drawings/host-show-drawings.component';
import { HostPlayerVotesComponent } from '../host-player-votes/host-player-votes.component';
import { interval, map, Observable, Subscription, timer } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { HostResultsComponent } from '../host-results/host-results.component';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { GameRoomPrompt, GameService } from '../../../services/game.service';

@Component({
  selector: 'app-host-prompt',
  imports: [HostShowDrawingsComponent,HostPlayerVotesComponent,HostResultsComponent,JsonPipe,LottieComponent],
  templateUrl: './host-prompt.component.html',
  styleUrl: './host-prompt.component.css'
})
export class HostPromptComponent implements OnInit,OnDestroy{

  options1: AnimationOptions = {
    path: '/lottiefiles/animation3.json',
  };
  options2: AnimationOptions = {
    path: '/lottiefiles/write.json',
  };


  wsService = inject(WebSocketService);
  router = inject(Router);
  state!:GameStateManager
  gameService = inject(GameService);
  prompt:string = "SKETCH A UFO"
  
  

  @Input()
  currentGameState!:string | null

  gameCode!: number;
  username!:string;

  activatedRoute = inject(ActivatedRoute);

  private gamePromptSubscription!: Subscription;
  private gameStateSubscription!: StompSubscription;
  private submissionSubscription!: StompSubscription;
  isDrawing:boolean = true;

  @Input()
  submission!:Submission

  displayResults:boolean=false;

  timerSubscription!: Subscription;
  timerCountDown!:number;
  timerDuration:number=5;
  timerSource$:Observable<number> = interval(1000);
  hasResetOnce:boolean=false;
  connectionSub!: Subscription


  audioSrc!:string;
  audio!:any;
  playSound:boolean = false;
  

  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');



    this.username = localStorage.getItem("username") || 'player';
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
      this.gamePromptSubscription = this.gameService.getGameRoomPrompt(this.gameCode).subscribe((r:GameRoomPrompt) => {
        console.log(r)
        this.prompt=r.gamePrompt})
    } else {
      console.error('Game code not found in route parameters.');
    }
    this.submission = {
      gameCode:this.gameCode,
      players:[],
      playerSubmissions:[]
    }
    // this.wsService.connect();
    this.connectionSub= this.wsService.isConnected$.subscribe((isConnected) => {
      if (isConnected) {
        console.log("Websocket connected");
        if (this.gameStateSubscription) {
          this.gameStateSubscription.unsubscribe();
        }

        // this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
        //   console.log(message.body);

          
        //   // if (data.gameState === GameState.VOTING) {
        //   //   // console.log(true);
        //   //   // this.router.navigate(['host','showdrawings',this.gameCode])
        //   //   // this.isDrawing = false;

        //   //   //TO COMMENT OUT
        //   //   setTimeout(()=>this.isDrawing=false,6000);
        //   // } 
        //   // if (data.gameState === GameState.RESULTS) {
        //   //   // this.router.navigate(['host','results',this.gameCode])
    
        //   //   setTimeout(()=>this.displayResults=true,2000);
        //   // }
        //   // if (data.gameState === GameState.FINISHED) {
        //   //   setTimeout(()=>this.router.navigate(["dashboard"]));
        //   //   this.wsService.disconnect();
        //   // }
          
         
        // })
        
        // // if (this.submissionSubscription) {
        // //   this.submissionSubscription.unsubscribe();
        // // }

        // this.submissionSubscription=this.wsService.client.subscribe(`/topic/submission/${this.gameCode}`, (message) => {
        //   console.log(message.body)

        //   // const data = JSON.parse(message.body);
        //   // const players = data.players;
        //   // const playerSubmissions = data.playerSubmissions;
        //   // this.submission = {
        //   //   gameCode:this.gameCode,
        //   //   players:players,
        //   //   playerSubmissions:playerSubmissions
        //   // }
 
        //  })
        
      }
    })
    setTimeout(()=> {
      this.startTimer();
    },4000)
    
    
  }

 

  private startTimer() {
    this.timerSubscription = this.timerSource$.subscribe({
      next: (response) => {
        this.timerCountDown  = this.timerDuration -response;

        if (this.timerCountDown===0) {
          if (!this.hasResetOnce) {

            //audio

            this.audioSrc='/music/t2.mp3';
            this.audio = new Audio(this.audioSrc);
            this.playSound = true;
            this.playVoice();

            this.resetTimer();
            this.hasResetOnce=true;
            const data = {
              gameCode: this.gameCode,
              gameState : GameState.DESCRIBE
            }
            console.log("sending describe...")
            this.wsService.publish(`/app/gamestate/${this.gameCode}`,data);
          } else {
            this.stopTimer();
            this.showDrawings();
            
          }
      
        }
      }
    })
  }
  private stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

  }

  private resetTimer() {
    this.stopTimer();
    this.timerDuration = 5;
    this.startTimer();

  }
  showDrawings() {
    this.state = {
      gameCode: this.gameCode,
      gameState : GameState.VOTING
    }
  
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,this.state);
  }
  
  ngOnDestroy(): void {
    // setTimeout(()=>this.isDrawing=false,6000);
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
      console.log("✅ Unsubscribed from gameStateSubscription");
  }

  // ✅ Unsubscribe from submissionSubscription
  if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
      console.log("✅ Unsubscribed from submissionSubscription");
  }

  // ✅ Unsubscribe from WebSocket connection observable
  if (this.connectionSub) {
      this.connectionSub.unsubscribe();
      console.log("✅ Unsubscribed from WebSocket isConnected$");
  }

  // ✅ Unsubscribe from timerSubscription
  if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log("✅ Unsubscribed from timerSubscription");
  }

  if (this.gamePromptSubscription) {
    this.gamePromptSubscription.unsubscribe();
  }

    console.log("prompt destroyed")
    // this.wsService.disconnect();
    
  }
  playVoice(): void {
    // this.playSound = !this.playSound;

    if (this.playSound) {
        this.audio.currentTime = 0; // Reset to the beginning
        this.audio.load();
        this.audio.play().catch((err: any) => console.error("Error playing audio:", err));
    } else {
        this.audio.pause();
    }
}


}


  

  

 