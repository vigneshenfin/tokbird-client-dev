import { TestBed, inject } from '@angular/core/testing';

import { AllEventsListService } from './all-events-list.service';

describe('AllEventsListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllEventsListService]
    });
  });

  it('should be created', inject([AllEventsListService], (service: AllEventsListService) => {
    expect(service).toBeTruthy();
  }));
});
