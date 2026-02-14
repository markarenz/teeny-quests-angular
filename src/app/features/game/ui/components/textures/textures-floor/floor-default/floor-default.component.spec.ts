import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorDefaultComponent } from './floor-default.component';
import { defaultFloorProps } from '../floor-utils';
import { EventEmitter } from '@angular/core';

describe('FloorDefaultComponent', () => {
  let component: FloorDefaultComponent;
  let fixture: ComponentFixture<FloorDefaultComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorDefaultComponent],
    }).compileComponents();
    mockEventEmitter = new EventEmitter<string>();

    fixture = TestBed.createComponent(FloorDefaultComponent);
    component = fixture.componentInstance;
    component.floorProps = defaultFloorProps;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle click', () => {
    component.onClick = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleClick();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });
});
