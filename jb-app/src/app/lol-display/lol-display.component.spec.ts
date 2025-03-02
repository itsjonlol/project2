import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolDisplayComponent } from './lol-display.component';

describe('LolDisplayComponent', () => {
  let component: LolDisplayComponent;
  let fixture: ComponentFixture<LolDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LolDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LolDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
