import { Routes } from '@angular/router';
import { LoginComponent } from './components/extcomponents/login/login.component';
import { DashboardComponent } from './components/extcomponents/dashboard/dashboard.component';
import { LolDisplayComponent } from './components/notusedcomponents/lol-display/lol-display.component';
import { HostLobbyComponent } from './components/hostcomponents/host-lobby/host-lobby.component';
import { HostPromptComponent } from './components/hostcomponents/host-prompt/host-prompt.component';
import { JoinGameComponent } from './components/notusedcomponents/join-game/join-game.component';
import { DrawingsComponent } from './components/notusedcomponents/drawings/drawings.component';
import {EnterGameComponent} from './components/playercomponents/enter-game/enter-game.component';
import {PlayerLobbyComponent} from './components/playercomponents/player-lobby/player-lobby.component';
import {PlayerDrawingComponent} from './components/playercomponents/player-drawing/player-drawing.component';
import { TestsubComponent } from './components/notusedcomponents/testsub/testsub.component';
import { HostShowDrawingsComponent } from './components/hostcomponents/host-show-drawings/host-show-drawings.component';
import { PlayerVoteInputComponent } from './components/playercomponents/player-vote-input/player-vote-input.component';
import { PlayerResultsComponent } from './components/playercomponents/player-results/player-results.component';
import { HostResultsComponent } from './components/hostcomponents/host-results/host-results.component';
import { RegisterComponent } from './components/extcomponents/register/register.component';
import { Host } from '@angular/core';
import { TestshowComponent } from './components/notusedcomponents/testshow/testshow.component';




export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {path:'register',component:RegisterComponent},
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
          path:'lobby/:gameCode',
          component:HostLobbyComponent
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
    {path:'testshow',component:TestshowComponent},
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
