import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { GameState, GameStateManager, Player } from '../models/gamemodels';
import { GameService } from '../services/game.service';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';

// export interface Game {
//     gameState: GameState;
//     players: string[]
// }

// export interface GameSlice{
//   games: { [gameCode: number]: Game}; // ✅ Store only gameState per gameCode
// }

export interface GameModel {
    gameCode: number | null,
    gameState: GameState,
    players: Player[];
}

// const INIT_STATE = {
//     games: {}
// }

const INIT_STATE =  {
    gameCode : null,
    gameState: GameState.AVAILABLE, // Default state
    players: [] // Empty list of players
};


@Injectable({ providedIn: 'root' })
export class GameStore extends ComponentStore<GameModel> {
    gameService = inject(GameService)
    
  constructor() {
    super(INIT_STATE); 
  
    
  }

  readonly selectGameState = (gameCode: number) =>
    this.select((state) => {
        if (state.gameCode === gameCode) {
            console.log(`🎯 Selected gameState for gameCode ${gameCode}:`, state.gameState);
            return state.gameState; // ✅ Returns GameState (string or enum)
        }
        return null; // ✅ Ensures consistent return type
    });

readonly updateGameState = this.updater((state, newState: GameState) => {
    console.log("🔄 Updating game state to:", newState);
    return { ...state, gameState: newState };
});

readonly updateGameCode = this.updater((state,gameCode:number) => ({
    ...state,
    gameCode: gameCode
}))

readonly getGameStateForRoom = this.effect((gameCode$: Observable<number>) =>
    gameCode$.pipe(
        switchMap((gameCode) => 
            this.gameService.getGameRoomState(gameCode).pipe(
                tap((gameStateManager) => {
                    console.log(`📡 Fetched game state for gameCode ${gameCode}:`, gameStateManager);
                    this.updateGameCode(gameCode);
                    this.updateGameState(gameStateManager.gameState);
                }),
                catchError((error) => {
                    console.error(`❌ Error fetching game state for gameCode ${gameCode}:`, error);
                    return EMPTY;
                })
            )
        )
    )
);

//   // Selector: Get the gameState for a specific gameCode
//   readonly selectGameState = (gameCode: number) =>
//     this.select((state) => {
//       const gameState = state.games[gameCode]?.gameState;
//       console.log("selected game state is, "+ JSON.stringify(state))
//       console.log('Selected game state for gameCode:', gameCode, 'is:', gameState);
//       return gameState;
//     });

//     readonly updateGameState = this.updater((state, newState: { gameCode: number; gameState: GameState }) => {
//         console.log("old state is ...", JSON.stringify(state) )
//         console.log('Updating game state:', newState);
        
//         // Create a new games object with the updated game
//         const updatedGames = {
//           ...state.games,
//           [newState.gameCode]: {
//             // If the game exists, spread its properties, otherwise create a new object
//             ...(state.games[newState.gameCode] || { players: [] }),
//             // Update the gameState
//             gameState: newState.gameState
//           }
//         };
        
//         console.log('Updated games object:', JSON.stringify(updatedGames));
        
//         // Return the new state
//         return {
//           ...state,
//           games: updatedGames
//         };
//       });

//   readonly getGameStateForRoom = this.effect((gameCode$: Observable<number>) =>
//     gameCode$.pipe(
//       switchMap((gameCode: number) =>
//         this.gameService.getGameRoomState(gameCode).pipe(
//           tap((gameStateManager: GameStateManager) => {
//             this.updateGameState({ gameCode: gameStateManager.gameCode, gameState: gameStateManager.gameState });
//           }),
//           catchError((error) => {
//             console.error("Error fetching game state:", error);
//             return EMPTY; // ✅ Ensures effect does not break the stream
//           })
//         )
//       )
//     )
//   );



}