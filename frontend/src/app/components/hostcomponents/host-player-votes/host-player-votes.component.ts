import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { Player, Submission } from '../../../models/gamemodels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-host-player-votes',
  imports: [CommonModule],
  templateUrl: './host-player-votes.component.html',
  styleUrl: './host-player-votes.component.css'
})
export class HostPlayerVotesComponent implements OnInit,DoCheck{

  //simply display the player votes for the current drawing
  @Input({required:true})
  submissionvote!:Submission

  players!:Player[]
  ngOnInit(): void {
    this.players = this.submissionvote.players
  }

  ngDoCheck(): void {
    this.players = this.submissionvote.players
  }

  
}
