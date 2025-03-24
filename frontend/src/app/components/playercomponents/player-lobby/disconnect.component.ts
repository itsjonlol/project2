import { Component, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-disconnect',
  imports: [],
  templateUrl: './disconnect.component.html',
  styleUrl: './disconnect.component.css'
})
export class DisconnectComponent {

  @Output()
  emitDisconnect = new Subject<boolean>();

  disconnect():void {
    this.emitDisconnect.next(true)
  }
}
