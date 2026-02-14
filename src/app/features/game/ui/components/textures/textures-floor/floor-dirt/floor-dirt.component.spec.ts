import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorDirtComponent } from './floor-dirt.component';
import { defaultFloorProps } from '../floor-utils';
import { EventEmitter } from '@angular/core';

describe('FloorDirtComponent', () => {
  let component: FloorDirtComponent;
  let fixture: ComponentFixture<FloorDirtComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorDirtComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(FloorDirtComponent);
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
