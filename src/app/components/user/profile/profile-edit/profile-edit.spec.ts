import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEdit } from './profile-edit';

describe('ProfileEdit', () => {
  let component: ProfileEdit;
  let fixture: ComponentFixture<ProfileEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
