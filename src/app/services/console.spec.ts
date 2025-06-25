import { TestBed } from '@angular/core/testing';

import { ConsoleService } from './console';

describe('ConsoleService', () => {
  let service: ConsoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
