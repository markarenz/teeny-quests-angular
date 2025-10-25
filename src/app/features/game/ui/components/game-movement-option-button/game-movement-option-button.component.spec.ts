import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMovementOptionButtonComponent } from './game-movement-option-button.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MessageService } from '@app/features/game/services/message/message.service';

describe('GameMovementOptionButtonComponent', () => {
  let component: GameMovementOptionButtonComponent;
  let fixture: ComponentFixture<GameMovementOptionButtonComponent>;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMovementOptionButtonComponent, ToastrModule.forRoot()],
      providers: [ToastrService],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    messageService = TestBed.inject(MessageService);

    fixture = TestBed.createComponent(GameMovementOptionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
