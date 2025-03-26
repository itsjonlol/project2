import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameState, GameStateManager, PlayerSubmission, Submission } from '../../../models/gamemodels';
import { StompSubscription } from '@stomp/stompjs';
import { interval, Observable, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-host-show-drawings',
  providers: [],
  templateUrl: './host-show-drawings.component.html',
  styleUrl: './host-show-drawings.component.css',
  animations:[
    trigger('curtainRise', [
      state('open', style({
        transform: 'translateY(-100%)',
        opacity: 0
      })),
      state('closed', style({
        transform: 'translateY(0%)',
        opacity: 1
      })),
      transition('open <=> closed', [
        animate('2s ease-in-out') 
      ])
    ])
  ]
})
export class HostShowDrawingsComponent implements OnInit ,OnDestroy{
  
  @Input({required:true})
  submissionshow!:Submission 
  
  drawing!:PlayerSubmission;


  wsService = inject(WebSocketService);
  router = inject(Router);
  state!:GameStateManager
  


  gameCode!: number;
  username!:string;

  activatedRoute = inject(ActivatedRoute);

  private gameStateSubscription!: StompSubscription;

  currentIndex:number = 0;
  
  timerSubscription!: Subscription;
  timerDuration:number=30;
  timerCountDown!:number;
  timerSource$:Observable<number> = interval(1000);

  finishedAllDrawings:boolean = false;

  curtainState: 'open' | 'closed' = 'closed'; // make the curtain closed at first

  
  ngOnInit(): void {

    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = sessionStorage.getItem("username") || 'host';
    if (gameCodeParam) {
     
      this.gameCode = +gameCodeParam;
    } 
  
    //connect to websocket
    this.wsService.connect();
    //get current drawing starting from first drawing (index 0)
    this.drawing=this.submissionshow.playerSubmissions[this.currentIndex];
   

  
    setTimeout(()=> {

      // host send the current drawing to the backend 
      this.sendCurrentDrawing();
      
      this.startTimer();
    },3000)
    

  }

  protected startTimer() {
    this.timerSubscription=this.timerSource$.subscribe({
      next: (remaining) => {
        this.timerCountDown = this.timerDuration - remaining;
        if (this.timerCountDown === 4) {
          this.curtainToggle(); // close curtain when 4 seconds left
        }
        if (this.timerCountDown === 0) {
          if  (!this.finishedAllDrawings) {
            this.nextDrawing(); // tell backend to go to the next drawing
            this.resetTimer();
          } else {
            this.stopTimer();
            this.goToResults();
          }
          
        }
      }
    })
  }
  protected stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  protected resetTimer() {
    this.timerCountDown=this.timerDuration;
    this.stopTimer();
    this.startTimer();
  }

  protected nextDrawing() {
     // make curtain fall
     //increment to the next drawing
    this.currentIndex++;
    
    this.drawing = this.submissionshow.playerSubmissions[this.currentIndex];
    this.sendCurrentDrawing();
    const data = {
      gameCode:this.gameCode,
      gameState:GameState.NEXT
    } 
    
    // tell backend the current gamestate
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,data);
    
    if (this.currentIndex === (this.submissionshow.players.length -1)) {
      this.finishedAllDrawings = true;
    }
 
  }
  // host to send to backend about current drawing
  private sendCurrentDrawing() {
    this.curtainToggle(); // make curtain rise
    const currentDrawing = {
      gameCode: this.gameCode,
      currentPlayerName: this.drawing.playerName
    }

    this.wsService.publish(`/app/currentdrawing/${this.gameCode}`,currentDrawing);
  } 
  //host tell backend and players to transition to the next phase, i.e. 
  private goToResults() {
    const data = {
      gameCode:this.gameCode,
      gameState:GameState.RESULTS
    } 
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,data);
  }

  //trigger the curtain animation
  curtainToggle():void {
    if (this.curtainState === 'open') {
      this.curtainState = 'closed'
    } else {
      this.curtainState = 'open'
    }
  }
  //clean up subscriptions
  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
  }

  if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log("✅ Unsubscribed from timerSubscription");
  }
  }
}
