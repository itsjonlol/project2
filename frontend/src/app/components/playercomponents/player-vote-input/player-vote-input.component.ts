import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../../../services/websocket.service';
import { StompSubscription } from '@stomp/stompjs';
import { Player, Submission } from '../../../models/gamemodels';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-player-vote-input',
  imports: [ReactiveFormsModule],
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
    this.username = sessionStorage.getItem("username") || 'player';
    if (gameCodeParam) {
    
      this.gameCode = +gameCodeParam;
    } 
   
    this.form = this.createForm();

    this.wsService.connect();
    // ensure websocket is connected before subscribing to topics
    this.connectionSub = this.wsService.isConnected$.subscribe((isConnected)=>{
      if (isConnected) {
        this.gameDrawingSubscription=this.wsService.client.subscribe(`/topic/currentdrawing/${this.gameCode}`, (message) => {
          // console.log(message.body)

          const data = JSON.parse(message.body);
          
          this.currentPlayerName = data.currentPlayerName;
          this.hasVoted=false;
          
         })


         this.gameStateSubscription= this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`,(message) => {
          // console.log(message.body)

          const data = JSON.parse(message.body);


         })
      }


    })
    
  }

  createForm():FormGroup {
    return this.fb.group({
      playerVote:this.fb.control<number>(0,[Validators.required,Validators.min(1),Validators.max(10)])
    })
  } 
  
  
  processVote() {
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


  }
  //clean up subscriptions
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

  if (this.connectionSub) {
      this.connectionSub.unsubscribe();
   
  }
  }
}
