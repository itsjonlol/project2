import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StompSubscription } from '@stomp/stompjs';
import { WebSocketService } from '../../../services/websocket.service';
import { Submission } from '../../../models/gamemodels';
import { JsonPipe } from '@angular/common';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-results',
  imports: [JsonPipe,LottieComponent],
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
    this.username = localStorage.getItem("username") || 'player';
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
    } else {
      console.error('Game code not found in route parameters.');
    }
    this.checkIfWinner();
    this.wsService.connect();
  }

  private checkIfWinner() {
    this.submissionresults.playerSubmissions.sort((a, b) => b.total - a.total);
    if (this.submissionresults.playerSubmissions[0].playerName === this.username) {
      this.isWinner=true;
    }
  }

  // ngOnChanges():void {
  //   if (this.currentGameState==="FINISHED") {
  //       this.wsService.disconnect();
        
  //       setTimeout(()=>this.router.navigate(["dashboard"]),2000);
  //   }
  // }

  ngOnDestroy(): void {

    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
      console.log("✅ Unsubscribed from gameStateSubscription");
  }

  // ✅ Unsubscribe from WebSocket connection observable
  if (this.connectionSub) {
      this.connectionSub.unsubscribe();
      console.log("✅ Unsubscribed from WebSocket isConnected$");
  }
   this.wsService.disconnect();
  }
}
