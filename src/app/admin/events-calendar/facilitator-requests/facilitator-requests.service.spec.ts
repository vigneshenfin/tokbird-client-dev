import { TestBed, inject } from '@angular/core/testing';

import { FacilitatorRequestsService } from './facilitator-requests.service';

describe('FacilitatorRequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacilitatorRequestsService]
    });
  });

  it('should be created', inject([FacilitatorRequestsService], (service: FacilitatorRequestsService) => {
    expect(service).toBeTruthy();
  }));
});
