import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostShowDrawingsComponent } from './host-show-drawings.component';

describe('HostShowDrawingsComponent', () => {
  let component: HostShowDrawingsComponent;
  let fixture: ComponentFixture<HostShowDrawingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostShowDrawingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostShowDrawingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
