import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaActorComponent } from './area-actor.component';
import { defaultActor } from '@app/features/game/lib/constants';
import { AnimStatus, Direction } from '@app/features/main/interfaces/enums';

describe('AreaActorComponent', () => {
  let component: AreaActorComponent;
  let fixture: ComponentFixture<AreaActorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaActorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaActorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle click', () => {
    component.isEditorMode = true;
    component.actor = defaultActor;
    spyOn(component.onClick, 'emit');
    component.handleClick();
    expect(component.onClick.emit).toHaveBeenCalled();
  });

  describe('getNumFromPositionString', () => {
    it('should return a number from a position string', () => {
      expect(component.getNumFromPositionString('50%')).toBe(50);
      expect(component.getNumFromPositionString('0%')).toBe(0);
      expect(component.getNumFromPositionString('100%')).toBe(100);
    });
  });
  describe('updateActorProps', () => {
    it('should determine relative player position to actor', () => {
      component.gridSize = 10;
      const mockActor = { ...defaultActor, x: 7, y: 7, h: 1, areaId: 'start' };
      component.actor = mockActor;

      component.ngOnChanges({});

      component.playerPosition = '0_0';
      component.updateActorProps();
      expect(component.relativePlayerXPos).toBe(0);

      component.playerPosition = '5_2';
      component.updateActorProps();
      expect(component.relativePlayerXPos).toBe(-1);

      component.playerPosition = '5_7';
      component.updateActorProps();
      expect(component.relativePlayerXPos).toBe(1);
    });
    it('handles actor with no definition', () => {
      component.gridSize = 10;
      const mockActor = {
        ...defaultActor,
        actorType: 'unknown',
      };
      component.actor = mockActor;
      component.ngOnChanges({});
      component.updateActorProps();
      expect(component.maxHealth).toBe(0);
    });
  });
  describe('getZOffset', () => {
    it('should return 0 if attacking east', () => {
      component.actor = {
        ...defaultActor,
        animStatus: AnimStatus.ATTACKING,
        facing: Direction.EAST,
      };
      const zOffset = component.getZOffset();
      expect(zOffset).toBe(1);
    });

    it('should return 0 if attacking south', () => {
      component.actor = {
        ...defaultActor,
        animStatus: AnimStatus.ATTACKING,
        facing: Direction.SOUTH,
      };
      const zOffset = component.getZOffset();
      expect(zOffset).toBe(7);
    });

    it('should return 0 if not south or east or attacking', () => {
      component.actor = {
        ...defaultActor,
        animStatus: AnimStatus.IDLE,
        facing: Direction.WEST,
      };
      const zOffset = component.getZOffset();
      expect(zOffset).toBe(0);
    });
  });
});
