import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../../../services/websocket.service';
import * as fabric from 'fabric';
import { ImageService } from '../../../services/image.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GameState, UploadResponse } from '../../../models/gamemodels';
import { FormsModule } from '@angular/forms';
import { StompSubscription } from '@stomp/stompjs';
import { GameService } from '../../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-drawing',
  imports: [FormsModule],
  templateUrl: './player-drawing.component.html',
  styleUrl: './player-drawing.component.css'
})
export class PlayerDrawingComponent implements OnInit,OnDestroy{



  router = inject(Router);
  
  wsService = inject(WebSocketService);

  activatedRoute = inject(ActivatedRoute);

  imageService = inject(ImageService);

  username!:string;
  userId!:string;
  gameCode!:number;

  title:string='';
  description:string='';
  isUploaded:boolean = false;
  uploadedImageUrl:string='';
  aiComments:string = '';
  
  isDrawingMode:boolean = true;

  private gameStateSubscription!: StompSubscription;


  gameService = inject(GameService)
  connectionSub!: Subscription

  @Input()
  currentGameState!:string | undefined


  private canvas!: fabric.Canvas;
  //default brush settings
  brushColor: string = 'black'; 
  brushWidth: number = 5; 
  isErasing: boolean = false; 
  backgroundColor: string = "white"; 
 


  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = sessionStorage.getItem("username") || 'player';
    this.userId = sessionStorage.getItem("userId") || 'blank'
  
    if (gameCodeParam) {
  
      this.gameCode = +gameCodeParam;
    }
  

    this.initializeCanvas();
    this.wsService.connect();
    
    // ensure websocket is connected for publishing to a topic purposes
    this.connectionSub = this.wsService.isConnected$.subscribe((isConnected)=>{
      if (isConnected) {
     
        console.log("connected");
     
      }
    })
  }

  // when the game state changes, stop drawing, submit the canvas to backend 
  ngOnChanges():void {
    if (this.currentGameState === GameState.DESCRIBE) {
      this.canvas.isDrawingMode=false;
      this.isDrawingMode=false;
      this.submitCanvas()
    }
 
  }


  private initializeCanvas(): void {
    this.canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true,
      width: window.innerWidth - 60,
      height: window.innerHeight * 0.6,
      backgroundColor: this.backgroundColor
    });
    this.updateBrush();
  }

  //update brush settings
  public updateBrush(): void {
    if (this.canvas) {
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      // erase 
      this.canvas.freeDrawingBrush.color = this.isErasing ? this.backgroundColor : this.brushColor;
      this.canvas.freeDrawingBrush.width = this.brushWidth;
    }
  }
  //update brush color
  public setBrushColor(color: string): void {
    this.brushColor = color;
    this.isErasing = false; // Disable erasing mode
    this.updateBrush();
  }
  //update brush size
  public setBrushSize(size: any): void {
  
    this.brushWidth= size.target.value;
    
    this.updateBrush();
  }
  // if player clicks on eraser
  public enableEraser(): void {
    this.isErasing = true;
    this.updateBrush();
  }

  //clear whole canvas and reset the background color
  public clearCanvas(): void {
    this.canvas.clear();
    this.canvas.backgroundColor = this.backgroundColor; 
  }
  // convert canvas to base 64, then to blob, then submit to backend.
  //backend will take the blob, upload to s3 service, send the url to openai, then receive
  // the image url and ai comments here
  submitCanvas() {
    const dataUrl = this.canvas.toDataURL({ format: 'png', multiplier: 1.0 });

    var blob:Blob = this.imageService.dataURItoBlob(dataUrl);

    

    this.imageService.uploadBlob(blob).subscribe({
      next: (response:UploadResponse) => {
        // console.log('Upload success:', response);
        
        if (response.url) {
          this.uploadedImageUrl = response.url; 
          this.isUploaded = true;
          this.aiComments = response.aiComments;
        }
      },
      error: (error:HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
  // send the whole details to backend
  onSubmitDetails() {
    console.log("Submitting to backend...");

    const data = {
      gameCode: this.gameCode,
      userId:this.userId,
      name: this.username,
      title: this.title,
      description: this.description,
      image: this.uploadedImageUrl,
      aiComments: this.aiComments
    }

    this.wsService.publish(`/app/playersubmission/${this.gameCode}`,data);
  }
  //clean up subscriptions
  ngOnDestroy(): void {
    
    this.onSubmitDetails()

    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
     
  }


  if (this.connectionSub) {
      this.connectionSub.unsubscribe();
    
  }

  }



}
