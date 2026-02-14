import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorWallTopComponent } from './floor-wall-top.component';
import { defaultFloorProps } from '../floor-utils';
import { EventEmitter } from '@angular/core';

describe('FloorWallTopComponent', () => {
  let component: FloorWallTopComponent;
  let fixture: ComponentFixture<FloorWallTopComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorWallTopComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(FloorWallTopComponent);
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
