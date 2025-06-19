import { TestBed } from '@angular/core/testing';

import { Challenge } from './challenge';

describe('Challenge', () => {
  let service: Challenge;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Challenge);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
