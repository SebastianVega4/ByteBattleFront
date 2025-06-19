import { TestBed } from '@angular/core/testing';

import { Leaderboard } from './leaderboard';

describe('Leaderboard', () => {
  let service: Leaderboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Leaderboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
