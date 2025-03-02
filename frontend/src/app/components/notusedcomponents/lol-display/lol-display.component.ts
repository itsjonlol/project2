import { AfterViewInit, Component, ElementRef, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LolService } from '../../../services/lol.service';
import { WebSocketService } from '../../../services/websocket.service';
import * as fabric from 'fabric';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-lol-display',
  imports: [CommonModule,FormsModule],
  templateUrl: './lol-display.component.html',
  styleUrl: './lol-display.component.css'
})
export class LolDisplayComponent implements OnInit,AfterViewInit{
  username: string = '';
  countdown: number = 10;
  constructor(private wsService: WebSocketService,private http: HttpClient) {}
  
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'Host';
    this.startUploadCountdown();

    this.connectionSub = this.wsService.isConnected$.subscribe((isConnected) => {
      if (isConnected) {
        console.log('%c ✅ WebSocket Connected in Component!', 'color: green; font-weight: bold;');
        
      } else {
        console.error('%c ❌ WebSocket Not Connected in Component!', 'color: red; font-weight: bold;');
      }
    });
  }
  startUploadCountdown(): void {
    const interval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(interval); // Stop countdown
        this.uploadCanvas(); // Auto-upload after 10 seconds
      }
    }, 1000); // Update every second
  }
  
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private canvas!: fabric.Canvas;
  private drawingHistory: string[] = [];
  private currentHistoryIndex = -1;
  imageUrl: string | null = null;
  imageUrl2: string | null = null;
  uploadedImageUrl: string = ''; // Store uploaded image URL
  title: string = '';
  description: string = '';
  private connectionSub!: Subscription;

  strokeColor = '#000000';
  strokeWidth = 2;
  isDrawing = false;

  // WebSocket variables
  private stompClient: any;
  gameCode = 'YOUR_GAME_CODE';
  playerName = 'PLAYER_NAME';

  ngAfterViewInit(): void {
    this.initializeCanvas();
    // this.initializeWebSocket();
  }

  private initializeCanvas(): void {
    
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      isDrawingMode: true,
      width: window.innerWidth - 60,
      height: window.innerHeight * 0.6,
      backgroundColor: 'rgb(100,100,200)'
    });
    
    this.canvas.add(new fabric.IText('Hello World !'))
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.color = "222222";
    // Handle drawing events
    this.canvas.on('path:created', () => this.saveCanvasState());
    this.canvas.on('object:modified', () => this.saveCanvasState());
    
  }

  private saveCanvasState(): void {
    this.drawingHistory = this.drawingHistory.slice(0, this.currentHistoryIndex + 1);
    this.drawingHistory.push(JSON.stringify(this.canvas.toJSON()));
    this.currentHistoryIndex++;
  }
  submitCanvas2(): void {
    this.imageUrl = this.canvas.toDataURL({ format: 'png', multiplier: 0.8 });
    
    
    this.imageUrl2 = "lmaooooooo";
    console.log('Canvas submitted:', this.uploadedImageUrl);
    const submissionData = {
      username: this.username,
      title: this.title,
      description: this.description,
      
      imageData: this.uploadedImageUrl
    };
    console.log('Canvas submitted:', submissionData);
    this.wsService.client.publish({destination: "/app/test5", body: JSON.stringify(submissionData)});
    
   
  }
  submitCanvas(): void {
    this.canvasRef.nativeElement.toBlob((blob: Blob | null) => {
      if (!blob) {
        console.error('❌ Failed to convert canvas to Blob');
        return;
      }
  
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob); // ✅ Convert Blob to ArrayBuffer
      reader.onloadend = () => {
        if (!reader.result) {
          console.error('❌ Failed to read Blob as ArrayBuffer');
          return;
        }
  
        const binaryData = new Uint8Array(reader.result as ArrayBuffer); // ✅ Convert to Uint8Array
  
        console.log('Submitting image as binary:', binaryData.byteLength, 'bytes');
  
        if (this.wsService.client.connected) {
          this.wsService.client.publish({
            destination: "/app/test5",
            // body: binaryData.buffer // ✅ Send binary data (ArrayBuffer) instead of Base64
          });
          console.log('%c ✅ Message published with binary image data', 'color: green;');
        } else {
          console.error('❌ WebSocket not connected');
        }
      };
    }, 'image/png'); // ✅ Choose PNG or JPEG
  }

  uploadCanvas() {
    this.convertCanvasToBlob(this.canvas).then(blob => {
      const file = new File([blob], 'canvas-image.png', { type: 'image/png' });

      // Create FormData
      const formData = new FormData();
      formData.append('name', 'canvasImage');
      formData.append('file', file);

      // Send to backend
      this.http.post<{ url: string }>('http://localhost:4000/api/upload', formData).subscribe(response => {
        console.log('Upload success:', response);
        
        if (response.url) {  // ✅ No more TypeScript error
          this.uploadedImageUrl = response.url; // Update UI with uploaded image URL
        }
      }, error => {
        console.error('Upload failed:', error);
      });
    }).catch(error => {
      console.error('Error converting canvas:', error);
    });
  }
  convertCanvasToBlob(canvas: fabric.Canvas): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 0.8 });
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => resolve(blob))
        .catch(err => reject(err));
    });
  }

  // base64ToBlob(base64: string, mimeType: string): Blob {
  //   const byteString = atob(base64.split(',')[1]);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const uintArray = new Uint8Array(arrayBuffer);
  
  //   for (let i = 0; i < byteString.length; i++) {
  //     uintArray[i] = byteString.charCodeAt(i);
  //   }
  
  //   return new Blob([uintArray], { type: mimeType });
  // }
  // private initializeWebSocket(): void {
  //   const socket = new SockJS('/game');
  //   this.stompClient = Stomp.over(socket);
    
  //   this.stompClient.connect({}, () => {
  //     console.log('Connected to WebSocket');
      
  //     this.stompClient.subscribe(`/topic/game/${this.gameCode}`, (message: any) => {
  //       console.log('Game Update:', message.body);
  //     });

  //     this.stompClient.send(`/app/playerReady/${this.gameCode}`, {}, this.playerName);
  //   });
  // }

  
  }

  
