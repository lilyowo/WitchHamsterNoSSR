import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lenormand } from './lenormand';

describe('Lenormand', () => {
  let component: Lenormand;
  let fixture: ComponentFixture<Lenormand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lenormand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lenormand);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
