import { TestBed, inject } from '@angular/core/testing';

import { InviteUsersService } from './invite-users.service';

describe('InviteUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InviteUsersService]
    });
  });

  it('should be created', inject([InviteUsersService], (service: InviteUsersService) => {
    expect(service).toBeTruthy();
  }));
});
