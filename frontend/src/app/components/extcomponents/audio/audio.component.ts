import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GameState } from '../../../models/gamemodels';

@Component({
  selector: 'app-audio',
  imports: [],
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.css'
})
export class AudioComponent implements OnChanges,OnDestroy,OnInit{
  playSound:boolean = false;
  audio = new Audio('/music/track1.mp3'); // Create the audio object once
  @Input()
  volume:number=1;
  
  @Input()
  currentGameState:string | null=''

  

  constructor() {
    this.audio.loop = true; // Enable looping
  }
  ngOnInit(): void {
    
    this.playMusic();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.audio.volume = this.volume;
    

    // if (this.currentGameState === GameState.FINISHED) {
    //   this.audio.pause();
    //   this.audio.currentTime = 0; 
     
    // }
  }

  playMusic(): void {
      this.playSound = !this.playSound;
  
      if (this.playSound) {
          this.audio.currentTime = 0; // Reset to the beginning
          this.audio.volume = this.volume
          this.audio.load();
          this.audio.play().catch(err => console.error("Error playing audio:", err));
      } else {
          this.audio.pause();
      }
  }

  ngOnDestroy(): void {
    console.log(" audio destroyed")
    this.audio.pause();
    this.audio.currentTime = 0; 
  }
}
