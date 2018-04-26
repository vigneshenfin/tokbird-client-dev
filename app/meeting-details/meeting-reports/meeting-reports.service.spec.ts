import { TestBed, inject } from '@angular/core/testing';

import { MeetingReportsService } from './meeting-reports.service';

describe('MeetingReportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeetingReportsService]
    });
  });

  it('should be created', inject([MeetingReportsService], (service: MeetingReportsService) => {
    expect(service).toBeTruthy();
  }));
});
