import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgExitCaveWComponent } from './svg-exit-cave-w.component';
import { EventEmitter } from '@angular/core';

describe('SvgExitCaveWComponent', () => {
  let component: SvgExitCaveWComponent;
  let fixture: ComponentFixture<SvgExitCaveWComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExitCaveWComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(SvgExitCaveWComponent);
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
