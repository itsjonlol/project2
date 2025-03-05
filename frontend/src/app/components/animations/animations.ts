import { trigger, transition, style, animate } from '@angular/animations';

// Reusable fade animation
export const fadeAnimation = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }), // Start with opacity 0
    animate('10s ease-in-out', style({ opacity: 1 })) // Fade in
  ]),
  transition(':leave', [
    animate('10s ease-in-out', style({ opacity: 0 })) // Fade out
  ])
]);

// Reusable slide animation
export const slideAnimation = trigger('slide', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }), // Start off-screen to the right
    animate('3s ease-in-out', style({ transform: 'translateX(0%)' })) // Slide in
  ]),
  transition(':leave', [
    animate('3s ease-in-out', style({ transform: 'translateX(-100%)' })) // Slide out to the left
  ])
]);