import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cobro } from './cobro';

describe('Cobro', () => {
  let component: Cobro;
  let fixture: ComponentFixture<Cobro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cobro],
    }).compileComponents();

    fixture = TestBed.createComponent(Cobro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
