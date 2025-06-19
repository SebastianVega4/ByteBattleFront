import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Participation } from './participation';

describe('Participation', () => {
  let component: Participation;
  let fixture: ComponentFixture<Participation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Participation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Participation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
