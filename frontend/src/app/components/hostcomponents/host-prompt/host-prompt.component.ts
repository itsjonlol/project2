import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameState, GameStateManager, Submission } from '../../../models/gamemodels';
import { StompSubscription } from '@stomp/stompjs';
import { interval, Observable, Subscription } from 'rxjs';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { GameRoomPrompt, GameService } from '../../../services/game.service';

@Component({
  selector: 'app-host-prompt',
  imports: [LottieComponent],
  templateUrl: './host-prompt.component.html',
  styleUrl: './host-prompt.component.css'
})
export class HostPromptComponent implements OnInit,OnDestroy{
  // add lottie files
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
  //fallback prompt
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

    this.username = sessionStorage.getItem("username") || 'player';
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
      //get game room prompt once i obtain game code
      this.gamePromptSubscription = this.gameService.getGameRoomPrompt(this.gameCode).subscribe((r:GameRoomPrompt) => {
        // console.log(r)
        this.prompt=r.gamePrompt})
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
       
      }
    })
    //start the timer countdown once connection is established
    setTimeout(()=> {
      this.startTimer();
    },4000)
    
    
  }

  private startTimer() {
    this.timerSubscription = this.timerSource$.subscribe({
      next: (response) => {
        this.timerCountDown  = this.timerDuration -response; // for the 75 second timer

        if (this.timerCountDown===0) {
          if (!this.hasResetOnce) {

            // play the audio telling players to describe their drawings
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
            // console.log("sending describe...")
            //host tells backend that the players are to describe their drawings
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
  // reset timer for describing phase
  private resetTimer() {
    this.stopTimer();
    this.timerDuration = 10;
    this.startTimer();

  }
  // function to go to the next phase i.e. to show the drawings
  showDrawings() {
    this.state = {
      gameCode: this.gameCode,
      gameState : GameState.VOTING
    }
    // send to backend that we are now going to the voting phase
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,this.state);
  }
  
  //clean up subscriptions
  ngOnDestroy(): void {
  
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    
  }

  if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
  }

 
  if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    
  }

  if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
  }

  if (this.gamePromptSubscription) {
    this.gamePromptSubscription.unsubscribe();
  }


  }
  playVoice(): void {
   // play the description audio

    if (this.playSound) {
        this.audio.currentTime = 0; // Reset to the beginning
        this.audio.load();
        this.audio.play().catch((err: any) => console.error("Error playing audio:", err));
    } else {
        this.audio.pause();
    }
}


}


  

  

 