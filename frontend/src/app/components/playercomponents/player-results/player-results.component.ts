import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StompSubscription } from '@stomp/stompjs';
import { WebSocketService } from '../../../services/websocket.service';
import { Submission } from '../../../models/gamemodels';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-results',
  imports: [LottieComponent],
  templateUrl: './player-results.component.html',
  styleUrl: './player-results.component.css'
})
export class PlayerResultsComponent implements OnInit,OnDestroy{
  

  options1: AnimationOptions = {
    path: '/lottiefiles/cryanimation.json',
  };

  options2: AnimationOptions = {
    path:'/lottiefiles/happyanimation.json'
  }

  router = inject(Router);
  
  wsService = inject(WebSocketService);

  activatedRoute = inject(ActivatedRoute);

  username!:string;
  gameCode!:number;
  private gameStateSubscription!: StompSubscription;
  connectionSub!:Subscription

  @Input()
  currentGameState!: string | undefined

  isWinner:boolean = false;

  @Input({required:true})
  submissionresults!:Submission 

  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = sessionStorage.getItem("username") || 'player';
    if (gameCodeParam) {

      this.gameCode = +gameCodeParam;
    }
   
    this.checkIfWinner();
    this.wsService.connect();
  }
  // check if they are a winner
  private checkIfWinner() {
    // ensure that the first person is the winner ( even for case of tied votes )
    this.submissionresults.playerSubmissions.sort((a, b) => b.total - a.total);
    if (this.submissionresults.playerSubmissions[0].playerName === this.username) {
      this.isWinner=true;
    }
  }


  // clean up subscriptions
  ngOnDestroy(): void {

    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    
  }

  if (this.connectionSub) {
      this.connectionSub.unsubscribe();
   
  }
   this.wsService.disconnect();
  }
}
