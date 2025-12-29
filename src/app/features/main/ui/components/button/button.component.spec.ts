import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';
import { ButtonComponent } from './button.component';
import { EventEmitter } from '@angular/core';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let mockEventEmitter: EventEmitter<string>;
  let audioService: AudioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    mockEventEmitter = new EventEmitter<string>();
    audioService = TestBed.inject(AudioService);
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle click', () => {
    component.onButtonClick = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.handleButtonClick();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });
});
