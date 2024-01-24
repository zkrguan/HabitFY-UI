import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailiesCardComponent } from './dailies-card.component';

describe('DailiesCardComponent', () => {
  let component: DailiesCardComponent;
  let fixture: ComponentFixture<DailiesCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailiesCardComponent]
    });
    fixture = TestBed.createComponent(DailiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
