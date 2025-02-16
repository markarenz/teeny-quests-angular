import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgMiniLogoComponent } from './svg-mini-logo.component';

describe('SvgMiniLogoComponent', () => {
  let component: SvgMiniLogoComponent;
  let fixture: ComponentFixture<SvgMiniLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgMiniLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgMiniLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
