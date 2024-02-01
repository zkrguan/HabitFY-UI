import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSetupUpdateComponent } from './profile-setup-update.component';

describe('ProfileSetupUpdateComponent', () => {
  let component: ProfileSetupUpdateComponent;
  let fixture: ComponentFixture<ProfileSetupUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSetupUpdateComponent]
    });
    fixture = TestBed.createComponent(ProfileSetupUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
