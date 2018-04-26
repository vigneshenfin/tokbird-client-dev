import { TestBed, inject } from '@angular/core/testing';

import { AllEventsCalendarService } from './all-events-calendar.service';

describe('AllEventsCalendarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllEventsCalendarService]
    });
  });

  it('should be created', inject([AllEventsCalendarService], (service: AllEventsCalendarService) => {
    expect(service).toBeTruthy();
  }));
});
