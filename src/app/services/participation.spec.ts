import { TestBed } from '@angular/core/testing';

import { ParticipationService } from './participation';

describe('ParticipationService', () => {
  let service: ParticipationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
