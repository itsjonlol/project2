import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StompSubscription } from '@stomp/stompjs';
import { WebSocketService } from '../../services/websocket.service';
import { GameState, PlayerSubmission, Submission } from '../../models/gamemodels';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-host-results',
  imports: [JsonPipe],
  templateUrl: './host-results.component.html',
  styleUrl: './host-results.component.css'
})
export class HostResultsComponent implements OnInit,OnDestroy {
  router = inject(Router);
  
  wsService = inject(WebSocketService);

  activatedRoute = inject(ActivatedRoute);

  username!:string;
  gameCode!:number;
  private gameStateSubscription!: StompSubscription;

  @Input({required:true})
  submission:Submission = {
    gameCode: 0,
    players: [],
    playerSubmissions: []
  }

  drawings:PlayerSubmission[] =[]
  

  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = localStorage.getItem("username") || 'player';
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
    } else {
      console.error('Game code not found in route parameters.');
    }

    this.drawings = this.submission.playerSubmissions;
    this.submission.playerSubmissions.sort((a, b) => b.total - a.total);
    this.wsService.connect();
  }

  endGame():void {
    const data = {
      gameCode:this.gameCode,
      gameState:GameState.FINISHED
    } 
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,data);
  }

  ngOnDestroy(): void {
    this.wsService.disconnect();
   }
}
