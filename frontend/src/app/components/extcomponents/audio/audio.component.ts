import { Component } from '@angular/core';

@Component({
  selector: 'app-audio',
  imports: [],
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.css'
})
export class AudioComponent {
  playSound:boolean = false;
  audio = new Audio('/music/track1.mp3'); // Create the audio object once

  playMusic(): void {
      this.playSound = !this.playSound;
  
      if (this.playSound) {
          this.audio.currentTime = 0; // Reset to the beginning
          this.audio.load();
          this.audio.play().catch(err => console.error("Error playing audio:", err));
      } else {
          this.audio.pause();
      }
  }
}
