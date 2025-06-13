import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgExitDefaultNComponent } from './svg-exit-default-n.component';
import { EventEmitter } from '@angular/core';

describe('SvgExitDefaultNComponent', () => {
  let component: SvgExitDefaultNComponent;
  let fixture: ComponentFixture<SvgExitDefaultNComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExitDefaultNComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(SvgExitDefaultNComponent);
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
