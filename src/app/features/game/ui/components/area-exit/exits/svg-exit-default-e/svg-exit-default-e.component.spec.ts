import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgExitDefaultEComponent } from './svg-exit-default-e.component';
import { EventEmitter } from '@angular/core';

describe('SvgExitDefaultEComponent', () => {
  let component: SvgExitDefaultEComponent;
  let fixture: ComponentFixture<SvgExitDefaultEComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExitDefaultEComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(SvgExitDefaultEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle click', () => {
    component.isClickable = true;
    component.onClick = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleClick();
    expect(component.onClick.emit).toHaveBeenCalled();
  });
});
