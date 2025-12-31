import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameMovementOptionButtonComponent } from './game-movement-option-button.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MessageService } from '@app/features/game/services/message/message.service';
import { AudioService } from '@app/features/main/services/audio/audio-service.service';

describe('GameMovementOptionButtonComponent', () => {
  let component: GameMovementOptionButtonComponent;
  let fixture: ComponentFixture<GameMovementOptionButtonComponent>;
  let messageService: MessageService;
  let audioService: AudioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMovementOptionButtonComponent, ToastrModule.forRoot()],
      providers: [ToastrService],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    messageService = TestBed.inject(MessageService);
    audioService = TestBed.inject(AudioService);
    fixture = TestBed.createComponent(GameMovementOptionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
