import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayerComponent } from './game-player.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MessageService } from '@app/features/game/services/message/message.service';

describe('GamePlayerComponent', () => {
  let component: GamePlayerComponent;
  let fixture: ComponentFixture<GamePlayerComponent>;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePlayerComponent, ToastrModule.forRoot()],
      providers: [ToastrService],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    messageService = TestBed.inject(MessageService);
    fixture = TestBed.createComponent(GamePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle position changes', () => {
    component.playerPosition = '1_2';
    component.playerFacing = 'north';
    component.cellData = {
      x: 1,
      y: 2,
      h: 1,
      floor: 'default',
      wallSouth: 'default',
      wallEast: 'default',
    };
    expect(component.positionStyle.z).toEqual(0);
    fixture.detectChanges();
    component.ngOnChanges();
    component.playerPosition = '2_2';
    expect(component.positionStyle.z).toEqual(4);
  });
});
