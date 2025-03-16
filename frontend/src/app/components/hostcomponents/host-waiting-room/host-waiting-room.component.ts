import { Component, Input, input, Output } from '@angular/core';
import { Player } from '../../../models/gamemodels';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

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

    @Output()
    emitEvent = new Subject<string>();

    toggleEvent(event:string) {
      this.emitEvent.next(event)
    }
    


}
