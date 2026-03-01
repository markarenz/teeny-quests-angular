import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPropGemFrameDiamondComponent } from './svg-prop-gem-frame-diamond.component';

describe('SvgPropGemFrameDiamondComponent', () => {
  let component: SvgPropGemFrameDiamondComponent;
  let fixture: ComponentFixture<SvgPropGemFrameDiamondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPropGemFrameDiamondComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgPropGemFrameDiamondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
