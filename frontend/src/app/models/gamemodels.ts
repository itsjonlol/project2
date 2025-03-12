// export interface User {
//     name:string;
//     email:string;
// }

export interface GameEntry {
    gameCode: number;
    name: string;
}



export enum GameState {
    AVAILABLE = "AVAILABLE",
    QUEUING = "QUEUING",
    STARTED = "STARTED",
    TRANSITION= "TRANSITION",
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
    role?:string;
}

export interface UploadResponse {
    url:string;
    aiComments:string;
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

    userId?:string;
    playerName:string;
    title:string;
    description:string;
    aiComments?:string;
    imageUrl:string;
    total:number;
    isWinner:boolean;

}

export interface Submission {
   
    gameCode:number;
    gamePrompt?:string;
    players: Array<Player>;
    playerSubmissions:Array<PlayerSubmission>;
}

export interface Transition {
    gameCode:number;
    fromState:string;
    ToState:string;
}
