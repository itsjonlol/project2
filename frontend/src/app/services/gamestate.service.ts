import { Injectable } from '@angular/core';
import { GameState, GameStateManager } from '../models/gamemodels';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  gameStateManager:GameStateManager ={ gameCode: 0, gameState: GameState.AVAILABLE };
  private gameStateManagerSubject = new BehaviorSubject<GameStateManager | null>(this.gameStateManager);
  
  
  
  gameStateManager$ = this.gameStateManagerSubject.asObservable();

  // Method to update the game state
  setGameState(gameCode:number,state: GameState) {
    this.gameStateManager.gameCode= gameCode;
    this.gameStateManager.gameState=state;
    this.gameStateManagerSubject.next(this.gameStateManager);
  }

 
}