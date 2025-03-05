import { Component, OnInit } from '@angular/core';
import { PlayerSubmission } from '../../../models/gamemodels';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { TestsubComponent } from '../testsub/testsub.component';
import { TransitComponent } from '../transit/transit.component';
import { fadeAnimation } from '../../animations/animations';

@Component({
  selector: 'app-testshow',
  imports: [CommonModule,TestsubComponent,TransitComponent],
  templateUrl: './testshow.component.html',
  styleUrl: './testshow.component.css',
  animations:[
    trigger('curtainRise', [
      state('open', style({
        transform: 'translateY(-100%)', // Curtain moves up
        opacity: 0
      })),
      state('closed', style({
        transform: 'translateY(0%)', // Curtain covers the content
        opacity: 1
      })),
      transition('open => closed', [
        animate('1s ease-in-out') // Curtain closes (moves down)
      ]),
      transition('closed => open', [
        animate('1s ease-in-out') // Curtain opens (moves up)
      ])
    ]),fadeAnimation
  ]
  
})
export class TestshowComponent implements OnInit {

  drawings:PlayerSubmission[] = [];

  currentIndex:number=0;

  drawing!:PlayerSubmission

  isNextTransition: boolean = false;
  isPrevTransition: boolean = false;
  curtainState: 'open' | 'closed' = 'closed';

  currentGameState:string = "TESTSHOW"

  ngOnInit(): void {
    this.drawings = [
      {
        playerName: 'Alice',
        title: 'Sunset Bliss',
        description: 'A beautiful sunset over the mountains.',
        imageUrl: 'https://picsum.photos/200/300?random=1',
        total: 85,
        isWinner: false
      },
      {
        playerName: 'Bob',
        title: 'City Lights',
        description: 'A vibrant cityscape at night.',
        imageUrl: 'https://picsum.photos/200/300?random=2',
        total: 92,
        isWinner: true
      },
      {
        playerName: 'Charlie',
        title: 'Ocean Waves',
        description: 'A peaceful beach with crashing waves.',
        imageUrl: 'https://picsum.photos/200/300?random=3',
        total: 78,
        isWinner: false
      },
      {
        playerName: 'Dave',
        title: 'Forest Adventure',
        description: 'A dense forest with a hidden pathway.',
        imageUrl: 'https://picsum.photos/200/300?random=4',
        total: 88,
        isWinner: false
      }
    ];
    this.curtainState='closed';
    this.drawing=this.drawings[this.currentIndex];
  }
  
  nextImage(): void {
    this.curtainState = 'open'; // Open the curtain (move it up)
    setTimeout(() => {
      this.currentIndex++;
      if (this.currentIndex >= this.drawings.length) {
        this.currentIndex = 0; // Loop back to the first image
      }
      this.drawing = this.drawings[this.currentIndex];
      this.curtainState = 'closed'; // Close the curtain (move it down)
    }, 5000); // Match the duration of the animation
  }

  displayTestSub():void {
    let countdown:number=5
    
    this.currentGameState = "TRANSIT"
    const interval = setInterval(() => {
      countdown--;
      if (countdown === 0) {
        clearInterval(interval);
        this.currentGameState = 'TESTSUB'; // Move to voting after 5 seconds
      }
    }, 1000);
    // this.currentGameState= "TESTSUB"
  }
  
}
