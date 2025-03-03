import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common'; 
import { Router } from '@angular/router'; 



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], 
  standalone: true
})
export class DashboardComponent {
  // user: User | undefined;
  

  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.userService.getUser().subscribe({
    //   next: (data:User) => {
    //     this.user = data;
    //     // Store the username in localStorage
    //     if (data.name) {
    //       localStorage.setItem('username', data.name);
    //     }
    //   },
    //   error: error => console.error('Error fetching user data', error),
    //   complete: () => console.log('User data fetch complete')
    // });
  }
  // logout(): void {

  //   console.log("Logout button clicked");
  //   this.userService.logout().subscribe({
      

  //     next: () => {
  //       console.log('User logged out successfully');
  //       localStorage.removeItem("username");
  //       localStorage.removeItem('token'); // ✅ Remove any stored tokens if used
  //       this.router.navigate(['/login']); // ✅ Redirect to login page after logout
  //     },
  //     error: error => console.error('Error logging out', error)
  //   });
  // }
  hostGame(): void {
    // Navigate to host lobby
    this.router.navigate(['/host','lobby']);
  }


  enterGame(): void {
    this.router.navigate(['/enter-game']);
  }

  viewGallery():void {
    this.router.navigate(['/testsub'])
  }


 
}
