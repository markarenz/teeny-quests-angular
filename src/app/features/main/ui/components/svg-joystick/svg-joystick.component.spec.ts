import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgJoystickComponent } from './svg-joystick.component';

describe('SvgJoystickComponent', () => {
  let component: SvgJoystickComponent;
  let fixture: ComponentFixture<SvgJoystickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgJoystickComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(SvgJoystickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
