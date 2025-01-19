import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemCoinsComponent } from './svg-item-coins.component';

describe('SvgItemCoinsComponent', () => {
  let component: SvgItemCoinsComponent;
  let fixture: ComponentFixture<SvgItemCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemCoinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgItemCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
