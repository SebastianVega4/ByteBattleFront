import { TestBed } from '@angular/core/testing';

import { AdminNotification } from './admin-notification';

describe('AdminNotification', () => {
  let service: AdminNotification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminNotification);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
