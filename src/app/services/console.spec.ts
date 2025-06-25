import { TestBed } from '@angular/core/testing';

import { Console } from './console';

describe('Console', () => {
  let service: Console;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Console);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
