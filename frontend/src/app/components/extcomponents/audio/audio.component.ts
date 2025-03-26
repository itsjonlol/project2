import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-audio',
  imports: [],
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.css'
})
export class AudioComponent implements OnChanges,OnDestroy,OnInit{
  playSound:boolean = false;
  audio = new Audio('/music/track1.mp3');
  @Input()
  volume:number=1;
    
  constructor() {
    this.audio.loop = true; 
  }
  ngOnInit(): void {
    
    this.playMusic();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.audio.volume = this.volume;
    

  }
  // to toggle audio between on and off when user clicks on the music button
  playMusic(): void {
      this.playSound = !this.playSound;
  
      if (this.playSound) {
          this.audio.currentTime = 0; 
          this.audio.volume = this.volume
          this.audio.load();
          this.audio.play().catch(err => console.error("Error playing audio:", err));
      } else {
          this.audio.pause();
      }
  }

  ngOnDestroy(): void {
    // console.log(" audio destroyed")
    this.audio.pause();
    this.audio.currentTime = 0; 
  }
}
