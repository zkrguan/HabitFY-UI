import { TestBed } from '@angular/core/testing';

import { RegisterProfileService } from './register-profile.service';

describe('RegisterProfileService', () => {
  let service: RegisterProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
