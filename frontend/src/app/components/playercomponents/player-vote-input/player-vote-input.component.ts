import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../../../services/websocket.service';
import { StompSubscription } from '@stomp/stompjs';
import { GameState, Player, Submission } from '../../../models/gamemodels';
import { JsonPipe } from '@angular/common';
import { PlayerResultsComponent } from '../player-results/player-results.component';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-player-vote-input',
  imports: [JsonPipe,PlayerResultsComponent,ReactiveFormsModule],
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

  connectionSub!: Subscription
  
  @Input()
  currentGameState!: string | undefined

  hasVoted:boolean=false;


  private fb = inject(FormBuilder);

  protected form!: FormGroup

  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = localStorage.getItem("username") || 'player';
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
    } else {
      console.error('Game code not found in route parameters.');
    }
    this.form = this.createForm();

    this.wsService.connect();
    this.connectionSub = this.wsService.isConnected$.subscribe((isConnected)=>{
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

  createForm():FormGroup {
    return this.fb.group({
      playerVote:this.fb.control<number>(0,[Validators.min(0),Validators.max(10)])
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
  processVote2() {
    this.hasVoted=true;
    this.playerVote = {
      name: this.username,
      vote: this.form.value.playerVote
    }
    const data = {
      gameCode: this.gameCode,
      ...this.playerVote,
      currentPlayerName: this.currentPlayerName
    }
      
      this.wsService.publish(`/app/playervote/${this.gameCode}`,data);
      this.form = this.createForm();

    // this.playerVote.vote = 0;
  }
  
  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
      console.log("✅ Unsubscribed from gameStateSubscription");
  }

  // ✅ Unsubscribe from submissionSubscription
  if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
      console.log("✅ Unsubscribed from submissionSubscription");
  }

  // ✅ Unsubscribe from gameDrawingSubscription
  if (this.gameDrawingSubscription) {
      this.gameDrawingSubscription.unsubscribe();
      console.log("✅ Unsubscribed from gameDrawingSubscription");
  }

  // ✅ Unsubscribe from WebSocket connection observable
  if (this.connectionSub) {
      this.connectionSub.unsubscribe();
      console.log("✅ Unsubscribed from WebSocket isConnected$");
  }
  }
}
