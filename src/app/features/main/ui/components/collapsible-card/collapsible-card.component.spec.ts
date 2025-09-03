import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { CollapsibleCardComponent } from './collapsible-card.component';

describe('CollapsibleCardComponent', () => {
  let component: CollapsibleCardComponent;
  let fixture: ComponentFixture<CollapsibleCardComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleCardComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(CollapsibleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockEventEmitter = new EventEmitter<string>();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle toggle', () => {
    component.onCollapse = mockEventEmitter;
    component.isOpen = false;
    spyOn(mockEventEmitter, 'emit');
    component.toggleCollapse();
    fixture.detectChanges();
    component.toggleCollapse();
    fixture.detectChanges();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });

  it('should handle new button click', () => {
    component.onNewButtonClick = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleNewButtonClick();
    fixture.detectChanges();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });
});
