import { FloorDefinition } from '@content/floor-definitions';

export const getTextureId = (
  isOddIndex: boolean,
  floorDefinition: FloorDefinition,
  isFlat: boolean
) => {
  return (
    'texture_floor_' +
    floorDefinition.id +
    '_' +
    (isFlat ? 'flat' : 'floor') +
    (floorDefinition.flipOdds && isOddIndex ? '-flip' : '')
  );
};
export const getFillTextureUrl = (
  isOddIndex: boolean,
  floorDefinition: FloorDefinition,
  isFlat: boolean
) => {
  const textureId = getTextureId(isOddIndex, floorDefinition, isFlat);
  return `url(#${textureId})`;
};

export const getPolyPoints = (isFlat: boolean) => {
  return isFlat ? '0,0 100,0 100,100 0,100' : '50,0 100,25 50,50 0,25';
};

export type FloorProps = {
  isFlat: boolean;
  floorType: string;
  textureId: string;
  isTall: boolean;
  height: string;
  svg: {
    viewBox: string;
    style: string;
  };
  poly: {
    points: string;
    fill: string;
    stroke: string;
    strokeWidth: string;
    class: string;
  };
};

export const defaultFloorProps: FloorProps = {
  isFlat: false,
  floorType: 'default',
  textureId: '',
  isTall: false,
  height: '1',
  svg: {
    viewBox: '0 0 100 50',
    style: 'position: absolute; top: 0; left: 0; width: 100%',
  },
  poly: {
    points: '50,0 100,25 50,50 0,25',
    fill: '',
    stroke: '#aaa',
    strokeWidth: '2',
    class: '',
  },
};

export const getFloorProps = (
  isFlat: boolean,
  isEditorMode: boolean,
  positionKey: string,
  floorDefinition: FloorDefinition
): FloorProps => {
  return {
    isFlat,
    floorType: floorDefinition.id,
    textureId: getTextureId(
      getPositionIndexIsOdd(positionKey),
      floorDefinition,
      isFlat
    ),
    isTall: floorDefinition.isTall || false,
    height: isFlat ? '0.5' : '1',
    svg: {
      viewBox: isFlat || floorDefinition.isTall ? '0 0 100 100' : '0 0 100 50',
      style:
        'position: absolute; ' +
        (floorDefinition.tileType === 'single' && isFlat
          ? 'top: -10%; left: -75%; width: 250%'
          : 'top: 0; left: 0; width: 100%'),
    },
    poly: {
      points: getPolyPoints(isFlat),
      fill: getFillTextureUrl(
        getPositionIndexIsOdd(positionKey),
        floorDefinition,
        isFlat
      ),
      stroke: '#aaa',
      strokeWidth: '2',
      class: isEditorMode ? 'editor-mode' : '',
    },
  };
};

export const getPositionIndex = (positionKey: string) => {
  return positionKey
    .split('_')
    .map(Number)
    .reduce((acc, val) => {
      return acc + val;
    }, 0);
};

export const getPositionIndexIsOdd = (positionKey: string) => {
  return getPositionIndex(positionKey) % 2 !== 0;
};
