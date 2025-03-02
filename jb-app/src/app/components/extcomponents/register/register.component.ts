import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { FireAuthService } from '../../../services/fire-auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fireAuthService = inject(FireAuthService);
  router = inject(Router);
  private fb = inject(FormBuilder)



  form = this.fb.nonNullable.group({
    username:['',Validators.required],
    email: ['',Validators.required],
    password: ['',Validators.required]
  })

  errorMessage:string|null = null

  onSubmit():void {
    const rawForm = this.form.getRawValue();
    this.fireAuthService.register(rawForm.email,rawForm.username,rawForm.password)
    .subscribe({
      next: () => {
      this.router.navigate(['/login'])
    },
      error: (err) => {
        this.errorMessage = err.code
      }
  });
  } 
}

