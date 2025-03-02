import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StompSubscription } from '@stomp/stompjs';
import { WebSocketService } from '../../../services/websocket.service';
import { Submission } from '../../../models/gamemodels';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-player-results',
  imports: [JsonPipe],
  templateUrl: './player-results.component.html',
  styleUrl: './player-results.component.css'
})
export class PlayerResultsComponent implements OnInit,OnDestroy{
  

  router = inject(Router);
  
  wsService = inject(WebSocketService);

  activatedRoute = inject(ActivatedRoute);

  username!:string;
  gameCode!:number;
  private gameStateSubscription!: StompSubscription;

  isWinner:boolean = false;

  @Input({required:true})
  submission:Submission = {
    gameCode: 0,
    players: [],
    playerSubmissions: []
  }

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
    
    if (this.submission.playerSubmissions[0].playerName === this.username) {
      this.isWinner=true;
    }
  }

  ngOnDestroy(): void {
   this.wsService.disconnect();
  }
}
