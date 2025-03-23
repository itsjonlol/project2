import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StompSubscription } from '@stomp/stompjs';
import { WebSocketService } from '../../../services/websocket.service';
import { GameState, PlayerSubmission, Submission } from '../../../models/gamemodels';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-host-results',
  imports: [JsonPipe],
  templateUrl: './host-results.component.html',
  styleUrl: './host-results.component.css'
})
export class HostResultsComponent implements OnInit,OnDestroy {
  router = inject(Router);
  
  wsService = inject(WebSocketService);

  activatedRoute = inject(ActivatedRoute);

  username!:string;
  gameCode!:number;
  private gameStateSubscription!: StompSubscription;

  @Input({required:true})
  submissionresults!: Submission

  drawings:PlayerSubmission[] =[]
  
//   submission:Submission = {
//     gameCode: 2,
//     gamePrompt: 'test string',
//     players: [
//         { name: "jon1", vote: 0, mascot: "/mascot/mascot1.svg" },
//         { name: "jon2", vote: 0, mascot: "/mascot/mascot1.svg" },
//         { name: "jon3", vote: 0, mascot: "/mascot/mascot1.svg" },
//         { name: "jon4", vote: 0, mascot: "/mascot/mascot1.svg" }
//     ],
//     playerSubmissions: [
//         {
//             userId: "jon1",
//             playerName: "jon1",
//             title: "title1",
//             description: "description1",
//             aiComments: "aicomments1",
//             imageUrl: "https://artistick.sgp1.digitaloceanspaces.com/ec1306ad_canvas-image.png",
//             total: 0,
//             isWinner: false
//         },
//         {
//             userId: "jon2",
//             playerName: "jon2",
//             title: "title2",
//             description: "description2",
//             aiComments: "aicomments2",
//             imageUrl: "https://artistick.sgp1.digitaloceanspaces.com/2c2d0bb7_canvas-image.png",
//             total: 0,
//             isWinner: false
//         },
//         {
//             userId: "jon3",
//             playerName: "jon3",
//             title: "title3",
//             description: "description3",
//             aiComments: "aicomments3",
//             imageUrl: "https://artistick.sgp1.digitaloceanspaces.com/dc1a312c_canvas-image.png",
//             total: 0,
//             isWinner: false
//         },
//         {
//             userId: "jon4",
//             playerName: "jon4",
//             title: "title4",
//             description: "description4",
//             aiComments: "aicomments4",
//             imageUrl: "https://artistick.sgp1.digitaloceanspaces.com/b4eb2a7f_canvas-image.png",
//             total: 0,
//             isWinner: false
//         }
//     ]
// };

  ngOnInit(): void {
    const gameCodeParam = this.activatedRoute.snapshot.paramMap.get('gameCode');
    this.username = localStorage.getItem("username") || 'player';
    if (gameCodeParam) {
      // Convert the parameter to a number
      this.gameCode = +gameCodeParam;
    } else {
      console.error('Game code not found in route parameters.');
    }

    this.drawings = this.submissionresults.playerSubmissions;
    this.submissionresults.playerSubmissions.sort((a, b) => b.total - a.total);
    this.wsService.connect();
  }

  endGame():void {
    const data = {
      gameCode:this.gameCode,
      gameState:GameState.FINISHED
    } 
    this.wsService.publish(`/app/gamestate/${this.gameCode}`,data);
  }

  getPlayerMascot(playerName: string): string | undefined {
    const player = this.submissionresults.players.find(p => p.name === playerName);
    return player?.mascot
  }
  

  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
      console.log("✅ Unsubscribed from gameStateSubscription");
  }
    this.wsService.disconnect();
   }
}
