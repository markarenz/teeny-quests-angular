import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemBagOfCoinsComponent } from './svg-item-bag-of-coins.component';

describe('SvgItemBagOfCoinsComponent', () => {
  let component: SvgItemBagOfCoinsComponent;
  let fixture: ComponentFixture<SvgItemBagOfCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemBagOfCoinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgItemBagOfCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
