import { TestBed, inject } from '@angular/core/testing';

import { SecuritySettingsService } from './security-settings.service';

describe('SecuritySettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecuritySettingsService]
    });
  });

  it('should be created', inject([SecuritySettingsService], (service: SecuritySettingsService) => {
    expect(service).toBeTruthy();
  }));
});
