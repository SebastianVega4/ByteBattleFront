// src/app/shared/components/notification/notification.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification';
import { NotificationService } from '../../services/notification';
import { AuthService } from '../../../auth/auth';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  
  const mockNotificationService = {
    notifications$: of([]),
    unreadCount$: of(0),
    markAsRead: jest.fn().mockReturnValue(Promise.resolve()),
    markAllAsRead: jest.fn().mockReturnValue(Promise.resolve())
  };
  
  const mockAuthService = {
    getCurrentUser: jest.fn().mockReturnValue({ uid: 'test-user' })
  };
  
  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle notifications', () => {
    component.toggleNotifications();
    expect(component.showNotifications).toBe(true);
  });

  // Agrega más pruebas según sea necesario
});