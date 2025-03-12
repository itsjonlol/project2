import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameEntry,GameStateManager } from '../models/gamemodels';

export interface GameRoomResponse {
  success: boolean;
  gameCode:number;
}
export interface GameRoomPrompt {
  gameCode:number;
  gamePrompt:string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  httpClient = inject(HttpClient);

  private backendUrl = 'http://localhost:4000/api';

  postAccessRoom(gameEntry:GameEntry):Observable<object> {
    return this.httpClient.post<GameEntry>(`${this.backendUrl}/accessroom`,gameEntry);
    
  }

  getGameRoom():Observable<GameRoomResponse> {

    return this.httpClient.get<GameRoomResponse>(`${this.backendUrl}/getgameroom`);
  }

  getGameRoomState(gameCode:number):Observable<GameStateManager> {
    return this.httpClient.get<GameStateManager>(`${this.backendUrl}/gamestate/${gameCode}`);
  }

  getGameRoomPrompt(gameCode:number):Observable<GameRoomPrompt> {
    return this.httpClient.get<GameRoomPrompt>(`${this.backendUrl}/gameprompt/${gameCode}`)
    
  }


  
}
