import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subject } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
// import SockJS from 'sockjs-client'; 


@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  public client: Client = new Client;
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  public isConnected$ = this.isConnectedSubject.asObservable();
  private messageSubject = new BehaviorSubject<any>(null);
  public messages$ = this.messageSubject.asObservable(); 

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    // Only create new client if none exists or previous one was deactivated
    if (!this.client || !this.client.active) {
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:4000/game'),
        reconnectDelay: 5000,
        debug: (msg) => console.log('[WebSocket]', msg),
      });

      this.client.onConnect = () => {
        console.log('✅ WebSocket connected');
        this.isConnectedSubject.next(true);
      };

      this.client.onDisconnect = () => {
        console.log('❌ WebSocket disconnected');
        this.isConnectedSubject.next(false);
      };
      
      this.client.activate();
    }
  }

  public connect(): void {
    if (!this.client.active) {
      this.initializeWebSocket();
    }
  }

  public publish(destination: string, body: any): void {
    if (this.client.connected) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    }
  }

  public disconnect(): void {
    if (this.client && this.client.connected) {
      this.client.deactivate();
      console.log("❌ WebSocket connection closed");
    }
  }

  // subscribeToTopic(topic: string): Observable<any> {
  //   return new Observable((observer: Observer<any>) => {
  //     if (this.client.connected) {
  //       const subscription = this.client.subscribe(topic, (message) => {
  //         observer.next(JSON.parse(message.body)); // Emit the message body
  //       });

  //       // Cleanup on unsubscribe
  //       return () => {
  //         if (subscription) {
  //           subscription.unsubscribe();
  //         }
  //       };
  //     } else {
  //       observer.error('WebSocket not connected');
  //       return; // Explicitly return to satisfy TypeScript
  //     }
  //   });
  // }
// export class WebSocketService {
//   private client: Client;
//   private lobbyUpdatesSubject = new Subject<any>();

//   constructor() {
//     this.client = new Client({
//       brokerURL: 'ws://localhost:4000/game',  // Your Spring Boot WebSocket endpoint
//       reconnectDelay: 5000,
//       debug: (msg: any) => console.log(msg)
//     });

//     this.client.onConnect = () => {
//       console.log('Connected to WebSocket');
//       // Note: We'll subscribe to lobby updates dynamically/
//     };

//     this.client.activate();
//   }

//   /**
//    * Host sends the game code (optional; could also be done in a join request)
//    */
//   // sendGameCode(gameCode: string): void {
//   //   this.client.publish({
//   //     destination: '/app/${gameCode}',
//   //     body: gameCode
//   //   });
//   // }

//   // /**
//   //  * A player sends a join request with their name.
//   //  */
//   // sendJoinRequest(gameCode: string, playerName: string): void {
//   //   this.client.publish({
//   //     destination: `/app/joinLobby/${gameCode}`,
//   //     body: JSON.stringify({ playerName })
//   //   });
//   // }

//   /**
//    * Subscribe to lobby updates for a specific game code.
//    */
//   subscribeToLobbyUpdates(gameCode: string): Observable<any> {
//     this.client.subscribe(`/topic/lobby/${gameCode}`, (message: { body: string; }) => {
//       const data = JSON.parse(message.body);
//       this.lobbyUpdatesSubject.next(data);
//     });
//     return this.lobbyUpdatesSubject.asObservable();
//   }
// }
// export class WebSocketService {
//   public client: Client;
  
//   private isConnectedSubject = new BehaviorSubject<boolean>(false);
//   public isConnected$ = this.isConnectedSubject.asObservable();

//   constructor() {
//     // Use webSocketFactory to use SockJS for the connection
//     console.log("Initializing WebSocketService...");
//     this.client = new Client({
//       // Remove brokerURL and use webSocketFactory:
//       webSocketFactory: () => new SockJS('http://localhost:4000/game'),
//       reconnectDelay: 5000,
//       debug: (msg: any) => console.log(msg)
//     });

//     this.client.onConnect = () => {
//       console.log('Connected to WebSocket');
//       // You can now subscribe or send messages
//     };

//     this.client.onStompError = (frame) => {
//       console.error('Broker reported error: ' + frame.headers['message']);
//       console.error('Additional details: ' + frame.body);
//     };

//     // Activate the STOMP client
//     console.log("Activating client...")
//     this.client.activate();
//   }

//   sendGameCode(gameCode: string): void {
//     if (!this.client.connected) {
//       console.warn("STOMP client not connected yet. Retrying...");
//       this.client.onConnect = () => {
//         console.log("✅ WebSocket Connected. Sending game code...");
//         this.client.publish({
//           destination: '/app/test',
//           body: JSON.stringify({ gameCode }) // Ensure message is sent as JSON
//         });
//       };
//     } else {
//       console.log("✅ WebSocket already connected. Sending game code...");
//       this.client.publish({
//         destination: '/app/test',
//         body: JSON.stringify({ gameCode })
//       });
//     }
//   }
  /**
   * Subscribe to lobby updates for a specific game code.
   */
  // subscribeToLobbyUpdates(gameCode: string): Observable<any> {
  //   this.client.subscribe(`/topic/lobby/${gameCode}`, (message: { body: string; }) => {
  //     const data = JSON.parse(message.body);
  //     this.lobbyUpdatesSubject.next(data);
  //   });
  //   return this.lobbyUpdatesSubject.asObservable();
  // }

  // Other methods like sendGameCode, sendJoinRequest can be added here
}
