import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameState, GameStateManager, Submission } from '../../models/gamemodels';
import { StompSubscription } from '@stomp/stompjs';
import { HostShowDrawingsComponent } from '../host-show-drawings/host-show-drawings.component';
import { HostPlayerVotesComponent } from '../host-player-votes/host-player-votes.component';
import { interval, map, Observable, Subscription, timer } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { HostResultsComponent } from '../host-results/host-results.component';

@Component({
  selector: 'app-host-prompt',
  imports: [HostShowDrawingsComponent,HostPlayerVotesComponent,HostResultsComponent,JsonPipe],
  templateUrl: './host-prompt.component.html',
  styleUrl: './host-prompt.component.css'
})
export class HostPromptComponent implements OnInit,OnDestroy{

  


  wsService = inject(WebSocketService);
  router = inject(Router);
  state!:GameStateManager
  

  gameCode!: number;
  username!:string;

  activatedRoute = inject(ActivatedRoute);

  private gameStateSubscription!: StompSubscription;
  private submissionSubscription!: StompSubscription;
  isDrawing:boolean = true;

  submission!:Submission

  displayResults:boolean=false;

  timerSubscription!: Subscription;
  timerCountDown!:number;
  timerDuration:number=10;
  timerSource$:Observable<number> = interval(1000);
  hasResetOnce:boolean=false;
  

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
    this.wsService.isConnected$.subscribe((isConnected) => {
      if (isConnected) {
        console.log("Websocket connected");

        this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
          console.log(message.body);

          const data = JSON.parse(message.body);
          
          if (data.gameState === GameState.VOTING) {
            // console.log(true);
            // this.router.navigate(['host','showdrawings',this.gameCode])
            // this.isDrawing = false;

            //TO COMMENT OUT
            setTimeout(()=>this.isDrawing=false,6000);
          } 
          if (data.gameState === GameState.RESULTS) {
            // this.router.navigate(['host','results',this.gameCode])
    
            setTimeout(()=>this.displayResults=true,2000);
          }
          if (data.gameState === GameState.FINISHED) {
            setTimeout(()=>this.router.navigate(["dashboard"]));
            this.wsService.disconnect();
          }
          
         
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
            this.resetTimer();
            this.hasResetOnce=true;
            const data = {
              gameCode: this.gameCode,
              gameState : GameState.DESCRIBE
            }
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
    this.timerCountDown = this.timerDuration;
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
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
    }
    this.wsService.disconnect();
    
  }


}
