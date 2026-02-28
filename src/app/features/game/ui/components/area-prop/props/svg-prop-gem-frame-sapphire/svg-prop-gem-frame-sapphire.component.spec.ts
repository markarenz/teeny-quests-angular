import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPropGemFrameSapphireComponent } from './svg-prop-gem-frame-sapphire.component';

describe('SvgPropGemFrameSapphireComponent', () => {
  let component: SvgPropGemFrameSapphireComponent;
  let fixture: ComponentFixture<SvgPropGemFrameSapphireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPropGemFrameSapphireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgPropGemFrameSapphireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
