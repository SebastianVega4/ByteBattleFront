import { TestBed } from '@angular/core/testing';

import { AdminNotificationService } from './admin-notification';

describe('AdminNotification', () => {
  let service: AdminNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
