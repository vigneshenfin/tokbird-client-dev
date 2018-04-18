import { TestBed, inject } from '@angular/core/testing';

import { MeetingPollsService } from './meeting-polls.service';

describe('MeetingPollsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeetingPollsService]
    });
  });

  it('should be created', inject([MeetingPollsService], (service: MeetingPollsService) => {
    expect(service).toBeTruthy();
  }));
});
