import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../environments/environment.development';



@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  public client: Client = new Client;
  // to update the connectivity status of websocket
  // inititally false
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  public isConnected$ = this.isConnectedSubject.asObservable();
 

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    // to ensure pre-existing clients are not connected/initialised beforehand
    if (!this.client || !this.client.active) {
      this.client = new Client({
 
        webSocketFactory: () => new SockJS(`${environment.url}/game`),
        reconnectDelay: 5000,
        debug: (msg) => console.log("Websocket:" + msg),
      });
      // update connectivity status
      this.client.onConnect = () => {
      
        this.isConnectedSubject.next(true);
      };

      this.client.onDisconnect = () => {
       
        this.isConnectedSubject.next(false);
      };
      
      this.client.activate();
    }
  }
  // to ensure pre-existing connection is not available when wanting to connect for the first time
  public connect(): void {
    if (!this.client.active) {
      this.initializeWebSocket();
    }
  }
  // to publish to a destination to springboot websocket controller
  public publish(destination: string, body: any): void {
    if (this.client.connected) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    }
  }
  // once wants to disconnect from websocket / user clicks on disconnect
  public disconnect(): void {
    if (this.client && this.client.connected) {
      this.client.deactivate();
 
    }
  }

  
}
