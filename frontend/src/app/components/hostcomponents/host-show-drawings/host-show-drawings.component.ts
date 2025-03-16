import { Component, inject, Input, input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameState, GameStateManager, PlayerSubmission, Submission } from '../../../models/gamemodels';
import { StompSubscription } from '@stomp/stompjs';
import { JsonPipe } from '@angular/common';
import { interval, Observable, Subject, Subscription, timer } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-host-show-drawings',
  imports: [JsonPipe],
  providers: [],
  templateUrl: './host-show-drawings.component.html',
  styleUrl: './host-show-drawings.component.css',
  animations:[
    trigger('curtainRise', [
      state('open', style({
        transform: 'translateY(-100%)', // Curtain moves up
        opacity: 0
      })),
      state('closed', style({
        transform: 'translateY(0%)', // Curtain covers the content
        opacity: 1
      })),
      transition('open => closed', [
        animate('2s ease-in-out') // Curtain closes (moves down)
      ]),
      transition('closed => open', [
        animate('2s ease-in-out') // Curtain opens (moves up)
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
  

  // @Output()
  // emitResetVote = new Subject<boolean>();

  timerSubscription!: Subscription;
  timerCountDown:number = 10;
  timerSource$:Observable<number> = interval(1000);

  finishedAllDrawings:boolean = false;

  // curtainState: 'open' | 'closed' = 'open';
  curtainState: 'open' | 'closed' = 'closed';

  
  ngOnInit(): void {

    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = localStorage.getItem("username") || 'player';
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
    } else {
      console.error('Game code not found in route parameters.');
    }

    this.wsService.connect();
    this.drawing=this.submissionshow.playerSubmissions[this.currentIndex];
    //COMMENT IN
    // this.sendCurrentDrawing();

    //COMMENT OUT
    setTimeout(()=> {
      this.sendCurrentDrawing();
      
      this.startTimer();
    },3000)
    

  }

  protected startTimer() {
    this.timerSubscription=this.timerSource$.subscribe({
      next: (remaining) => {
        this.timerCountDown = 10 - remaining;
        if (this.timerCountDown === 4) {
          this.curtainToggle(); // close when 4 seconds left
        }

        if (this.timerCountDown === 0) {
          if  (!this.finishedAllDrawings) {
            this.nextDrawing();
          
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
    this.timerCountDown=10;
    this.stopTimer();
    this.startTimer();
  }

  protected nextDrawing() {
     // make curtain fall
    this.currentIndex++;
    
    this.drawing = this.submissionshow.playerSubmissions[this.currentIndex];
    this.sendCurrentDrawing();
    const data = {
      gameCode:this.gameCode,
      gameState:GameState.NEXT
    } 
    
  
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,data);
    

    if (this.currentIndex === (this.submissionshow.players.length -1)) {
      this.finishedAllDrawings = true;
    }
    // this.emitResetVote.next(true);
  }

  private sendCurrentDrawing() {
    this.curtainToggle(); // make curtain rise
    const currentDrawing = {
      gameCode: this.gameCode,
      currentPlayerName: this.drawing.playerName
    }
    this.wsService.publish(`/app/currentdrawing/${this.gameCode}`,currentDrawing);
  }

  private goToResults() {
    const data = {
      gameCode:this.gameCode,
      gameState:GameState.RESULTS
    } 
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,data);
  }

  curtainToggle():void {
    if (this.curtainState === 'open') {
      this.curtainState = 'closed'
    } else {
      this.curtainState = 'open'
    }
  }

  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
      console.log("✅ Unsubscribed from gameStateSubscription");
  }

  // ✅ Unsubscribe from timerSubscription
  if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log("✅ Unsubscribed from timerSubscription");
  }
  }
}
