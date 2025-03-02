import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerVoteInputComponent } from './player-vote-input.component';

describe('PlayerVoteInputComponent', () => {
  let component: PlayerVoteInputComponent;
  let fixture: ComponentFixture<PlayerVoteInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerVoteInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerVoteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
