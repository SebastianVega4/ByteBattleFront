import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProfileView } from './public-profile-view';

describe('PublicProfileView', () => {
  let component: PublicProfileView;
  let fixture: ComponentFixture<PublicProfileView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicProfileView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicProfileView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
