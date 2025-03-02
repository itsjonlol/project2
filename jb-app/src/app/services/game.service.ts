import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameEntry, GameRoomResponse } from '../models/gamemodels';

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


  
}
