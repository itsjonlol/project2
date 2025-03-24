import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { FireAuthService } from '../../../services/fire-auth.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  

  auth = inject(Auth);
  router = inject(Router);
  private fb = inject(FormBuilder)

  userService = inject(UserService);
  

  fireAuthService = inject(FireAuthService);
  errorMessage:string|null = null;

  form = this.fb.nonNullable.group({
    email: ['',Validators.required],
    password: ['',Validators.required]
  })

  constructor() {}



  onSubmit():void {
    const rawForm = this.form.getRawValue();
    this.fireAuthService.loginViaEmailAndPassword(rawForm.email,rawForm.password)
    .subscribe({
      next: () => {
       
        this.router.navigate(['/dashboard'])
    },
      error: (err) => {
        this.errorMessage = err.code
      }
  });
  } 

  loginViaGoogle():void {
    this.fireAuthService.loginViaGoogle()
    .subscribe({
      next: () => {

        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        this.errorMessage = err.code
      }
    })
  }

  // loginViaGitHub():void {
  //   this.fireAuthService.loginViaGitHub()
  //   .subscribe({
  //     next: () => {

  //       this.router.navigate(['/dashboard'])
  //     },
  //     error: (err) => {
  //       this.errorMessage = err.code
  //     }
  //   })
  // }
 




}
