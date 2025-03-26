import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameEntry } from '../../../models/gamemodels';
import { Router } from '@angular/router';

import { GameService }from '../../../services/game.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-enter-game',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './enter-game.component.html',
  styleUrl: './enter-game.component.css'
})
export class EnterGameComponent implements OnInit{
  
  errorMessage:string ='';


  gameCode:number=0;

  username: string = '';
  
  gameEntry:GameEntry = {
    gameCode:this.gameCode,
    name:this.username
  }
  
  router = inject(Router);
  gameService = inject(GameService);

  protected form!:FormGroup
  private fb = inject(FormBuilder)


  ngOnInit(): void {
    this.form = this.createForm();
    //get the username from session storage
    this.username = sessionStorage.getItem("username") || 'player';
    
  }
  

  submit(gameCode:number) {


 

    this.gameEntry.gameCode = this.form.value.gameCode
    this.gameCode =this.gameEntry.gameCode 
    this.gameEntry.name = this.username;
    
    console.log(this.gameEntry)

    //post the access room to backend to enter the gameroom
    this.gameService.postAccessRoom(this.gameEntry).subscribe({
        next: (response) => {
          console.log(response);
          this.errorMessage='';
          this.router.navigate(['player','lobby',this.gameCode])
        },
        error: (err:HttpErrorResponse) => {
         
          this.errorMessage = err.error.message;
        }
    })
  }
  
  createForm():FormGroup {
    return this.fb.group({
      gameCode: this.fb.control<number>(0)
    
    })
  }
 
  
}
