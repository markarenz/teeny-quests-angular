import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorLavaComponent } from './floor-lava.component';
import { defaultFloorProps } from '../floor-utils';
import { EventEmitter } from '@angular/core';

describe('FloorLavaComponent', () => {
  let component: FloorLavaComponent;
  let fixture: ComponentFixture<FloorLavaComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorLavaComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(FloorLavaComponent);
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
