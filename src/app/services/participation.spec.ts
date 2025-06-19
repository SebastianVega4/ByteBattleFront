import { TestBed } from '@angular/core/testing';

import { Participation } from './participation';

describe('Participation', () => {
  let service: Participation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Participation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
