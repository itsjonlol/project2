import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StompSubscription } from '@stomp/stompjs';
import { WebSocketService } from '../../../services/websocket.service';
import { GameState, PlayerSubmission, Submission } from '../../../models/gamemodels';

@Component({
  selector: 'app-host-results',
  imports: [],
  templateUrl: './host-results.component.html',
  styleUrl: './host-results.component.css'
})
export class HostResultsComponent implements OnInit,OnDestroy {
  router = inject(Router);
  
  wsService = inject(WebSocketService);

  activatedRoute = inject(ActivatedRoute);

  username!:string;
  gameCode:number= 0;
  private gameStateSubscription!: StompSubscription;

  @Input({required:true})
  submissionresults!: Submission

  drawings:PlayerSubmission[] =[]
  

  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = sessionStorage.getItem("username") || 'player';
 
    if (gameCodeParam) {
      this.gameCode = +gameCodeParam;
    } 
   

    //sort to get the winner
    //for now first person with highest vote is winner even if there is tied vote
    this.drawings = this.submissionresults.playerSubmissions;
    this.submissionresults.playerSubmissions.sort((a, b) => b.total - a.total);
    this.wsService.connect();
  }
  // to end the game
  endGame():void {
    const data = {
      gameCode:this.gameCode,
      gameState:GameState.FINISHED
    } 
    // tell backend i am ending the game
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,data);
  }
  // get the mascot for each player
  getPlayerMascot(playerName: string): string | undefined {
    const player = this.submissionresults.players.find(p => p.name === playerName);
    return player?.mascot
  }
  
  // disconnect the websocket service on destroy
  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
  }
    this.wsService.disconnect();
   }
}
