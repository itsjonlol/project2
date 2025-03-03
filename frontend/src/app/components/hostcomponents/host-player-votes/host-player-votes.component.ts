import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { Player, Submission } from '../../../models/gamemodels';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-host-player-votes',
  imports: [JsonPipe,CommonModule],
  templateUrl: './host-player-votes.component.html',
  styleUrl: './host-player-votes.component.css'
})
export class HostPlayerVotesComponent implements OnInit,DoCheck{
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
