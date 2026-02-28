import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPropGemFrameRubyComponent } from './svg-prop-gem-frame-ruby.component';

describe('SvgPropGemFrameRubyComponent', () => {
  let component: SvgPropGemFrameRubyComponent;
  let fixture: ComponentFixture<SvgPropGemFrameRubyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPropGemFrameRubyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgPropGemFrameRubyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
