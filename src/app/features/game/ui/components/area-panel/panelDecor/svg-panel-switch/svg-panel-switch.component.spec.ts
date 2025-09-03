import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPanelSwitchComponent } from './svg-panel-switch.component';

describe('SvgPanelSwitchComponent', () => {
  let component: SvgPanelSwitchComponent;
  let fixture: ComponentFixture<SvgPanelSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPanelSwitchComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPanelSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
