import { TestBed, inject } from '@angular/core/testing';

import { MeetingDetailsService } from './meeting-details.service';

describe('MeetingDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeetingDetailsService]
    });
  });

  it('should be created', inject([MeetingDetailsService], (service: MeetingDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
