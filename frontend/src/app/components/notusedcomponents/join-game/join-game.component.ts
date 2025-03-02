import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-game',
  imports: [],
  templateUrl: './join-game.component.html',
  standalone:true,
  styleUrl: './join-game.component.css'
})
export class JoinGameComponent implements OnInit{
  username: string = '';
  private connectionSub!: Subscription;

  constructor(private wsService: WebSocketService,private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'Host';
    const payload = JSON.stringify({ username: this.username });
    const randomData = {
      gameCode: '1234',
      players: ['Player 1', 'Player 2'],
      timestamp: new Date().toISOString(),
      settings: {
        maxPlayers: 4,
        isPrivate: true
      }
    };
    

    this.connectionSub = this.wsService.isConnected$.subscribe((isConnected) => {
      if (isConnected) {
        
        this.wsService.client.publish({destination: "/app/test2", body: this.username});
        this.wsService.client.publish({destination: "/app/test3", body: JSON.stringify(randomData)});
        this.wsService.client.subscribe("/topic/test2", (message) => {
              console.log(message.body);
              const data = JSON.parse(message.body);
              if (data.status==="game start!") {
                this.router.navigate(['/lol-display']);
              
              }
                   
      });
      this.wsService.client.subscribe("/topic/test3", (message) => {
        console.log(message.body);
        const data = JSON.parse(message.body);
        
             
      }); 
       
      }
    });
    
   
  }

}
  

