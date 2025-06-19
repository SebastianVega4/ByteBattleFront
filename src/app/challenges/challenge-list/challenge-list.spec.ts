import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeList } from './challenge-list';

describe('ChallengeList', () => {
  let component: ChallengeList;
  let fixture: ComponentFixture<ChallengeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
