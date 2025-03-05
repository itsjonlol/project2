import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../../../services/websocket.service';
import { StompSubscription } from '@stomp/stompjs';
import { GameState, Player, Submission } from '../../../models/gamemodels';
import { JsonPipe } from '@angular/common';
import { PlayerResultsComponent } from '../player-results/player-results.component';

@Component({
  selector: 'app-player-vote-input',
  imports: [JsonPipe,PlayerResultsComponent],
  templateUrl: './player-vote-input.component.html',
  styleUrl: './player-vote-input.component.css'
})
export class PlayerVoteInputComponent implements OnInit,OnDestroy{

  router = inject(Router);
  
  wsService = inject(WebSocketService);

  activatedRoute = inject(ActivatedRoute);

  username!:string;
  gameCode!:number;
  private gameStateSubscription!: StompSubscription;
  private submissionSubscription!: StompSubscription;
  private gameDrawingSubscription!: StompSubscription;
  playerVote!:Player

  writeDescriptionMode:boolean = false;

  submission!:Submission

  currentPlayerName:string="idk"

  displayResults:boolean = false;
  
  @Input()
  currentGameState!: string | undefined

  hasVoted:boolean=false;

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
    this.wsService.isConnected$.subscribe((isConnected)=>{
      if (isConnected) {
        this.gameDrawingSubscription=this.wsService.client.subscribe(`/topic/currentdrawing/${this.gameCode}`, (message) => {
          console.log(message.body)

          const data = JSON.parse(message.body);
          
          this.currentPlayerName = data.currentPlayerName;
          this.hasVoted=false;
          
         })


        //  this.submissionSubscription=this.wsService.client.subscribe(`/topic/submission/${this.gameCode}`,(message) => {
        //   console.log(message.body)

        //   const data = JSON.parse(message.body);
        //   const players = data.players;
        //   const playerSubmissions = data.playerSubmissions;
        //   this.submission = {
        //     gameCode:this.gameCode,
        //     players:players,
        //     playerSubmissions:playerSubmissions
        //   }

        
        //  })

         this.gameStateSubscription= this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`,(message) => {
          console.log(message.body)

          const data = JSON.parse(message.body);

          // if (data.gameState === GameState.RESULTS ) {
          //   // this.router.navigate(['player','results',this.gameCode])
           
          //   setTimeout(()=>this.displayResults=true,3000);
          // }

          // if (data.gameState === GameState.FINISHED) {
            
          //   this.wsService.disconnect();
          //   setTimeout(()=>this.router.navigate(["dashboard"]),2000);
          // }

         })
      }


    })
    
  }

  processVote(voteString : string) {
    this.hasVoted=true;
    this.playerVote = {
      name: this.username,
      vote: parseInt(voteString)
    }
    const data = {
      gameCode: this.gameCode,
      ...this.playerVote,
      currentPlayerName: this.currentPlayerName
    }
      
      this.wsService.publish(`/app/playervote/${this.gameCode}`,data);

    // this.playerVote.vote = 0;
  }
  
  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }

    if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
    }
    if (this.gameDrawingSubscription) {
      this.gameDrawingSubscription.unsubscribe();
    }
  }
}
