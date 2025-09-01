import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { CommonModalComponent } from './common-modal.component';

describe('CommonModalComponent', () => {
  let component: CommonModalComponent;
  let fixture: ComponentFixture<CommonModalComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModalComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(CommonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle background click', () => {
    component.onClose = mockEventEmitter;

    const element = fixture.debugElement.query(
      By.css(`[data-testid="modal-bg-close"]`)
    );
    spyOn(mockEventEmitter, 'emit');
    element.nativeElement.click();
    fixture.detectChanges();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });

  it('should handle confirm click', () => {
    component.onConfirm = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleConfirmClick();
    fixture.detectChanges();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });

  it('should handle cancel click', () => {
    component.onCancel = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleCancelClick();
    fixture.detectChanges();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });
});
