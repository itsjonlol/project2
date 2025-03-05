import { Component, Input, OnInit } from '@angular/core';
import { GameState, Transition } from '../../../models/gamemodels';

@Component({
  selector: 'app-host-transition',
  imports: [],
  templateUrl: './host-transition.component.html',
  styleUrl: './host-transition.component.css'
})
export class HostTransitionComponent implements OnInit{

  @Input({required:true})
  transitionChild:Transition ={
    gameCode: 0,
    fromState: '',
    ToState: ''
  }
  message:string='Default message'

  ngOnInit(): void {
    if (this.transitionChild.fromState===GameState.QUEUING) {
      this.message = "Let's start! Please draw the funniest drawing you can think of based on the prompt!"
    }
    if (this.transitionChild.fromState===GameState.DESCRIBE) {
      this.message = "It's time to see each drawing individually and give your vote!"
    }
    if (this.transitionChild.fromState===GameState.VOTING) {
      this.message= "Gathering all votes.... it's time to reveal the winner!!"
    }
  }

}
