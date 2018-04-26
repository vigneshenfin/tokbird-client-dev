import { TestBed, inject } from '@angular/core/testing';

import { MeetingUsersService } from './meeting-users.service';

describe('MeetingUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeetingUsersService]
    });
  });

  it('should be created', inject([MeetingUsersService], (service: MeetingUsersService) => {
    expect(service).toBeTruthy();
  }));
});
