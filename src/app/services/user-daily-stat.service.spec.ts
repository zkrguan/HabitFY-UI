import { TestBed } from '@angular/core/testing';

import { UserDailyStatService } from './user-daily-stat.service';

describe('UserDailyStatService', () => {
  let service: UserDailyStatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDailyStatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
