import { Component, Input, OnInit } from '@angular/core';
import { GameState, Transition } from '../../../models/gamemodels';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-host-transition',
  imports: [JsonPipe],
  templateUrl: './host-transition.component.html',
  styleUrl: './host-transition.component.css'
})
export class HostTransitionComponent implements OnInit{

  @Input({required:true})
  transitionChild!:Transition 
  message:string='Default message'
  audioSrc!:string;
  audio!:any;
  playSound:boolean = false;

  

  ngOnInit(): void {
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

  //  playSound:boolean = false;
  // audio = new Audio('/music/track1.mp3'); // Create the audio object once


  // constructor() {
  //   this.audio.loop = true; // Enable looping
  // }

  ngOnDestroy(): void {
    this.playSound=false;
    this.playVoice();
  }

  playVoice(): void {
      // this.playSound = !this.playSound;
      
      if (this.playSound) {
          this.audio.currentTime = 0; // Reset to the beginning
          this.audio.load();
          this.audio.play().catch((err: any) => console.error("Error playing audio:", err));
      } else {
          this.audio.pause();
      }
  }
}
