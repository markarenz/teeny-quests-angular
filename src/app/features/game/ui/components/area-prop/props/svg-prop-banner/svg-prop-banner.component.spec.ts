import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPropBannerComponent } from './svg-prop-banner.component';

describe('SvgPropBannerComponent', () => {
  let component: SvgPropBannerComponent;
  let fixture: ComponentFixture<SvgPropBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPropBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgPropBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
