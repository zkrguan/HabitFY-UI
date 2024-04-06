import { TestBed } from '@angular/core/testing';

import { ProgressRecordService } from './progress-record.service';

describe('ProgressRecordService', () => {
  let service: ProgressRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
