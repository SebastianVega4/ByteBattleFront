import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeManagement } from './challenge-management';

describe('ChallengeManagement', () => {
  let component: ChallengeManagement;
  let fixture: ComponentFixture<ChallengeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
