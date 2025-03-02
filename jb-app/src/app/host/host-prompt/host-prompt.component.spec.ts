import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPromptComponent } from './host-prompt.component';

describe('HostPromptComponent', () => {
  let component: HostPromptComponent;
  let fixture: ComponentFixture<HostPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostPromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
