import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageCardComponent } from './home-page-card.component';

describe('HomePageCardComponent', () => {
  let component: HomePageCardComponent;
  let fixture: ComponentFixture<HomePageCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomePageCardComponent]
    });
    fixture = TestBed.createComponent(HomePageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
