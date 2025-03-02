import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { Subscription } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { ImageData } from '../../../models/image-data'; // Import class
@Component({
  selector: 'app-drawings',
  imports: [CommonModule,NgFor],
  templateUrl: './drawings.component.html',
  styleUrl: './drawings.component.css'
})
export class DrawingsComponent implements OnInit {
  private connectionSub!: Subscription;
  images: ImageData[] = [];

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.connectionSub = this.wsService.isConnected$.subscribe((isConnected) => {
      if (isConnected) {
        this.wsService.client.subscribe("/topic/test5", (message) => {
          console.log(message.body);
          try {
            const parsedData: any[] = JSON.parse(message.body);

            this.images = parsedData.map(data => 
              ({ username: data.username, title: data.title, description: data.description, base64Image: data.base64Image })
            );

            console.log('✅ Updated Image List:', this.images);
          } catch (error) {
            console.error('Error parsing WebSocket JSON:', error);
          }
        });
      }
    });
  }

  
}

