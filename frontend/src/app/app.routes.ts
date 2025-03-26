import { Routes } from '@angular/router';
import { LoginComponent } from './components/extcomponents/login/login.component';
import { DashboardComponent } from './components/extcomponents/dashboard/dashboard.component';

import { HostLobbyComponent } from './components/hostcomponents/host-lobby/host-lobby.component';


import {EnterGameComponent} from './components/playercomponents/enter-game/enter-game.component';
import {PlayerLobbyComponent} from './components/playercomponents/player-lobby/player-lobby.component';


import { RegisterComponent } from './components/extcomponents/register/register.component';

import { IndividualpostComponent } from './components/extcomponents/individualpost/individualpost.component';
import { GalleryViewComponent } from './components/extcomponents/gallery-view/gallery-view.component';
import { AuthGuard } from './guard/auth.guard';




export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {path:'register',component:RegisterComponent},
    { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuard]},
  
    { path: 'host/lobby/:gameCode', component: HostLobbyComponent,canActivate: [AuthGuard] },
    
    {path:'enter-game',component:EnterGameComponent,canActivate: [AuthGuard]},
    {path:'gallery',component:GalleryViewComponent,canActivate: [AuthGuard]},
    {path:'gallery/:postId',component:IndividualpostComponent,canActivate: [AuthGuard]},
    {path:'player/lobby/:gameCode',component:PlayerLobbyComponent,canActivate: [AuthGuard]},
    {path:'**',redirectTo:'/dashboard',pathMatch:'full'}
   
    
  ];
