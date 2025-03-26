import { inject, Injectable, signal } from '@angular/core';
import { Auth, user, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, browserSessionPersistence, setPersistence } from '@angular/fire/auth';
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

  //set persistence to browser session for firebase auth
  constructor() {
    
    this.firebaseAuth.setPersistence(browserSessionPersistence)
      .catch((error) => {
        console.error('error setting persistence:', error);
      });
  }


  // register a user with email and password, but log them out after registration
  register(email: string, username: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth,email,password)
          .then(response => updateProfile(response.user,{displayName:username}))

        return from(promise.then(() => signOut(this.firebaseAuth)));
  }


  
  loginViaEmailAndPassword(email: string, password: string): Observable<void> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      switchMap(response => {
        const user = response.user;
        if (!user) return EMPTY; 
  
        return this.userService.postUser({
          userId: user.uid,
          email: user.email!,
          username: user.displayName || 'Guest'
        });
      })
    );
  }

  loginViaGoogle(): Observable<void> {
    return from(signInWithPopup(this.firebaseAuth, new GoogleAuthProvider())).pipe(
      switchMap((response) => {
        const user = response.user;
        if (!user) return EMPTY; 
  
        // console.log("user logged in via google:", user.uid);
  
        return this.userService.postUser({
          userId: user.uid,
          email: user.email!,
          username: user.displayName || 'Guest'
        });
      })
    );
  }

  logout():Observable<void> {
    const promise = signOut(this.firebaseAuth)
    return from(promise);
  }

  
  
}
