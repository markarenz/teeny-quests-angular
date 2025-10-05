import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPropSwitchComponent } from './svg-prop-switch.component';

describe('SvgPropSwitchComponent', () => {
  let component: SvgPropSwitchComponent;
  let fixture: ComponentFixture<SvgPropSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPropSwitchComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPropSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
