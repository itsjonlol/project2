import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDrawingComponent } from './player-drawing.component';

describe('PlayerDrawingComponent', () => {
  let component: PlayerDrawingComponent;
  let fixture: ComponentFixture<PlayerDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerDrawingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
