import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorRoofSimpleComponent } from './floor-roof-simple.component';
import { defaultFloorProps } from '../floor-utils';
import { EventEmitter } from '@angular/core';

describe('FloorRoofComponent', () => {
  let component: FloorRoofSimpleComponent;
  let fixture: ComponentFixture<FloorRoofSimpleComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorRoofSimpleComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(FloorRoofSimpleComponent);
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
