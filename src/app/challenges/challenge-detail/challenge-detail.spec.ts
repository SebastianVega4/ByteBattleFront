import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeDetail } from './challenge-detail';

describe('ChallengeDetail', () => {
  let component: ChallengeDetail;
  let fixture: ComponentFixture<ChallengeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
