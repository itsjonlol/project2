import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPlayerVotesComponent } from './host-player-votes.component';

describe('HostPlayerVotesComponent', () => {
  let component: HostPlayerVotesComponent;
  let fixture: ComponentFixture<HostPlayerVotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostPlayerVotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostPlayerVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
