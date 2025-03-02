import { inject, Injectable, signal } from '@angular/core';
import { Auth, user, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from '../models/userinterface';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
  currentUserSig = signal<UserInterface | null | undefined>(undefined)

  register(email:string,username:string,password:string):Observable<void> {
    const promise = createUserWithEmailAndPassword
      (this.firebaseAuth,email,password)
      .then(response => updateProfile(response.user,{displayName:username}))

    return from(promise);  
  }

  loginViaEmailAndPassword(email:string,password:string):Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth,email,password).then(()=>{})
    return from(promise)
  }

  loginViaGoogle():Observable<void> {
    const promise = signInWithPopup(this.firebaseAuth,new GoogleAuthProvider()).then(()=>{})
    return from(promise);

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
