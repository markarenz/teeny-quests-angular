import nameWordlist from '@content/nameWordList.json';

export const capitalizeWords = (str?: string): string =>
  !str
    ? ''
    : str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * nameWordlist.nouns.length);

export const getRandomUsername = (): string => {
  const idxNoun = getRandomInt(0, nameWordlist.nouns.length);
  const idxAdjective = getRandomInt(0, nameWordlist.adjectives.length);

  return capitalizeWords(
    `${nameWordlist.adjectives[idxAdjective]} ${nameWordlist.nouns[idxNoun]}`
  );
};

export const getInitialsFromName = (name: string): string =>
  name.split(' ').reduce((acc, n) => acc + n[0].toUpperCase(), '');
