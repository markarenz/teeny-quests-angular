import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgExitDefaultSComponent } from './svg-exit-default-s.component';
import { EventEmitter } from '@angular/core';

describe('SvgExitDefaultSComponent', () => {
  let component: SvgExitDefaultSComponent;
  let fixture: ComponentFixture<SvgExitDefaultSComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExitDefaultSComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(SvgExitDefaultSComponent);
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
