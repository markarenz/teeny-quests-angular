import { getTextureId, getFillTextureUrl } from './floor-utils';
import { FloorDefinition } from '@content/floor-definitions';

describe('floor-utils', () => {
  const mockFloorDefinition: FloorDefinition = {
    id: 'test-floor',
    name: 'Test Floor',
    flipOdds: true,
    walkable: true,
  };
  describe('getTextureId', () => {
    it('should return correct texture id for flat floor without flip', () => {
      const floorDefinition: FloorDefinition = {
        ...mockFloorDefinition,
        id: 'stone',
      };
      const result = getTextureId(false, floorDefinition, true);
      expect(result).toBe('texture_floor_stone_flat');
    });

    it('should return correct texture id for non-flat floor with flip', () => {
      const floorDefinition: FloorDefinition = {
        ...mockFloorDefinition,
        id: 'wood',
      };
      const result = getTextureId(true, floorDefinition, false);
      expect(result).toBe('texture_floor_wood_floor-flip');
    });

    it('should return correct texture id for non-flat floor without flip', () => {
      const floorDefinition: FloorDefinition = {
        ...mockFloorDefinition,
        id: 'marble',
        flipOdds: false,
      };
      const result = getTextureId(false, floorDefinition, false);
      expect(result).toBe('texture_floor_marble_floor');
    });
  });

  describe('getFillTextureUrl', () => {
    type ScenarioGetFillTextureUrl = {
      isOddIndex: boolean;
      floorDefinition: FloorDefinition;
      isFlat: boolean;
      expected: string;
    };
    const scenarios: ScenarioGetFillTextureUrl[] = [
      {
        isOddIndex: false,
        floorDefinition: {
          ...mockFloorDefinition,
          id: 'stone',
          flipOdds: true,
        },
        isFlat: true,
        expected: 'url(#texture_floor_stone_flat)',
      },
      {
        isOddIndex: true,
        floorDefinition: {
          ...mockFloorDefinition,
          id: 'parquet',
          flipOdds: true,
        },
        isFlat: true,
        expected: 'url(#texture_floor_parquet_flat-flip)',
      },
    ];
    scenarios.forEach((args: ScenarioGetFillTextureUrl) => {
      it(`should return correct fill texture URL for isOddIndex=${args.isOddIndex}, floorId=${args.floorDefinition.id}, isFlat=${args.isFlat}`, () => {
        const result = getFillTextureUrl(
          args.isOddIndex,
          args.floorDefinition,
          args.isFlat
        );
        expect(result).toBe(args.expected);
      });
    });
  });
});
