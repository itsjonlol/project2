import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsubComponent } from './testsub.component';

describe('TestsubComponent', () => {
  let component: TestsubComponent;
  let fixture: ComponentFixture<TestsubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
