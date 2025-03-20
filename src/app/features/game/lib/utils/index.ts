import { areaHeightFactor } from '@config/index';

export type AreaPosition = {
  left: string;
  bottom: string;
  z: number;
};

export const getAreaElementPositionStyle = (
  gridSize: number,
  y: number,
  x: number,
  h?: number
): AreaPosition => {
  const cellW: number = 100 / gridSize;
  const cellH: number = cellW / 2;

  const offset = {
    x: 50 - cellW * 0.5,
    y: cellH * (gridSize - 1),
  };

  const posXRaw = (x * 0.5 + y * -0.5) * cellW;

  const hAdjusted = h ? h * areaHeightFactor : 1;

  const posX = offset.x + posXRaw;
  const posY =
    offset.y -
    (x * 0.5 + y * 0.5) * cellH +
    (typeof h !== 'undefined' ? hAdjusted : 0) * 0.5 * cellH;

  const position: AreaPosition = {
    left: `${posX}%`,
    bottom: `${posY}%`,
    z: y * x + x,
  };

  return position;
};
