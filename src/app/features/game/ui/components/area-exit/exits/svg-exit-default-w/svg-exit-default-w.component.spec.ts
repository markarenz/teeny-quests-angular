import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgExitDefaultWComponent } from './svg-exit-default-w.component';
import { EventEmitter } from '@angular/core';

describe('SvgExitDefaultWComponent', () => {
  let component: SvgExitDefaultWComponent;
  let fixture: ComponentFixture<SvgExitDefaultWComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExitDefaultWComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(SvgExitDefaultWComponent);
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
