export interface User {
    name:string;
    email:string;
}

export interface GameEntry {
    gameCode: number;
    name: string;
}

export interface GameRoomResponse {
    success: boolean;
    gameCode:number;
}

export enum GameState {
    AVAILABLE = "AVAILABLE",
    QUEUING = "QUEUING",
    STARTED = "STARTED",
    VOTING = "VOTING",
    DESCRIBE= "DESCRIBE",
    NEXT = "NEXT",
    RESULTS="RESULTS",
    FINISHED = "FINISHED"
    
  }

export interface GameSession {
    gameCode:number;
    players:Array<String>;
    gameState?:GameState; // put optional for now
}

export interface GameNameDetails {
    gameCode:number;
    name:string;
}

export interface UploadResponse {
    url:string;
}

export interface GameStateManager {
    gameCode:number;
    gameState: GameState;
}

export interface Player {

    name:string;
    vote:number;
    mascot?:string;

}

export interface PlayerSubmission {


    playerName:string;
    title:string;
    description:string;
    imageUrl:string;
    total:number;
    isWinner:boolean;

}

export interface Submission {
   
    gameCode:number;
    players: Array<Player>;
    playerSubmissions:Array<PlayerSubmission>;
}
