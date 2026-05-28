export type AudioDefinition = {
  filename: string;
  volume: number;
  credit: string;
};

export const audioIdMap: Map<string, AudioDefinition> = new Map([
  [
    'click1',
    {
      filename: '370962__cabled_mess__click-01_minimal-ui-sounds.wav',
      volume: 0.5,
      credit: 'Cabled Mess',
    },
  ],
  [
    'click2',
    {
      filename: '90125__pierrecartoons1979__click_tiny.wav',
      volume: 0.5,
      credit: 'Pierre Cartoons',
    },
  ],
  [
    'step1',
    {
      filename: '697182__znukem__single-footstep.wav',
      volume: 0.7,
      credit: 'Znukem',
    },
  ],
  [
    'step2',
    {
      filename: '697182__znukem__single-footstep2.wav',
      volume: 0.7,
      credit: 'Znukem',
    },
  ],
  [
    'switch',
    {
      filename: '144248__dwoboyle__door-garage_door-handle-02.wav',
      volume: 0.2,
      credit: 'Dwoboyle',
    },
  ],
  [
    'exit',
    {
      filename: '422495__nightflame__swinging-staff-whoosh-low-03.wav',
      volume: 0.5,
      credit: 'Nightflame',
    },
  ],
  [
    'unlock',
    {
      filename: '458400__breviceps__lock-the-door.wav',
      volume: 0.4,
      credit: 'Breviceps',
    },
  ],
  [
    'take-item',
    {
      filename: '654251__strechy__item-pickup-sound.wav',
      volume: 0.4,
      credit: 'Strechy',
    },
  ],
  [
    'bounce',
    {
      filename: '751699__el_boss__game-jump-sound-boing-2-of-2.wav',
      volume: 0.5,
      credit: 'El Boss',
    },
  ],
  [
    'stone',
    {
      filename:
        '460180__johanwestling__stone_tile_dragging_friction_scrape_m10.wav',
      volume: 0.2,
      credit: 'Johan Westling',
    },
  ],
  [
    'torch-on',
    {
      filename: '479338__danielvega__torch-on.mp3',
      volume: 0.2,
      credit: 'Daniel Vega',
    },
  ],
  [
    'torch-off',
    {
      filename: '479338__danielvega__torch-off.mp3',
      volume: 0.2,
      credit: 'Daniel Vega',
    },
  ],
  [
    'game-end',
    {
      filename:
        '337049__shinephoenixstormcrow__320655__rhodesmas__level-up-01.mp3',
      volume: 0.4,
      credit: 'Shine Phoenix Stormcrow',
    },
  ],
  [
    'chime',
    {
      filename: '383979__chrisreierson__frozen-wind-chime-ding.mp3',
      volume: 0.5,
      credit: 'Chris Reierson',
    },
  ],
  [
    'player-death',
    {
      filename: '43697__notchfilter__game-over02.mp3',
      volume: 0.7,
      credit: 'Notchfilter',
    },
  ],
  [
    'player-hurt',
    {
      filename: '649543__ajanhallinta__ouch.mp3',
      volume: 0.5,
      credit: 'Ajanhallinta',
    },
  ],
  [
    'player-heal',
    {
      filename: '346116__lulyc__retro-game-heal-sound.mp3',
      volume: 0.3,
      credit: 'Lulyc',
    },
  ],
  [
    'player-heart',
    {
      filename: '253172__suntemple__retro-bonus-pickup-sfx.mp3',
      volume: 0.6,
      credit: 'Suntemple',
    },
  ],
  [
    'attack-slash',
    {
      filename: '362349__beerbelly38__knife-slash-2.mp3',
      volume: 0.5,
      credit: 'Beerbelly38',
    },
  ],

  [
    'attack',
    {
      filename: '362349__beerbelly38__knife-slash-2.mp3',
      volume: 0.5,
      credit: 'Beerbelly38',
    },
  ],
  [
    'slime-move',
    {
      filename: '573583__breviceps__cartoon-slurp.mp3',
      volume: 0.2,
      credit: 'Breviceps',
    },
  ],
  [
    'skello-move',
    {
      filename: '506913__schoman3__bottle_clink.mp3',
      volume: 0.3,
      credit: 'Schoman3',
    },
  ],
  [
    'actor-miss',
    {
      filename: '831936__1bob__woosh.mp3',
      volume: 0.5,
      credit: '1bob',
    },
  ],
  [
    'actor-bite',
    {
      filename: '195139__misato__crank.mp3',
      volume: 0.3,
      credit: 'Misato',
    },
  ],
  [
    'actor-hurt',
    {
      filename: '806593__edimar_ramide__hurt2.mp3',
      volume: 0.5,
      credit: 'Edimar Ramide',
    },
  ],
  [
    'actor-death',
    {
      filename: '35416__altemark__percussivebleep2.mp3',
      volume: 0.3,
      credit: 'Altemark',
    },
  ],

  //
]);
