import { Component, Input, input } from '@angular/core';
import { Player } from '../../../models/gamemodels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-host-waiting-room',
  imports: [CommonModule],
  templateUrl: './host-waiting-room.component.html',
  styleUrl: './host-waiting-room.component.css'
})
export class HostWaitingRoomComponent {

    @Input({required:true}) 
    players!: Player[]

    @Input({required:true}) 
    username!: string;

    @Input()
    gameCode:number = 0
    


}
