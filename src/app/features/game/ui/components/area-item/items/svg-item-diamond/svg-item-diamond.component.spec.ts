import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemDiamondComponent } from './svg-item-diamond.component';

describe('SvgItemDiamondComponent', () => {
  let component: SvgItemDiamondComponent;
  let fixture: ComponentFixture<SvgItemDiamondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemDiamondComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgItemDiamondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
