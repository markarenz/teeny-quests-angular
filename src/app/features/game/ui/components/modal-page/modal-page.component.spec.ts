import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPageComponent } from './modal-page.component';
import { EventEmitter } from '@angular/core';

describe('ModalPageComponent', () => {
  let component: ModalPageComponent;
  let fixture: ComponentFixture<ModalPageComponent>;
  let mockEventEmitter: EventEmitter<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPageComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    mockEventEmitter = new EventEmitter<void>();
    fixture = TestBed.createComponent(ModalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle confirm', () => {
    component.onConfirm = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleConfirmClick();
    expect(component.onConfirm.emit).toHaveBeenCalled();
  });

  it('should handle close', () => {
    component.onClose = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleCloseClick();
    expect(component.onClose.emit).toHaveBeenCalled();
  });
});
