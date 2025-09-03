import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { ButtonCloseComponent } from './button-close.component';

describe('ButtonCloseComponent', () => {
  let component: ButtonCloseComponent;
  let fixture: ComponentFixture<ButtonCloseComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCloseComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockEventEmitter = new EventEmitter<string>();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle click', () => {
    component.onButtonClick = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleButtonClick();
    fixture.detectChanges();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });
});
