import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LolDisplayComponent } from './lol-display/lol-display.component';
import { HostLobbyComponent } from './host/host-lobby/host-lobby.component';
import { HostPromptComponent } from './host/host-prompt/host-prompt.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { DrawingsComponent } from './drawings/drawings.component';
import {EnterGameComponent} from './player/enter-game/enter-game.component';
import {PlayerLobbyComponent} from './player/player-lobby/player-lobby.component';
import {PlayerDrawingComponent} from './player/player-drawing/player-drawing.component';
import { TestsubComponent } from './testsub/testsub.component';
import { HostShowDrawingsComponent } from './host/host-show-drawings/host-show-drawings.component';
import { PlayerVoteInputComponent } from './player/player-vote-input/player-vote-input.component';
import { PlayerResultsComponent } from './player/player-results/player-results.component';
import { HostResultsComponent } from './host/host-results/host-results.component';




export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    {path:'lol-display',component: LolDisplayComponent},
    {
      path: 'host', // Parent route
      children: [
        {
          path: 'lobby', // Child route
          component: HostLobbyComponent
        },
        {
          path: 'prompt/:gameCode',
          component:HostPromptComponent
        },
        {
          path: 'showdrawings/:gameCode',
          component:HostShowDrawingsComponent
        },
        {
          path:'results/:gameCode',
          component:HostResultsComponent
        }
      ]
    },
    {path:'join-game',component:JoinGameComponent},
    {path:'drawings',component:DrawingsComponent},
    {path:'enter-game',component:EnterGameComponent},
    {path:'testsub',component:TestsubComponent},
    {
      path:'player',
      children:[
        {
          path:'lobby/:gameCode',
          component:PlayerLobbyComponent
        },
        {
          path:'draw/:gameCode',
          component:PlayerDrawingComponent
        },
        {
          path:'vote/:gameCode',
          component:PlayerVoteInputComponent
        },
        {
          path:'results/:gameCode',
          component:PlayerResultsComponent
        }
      ]
    }
  ];
