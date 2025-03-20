import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { ModalBgComponent } from './modal-bg.component';

describe('ModalBgComponent', () => {
  let component: ModalBgComponent;
  let fixture: ComponentFixture<ModalBgComponent>;
  let mockEventEmitter: EventEmitter<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBgComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    fixture = TestBed.createComponent(ModalBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger prop function on click', () => {
    component.onBgClick = mockEventEmitter;

    const element = fixture.debugElement.query(
      By.css(`[data-testid="modal-bg-close"]`)
    );
    spyOn(mockEventEmitter, 'emit');
    element.nativeElement.click();
    fixture.detectChanges();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });
});
