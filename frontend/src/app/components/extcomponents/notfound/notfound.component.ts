import { Component } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
@Component({
  selector: 'app-notfound',
  imports: [LottieComponent],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css'
})
export class NotfoundComponent {
  options1: AnimationOptions = {
    path: '/lottiefiles/404notfound.json',
  };
  
}
