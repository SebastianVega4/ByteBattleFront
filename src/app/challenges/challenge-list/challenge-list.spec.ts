import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeListComponent } from './challenge-list';

describe('ChallengeList', () => {
  let component: ChallengeListComponent;
  let fixture: ComponentFixture<ChallengeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
