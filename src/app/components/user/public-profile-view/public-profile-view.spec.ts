import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProfileViewComponent } from './public-profile-view';

describe('PublicProfileView', () => {
  let component: PublicProfileViewComponent;
  let fixture: ComponentFixture<PublicProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicProfileViewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PublicProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
