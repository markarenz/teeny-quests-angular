import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPropGemFrameEmeraldComponent } from './svg-prop-gem-frame-emerald.component';

describe('SvgPropGemFrameEmeraldComponent', () => {
  let component: SvgPropGemFrameEmeraldComponent;
  let fixture: ComponentFixture<SvgPropGemFrameEmeraldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPropGemFrameEmeraldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgPropGemFrameEmeraldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
