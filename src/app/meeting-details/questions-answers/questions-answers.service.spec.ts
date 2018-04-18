import { TestBed, inject } from '@angular/core/testing';

import { QuestionsAnswersService } from './questions-answers.service';

describe('QuestionsAnswersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionsAnswersService]
    });
  });

  it('should be created', inject([QuestionsAnswersService], (service: QuestionsAnswersService) => {
    expect(service).toBeTruthy();
  }));
});
