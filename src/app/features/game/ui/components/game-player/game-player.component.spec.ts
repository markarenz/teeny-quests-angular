import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayerComponent } from './game-player.component';

describe('GamePlayerComponent', () => {
  let component: GamePlayerComponent;
  let fixture: ComponentFixture<GamePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle position changes', () => {
    component.playerPosition = '1_2';
    component.playerFacing = 'n';
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
