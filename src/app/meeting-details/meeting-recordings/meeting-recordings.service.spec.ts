import { TestBed, inject } from '@angular/core/testing';

import { MeetingRecordingsService } from './meeting-recordings.service';

describe('MeetingRecordingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeetingRecordingsService]
    });
  });

  it('should be created', inject([MeetingRecordingsService], (service: MeetingRecordingsService) => {
    expect(service).toBeTruthy();
  }));
});
