import { Component, Input, OnInit } from '@angular/core';
import { GameState, Transition } from '../../../models/gamemodels';

@Component({
  selector: 'app-host-transition',
  imports: [],
  templateUrl: './host-transition.component.html',
  styleUrl: './host-transition.component.css'
})
export class HostTransitionComponent implements OnInit{
  // this is a transition component to display a message and play a sound when transitioning between game states
  @Input({required:true})
  transitionChild!:Transition 
  message:string='Default message'
  audioSrc!:string;
  audio!:any;
  playSound:boolean = false;

  ngOnInit(): void {
    // the various transition messages and voice commentary that will be played at each stage
    if (this.transitionChild.fromState===GameState.QUEUING) {
      this.message = "Let's start! Please draw the funniest drawing you can think of based on the prompt!"
      this.audioSrc='/music/t1.mp3';
      this.audio = new Audio(this.audioSrc);
      this.playSound = true;
      this.playVoice();
    }
    if (this.transitionChild.fromState===GameState.DESCRIBE) {
      this.message = "It's time to see each drawing individually and give your vote!"
      this.audioSrc='/music/t3.mp3';
      this.audio = new Audio(this.audioSrc);
      this.playSound = true;
      this.playVoice();
      
    }
    if (this.transitionChild.fromState===GameState.VOTING) {
      this.message= "Gathering all votes.... it's time to reveal the winner!!"
      this.audioSrc='/music/t4.mp3';
      this.audio = new Audio(this.audioSrc);
      this.playSound = true;
      this.playVoice();
      
    }
  }


  // remove the music when game is not active
  ngOnDestroy(): void {
    this.playSound=false;
    this.playVoice();
  }

  playVoice(): void {
      
      if (this.playSound) {
          this.audio.currentTime = 0; 
          this.audio.load();
          this.audio.play().catch((err: any) => console.error("Error playing audio:", err));
      } else {
          this.audio.pause();
      }
  }
}
