import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { GameEndMessageComponent } from './game-end-message.component';

describe('GameEndMessageComponent', () => {
  let component: GameEndMessageComponent;
  let fixture: ComponentFixture<GameEndMessageComponent>;
  let mockEventEmitter: EventEmitter<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEndMessageComponent],
    }).compileComponents();

    mockEventEmitter = new EventEmitter<void>();
    fixture = TestBed.createComponent(GameEndMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle click on confirm', () => {
    component.handleGameEndConfirmClick = mockEventEmitter;
    spyOn(mockEventEmitter, 'emit');
    component.triggerGameEndConfirm();
    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });
});
