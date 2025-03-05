import { Component, Input, OnInit } from '@angular/core';
import { GameState, Transition } from '../../../models/gamemodels';

@Component({
  selector: 'app-player-transition',
  imports: [],
  templateUrl: './player-transition.component.html',
  styleUrl: './player-transition.component.css'
})
export class PlayerTransitionComponent implements OnInit {
  @Input({required:true})
  transitionChild:Transition ={
    gameCode: 0,
    fromState: '',
    ToState: ''
  }
  message:string='Please read the instructions on the host screen!'

  ngOnInit(): void {
    if (this.transitionChild.fromState===GameState.QUEUING) {
      // this.message = "Let's start! Please draw the funniest drawing you can think of based on the prompt!"
    }
    if (this.transitionChild.fromState===GameState.DESCRIBE) {
      // this.message = ''
    }
    if (this.transitionChild.fromState===GameState.VOTING) {
      // this.message= "Gathering all votes.... it's time to reveal the winner!!"
    }
  }
}
