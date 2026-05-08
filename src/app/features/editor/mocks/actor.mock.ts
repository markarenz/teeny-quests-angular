import {
  AnimStatus,
  ActorType,
  Direction,
} from '@app/features/main/interfaces/enums';
import { QuestActor } from '@app/features/main/interfaces/types';

export const mockActor: QuestActor = {
  id: 'actor-1',
  name: 'Test Actor',
  actorType: ActorType.SLIME_GREEN,
  animStatus: AnimStatus.IDLE,
  facing: Direction.SOUTH,
  x: 1,
  y: 2,
  h: 1,
  areaId: 'start',
  health: 5,
  actions: [],
  dropItem: '',
};
