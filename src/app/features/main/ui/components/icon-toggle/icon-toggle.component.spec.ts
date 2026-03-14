import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconToggleComponent } from './icon-toggle.component';
import { EventEmitter } from '@angular/core';

describe('IconToggleComponent', () => {
  let component: IconToggleComponent;
  let fixture: ComponentFixture<IconToggleComponent>;
  let mockEventEmitter: EventEmitter<boolean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconToggleComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<boolean>();

    fixture = TestBed.createComponent(IconToggleComponent);
    component = fixture.componentInstance;
    component.onToggleChange = mockEventEmitter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create', () => {
    spyOn(component.onToggleChange, 'emit');

    component.handleToggle();
    expect(component.toggleState).toBeTrue();
    expect(component.onToggleChange.emit).toHaveBeenCalledWith(true);
  });
});
