import { AfterViewInit, Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../../../services/websocket.service';
import * as fabric from 'fabric';
import { ImageService } from '../../../services/image.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GameState, UploadResponse } from '../../../models/gamemodels';
import { FormsModule } from '@angular/forms';
import { StompSubscription } from '@stomp/stompjs';
import { PlayerVoteInputComponent } from '../player-vote-input/player-vote-input.component';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-player-drawing',
  imports: [FormsModule,PlayerVoteInputComponent],
  templateUrl: './player-drawing.component.html',
  styleUrl: './player-drawing.component.css'
})
export class PlayerDrawingComponent implements OnInit,AfterViewInit,OnDestroy{



  router = inject(Router);
  
  wsService = inject(WebSocketService);

  activatedRoute = inject(ActivatedRoute);

  imageService = inject(ImageService);

  username!:string;
  gameCode!:number;

  title:string='';
  description:string='';
  isUploaded:boolean = false;
  uploadedImageUrl:string='';
  
  isDrawingMode:boolean = true;

  private gameStateSubscription!: StompSubscription;

  //trial
  // isVoting:boolean = false;

  gameService = inject(GameService)

  @Input()
  currentGameState!:string | undefined


  private canvas!: fabric.Canvas;
  public brushColor: string = '#000000'; // Default brush color
  public brushWidth: number = 5; // Default brush size
  public isErasing: boolean = false; // Eraser mode flag
  private backgroundColor: string = "white"; // Background color (same as canvas)
  // protected _canvas?: fabric.Canvas;
  // @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;


  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = localStorage.getItem("username") || 'player';
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
    } else {
      console.error('Game code not found in route parameters.');
    }

    

    this.initializeCanvas();
    this.wsService.connect();
    // this.gameService.getGameRoomState(this.gameCode).subscribe(d=>this.currentGameState=d.gameState)
    
    /// from here


    this.wsService.isConnected$.subscribe((isConnected)=>{
      if (isConnected) {
        if (this.gameStateSubscription) {
          this.gameStateSubscription.unsubscribe();
        }//unsubscribe from prev games
        this.gameStateSubscription=this.wsService.client.subscribe(`/topic/gamestate/${this.gameCode}`, (message) => {
          console.log(message.body);

          
          const data = JSON.parse(message.body);

          // if (data.gameState === GameState.STARTED) {
          //   console.log("New round started, resetting data...");
          //   this.isDrawingMode = false;
          //   this.isUploaded = false; // Reset upload state
          //   this.uploadedImageUrl = ""; // Reset image URL
          //   this.title = "";
          //   this.description = "";
          //   this.clearCanvas(); // Reset canvas
          // }

          // if (data.gameState === GameState.DESCRIBE && this.isDrawingMode) {
          //   // console.log(true);
          //   // this.currentGameState= GameState.DESCRIBE
          //   this.isDrawingMode=false;

          //   // TO COMMENT OUT
          //   this.submitCanvas();
            
          // }
          
          // if (data.gameState === GameState.VOTING ) {
          //   // console.log(true);
          //   // this.currentGameState= GameState.VOTING
          //   this.onSubmitDetails();  

          //   // this.isVoting=true;
          //   // this.router.navigate(['player','vote',this.gameCode])

          //   //TO COMMENT OUT
          //   // setTimeout(()=>this.router.navigate(['player','vote',this.gameCode]),3000)
          // }


          
        })
      }
    })
  }

  ngOnChanges():void {
    if (this.currentGameState === GameState.DESCRIBE) {
      this.canvas.isDrawingMode=false;
      this.isDrawingMode=false;
      this.submitCanvas()
    }
    // if (this.currentGameState === GameState.VOTING) {
    //   this.submitCanvas();
    // }
  }

  /// to here

  ngAfterViewInit(): void {
    
    this.initializeCanvas();
    // this.updateBrush();
    // this.canvas = new fabric.Canvas('myCanvas');
    // this.canvas.add(new fabric.IText('Hello Fabric!'));
    // this.canvas.add(new fabric.IText('Hello World !'))
    // this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);

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

  public updateBrush(): void {
    if (this.canvas) {
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = this.isErasing ? this.backgroundColor : this.brushColor;
      this.canvas.freeDrawingBrush.width = this.brushWidth;
    }
  }

  public setBrushColor(color: string): void {
    this.brushColor = color;
    this.isErasing = false; // Disable erasing mode
    this.updateBrush();
  }

  public setBrushSize(size: any): void {
  
    this.brushWidth= size.target.value;
    // this.brushWidth = size;
    this.updateBrush();
  }

  public enableEraser(): void {
    this.isErasing = true;
    this.updateBrush();
  }

  public clearCanvas(): void {
    this.canvas.clear();
    // this.canvas.backgroundColor = this.backgroundColor; // Reset background
  }

  submitCanvas() {
    const dataUrl = this.canvas.toDataURL({ format: 'png', multiplier: 1.0 });

    var blob:Blob = this.imageService.dataURItoBlob(dataUrl);

    

    this.imageService.uploadBlob(blob).subscribe({
      next: (response:UploadResponse) => {
        console.log('Upload success:', response);
        
        if (response.url) {
          this.uploadedImageUrl = response.url; 
          this.isUploaded = true;
        }
      },
      error: (error:HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  onSubmitDetails() {
    console.log("Submitting to backend...");

    const data = {
      gameCode: this.gameCode,
      name: this.username,
      title: this.title,
      description: this.description,
      image: this.uploadedImageUrl,
    }

    this.wsService.publish(`/app/playersubmission/${this.gameCode}`,data);
  }

  ngOnDestroy(): void {
    
    this.onSubmitDetails()

    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    // this.wsService.disconnect();
    this.resetState();
  }

  private resetState(): void {
    this.title = '';
    this.description = '';
    this.uploadedImageUrl = '';
    this.isUploaded = false;
    this.clearCanvas(); // Clear the canvas for the new round
  }

}
