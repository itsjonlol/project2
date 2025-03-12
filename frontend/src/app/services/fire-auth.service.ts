import { inject, Injectable, signal } from '@angular/core';
import { Auth, user, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from '@angular/fire/auth';
import { EMPTY, Observable, from, switchMap } from 'rxjs';
import { UserInterface } from '../models/userinterface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  firebaseAuth = inject(Auth)
  userService = inject(UserService)
  
  user$ = user(this.firebaseAuth)
  currentUserSig = signal<UserInterface | null | undefined>(undefined)

  register(email:string,username:string,password:string):Observable<void> {
    const promise = createUserWithEmailAndPassword
      (this.firebaseAuth,email,password)
      .then(response => updateProfile(response.user,{displayName:username}))

    return from(promise);  
  }

  // loginViaEmailAndPassword(email:string,password:string):Observable<void> {
  //   const promise = signInWithEmailAndPassword(this.firebaseAuth,email,password).then(()=>{})
  //   return from(promise)
  // }
  loginViaEmailAndPassword(email: string, password: string): Observable<void> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      switchMap(response => {
        const user = response.user;
        if (!user) return EMPTY; // If no user, return an empty observable
  
        console.log("User logged in:", user.uid);
        
        // Send user data to backend
        return this.userService.postUser({
          userId: user.uid,
          email: user.email!,
          username: user.displayName || 'Guest'
        });
      })
    );
  }

  // loginViaGoogle():Observable<void> {
  //   const promise = signInWithPopup(this.firebaseAuth,new GoogleAuthProvider()).then(()=>{})
  //   return from(promise);

  // }
  // to change syntax
  loginViaGoogle(): Observable<void> {
    return from(signInWithPopup(this.firebaseAuth, new GoogleAuthProvider())).pipe(
      switchMap((response) => {
        const user = response.user;
        if (!user) return EMPTY; // ✅ If login fails, return an empty observable
  
        console.log("User logged in via Google:", user.uid);
  
        // ✅ Send user data to backend
        return this.userService.postUser({
          userId: user.uid,
          email: user.email!,
          username: user.displayName || 'Guest'
        });
      })
    );
  }
  //may have to remove
  loginViaGitHub():Observable<void> {
    const promise = signInWithPopup(this.firebaseAuth,new GithubAuthProvider()).then(()=>{
    
    })
    return from(promise);
  }
  

  logout():Observable<void> {
    const promise = signOut(this.firebaseAuth)
    return from(promise);
  }

  
  
}
