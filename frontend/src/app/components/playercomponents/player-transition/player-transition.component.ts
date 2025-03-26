import { Component, Input } from '@angular/core';
import { Transition } from '../../../models/gamemodels';

@Component({
  selector: 'app-player-transition',
  imports: [],
  templateUrl: './player-transition.component.html',
  styleUrl: './player-transition.component.css'
})
export class PlayerTransitionComponent {
  @Input()
  transitionChild:Transition ={
    gameCode: 0,
    fromState: '',
    ToState: ''
  }
  message:string='Please read the instructions on the host screen!'


}
