import nameWordlist from '@content/nameWordList.json';
import { defaultGridSize } from '@config/index';

export const capitalizeWords = (str?: string): string =>
  !str
    ? ''
    : str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const getRandomInt = (min: number, max: number): number =>
  min + Math.floor(Math.random() * max);

export const getRandomUsername = (): string => {
  const idxNoun = getRandomInt(0, nameWordlist.nouns.length);
  const idxAdjective = getRandomInt(0, nameWordlist.adjectives.length);

  return capitalizeWords(
    `${nameWordlist.adjectives[idxAdjective]} ${nameWordlist.nouns[idxNoun]}`
  );
};

export const getInitialsFromName = (name: string): string =>
  name.split(' ').reduce((acc, n) => acc + n[0].toUpperCase(), '');

export const getPositionKeysForGridSize = (): string[] => {
  const numCells = defaultGridSize * defaultGridSize;
  return Array.from({ length: numCells }, (_, i) => {
    const x = i % defaultGridSize;
    const y = Math.floor(i / defaultGridSize);
    return `${y}_${x}`;
  });
};

export const formatDate = (date: string): string => new Date(date).toString();

export const getLabelFromSlug = (slug: string): string =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
