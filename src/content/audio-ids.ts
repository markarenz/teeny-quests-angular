export type AudioDefinition = {
  filename: string;
  volume: number;
};

export const audioIdMap: Map<string, AudioDefinition> = new Map([
  [
    'click1',
    {
      filename: '370962__cabled_mess__click-01_minimal-ui-sounds.wav',
      volume: 0.5,
    },
  ],
  [
    'click2',
    {
      filename: '90125__pierrecartoons1979__click_tiny.wav',
      volume: 0.5,
    },
  ],
  [
    'step1',
    {
      filename: '697182__znukem__single-footstep.wav',
      volume: 0.7,
    },
  ],
  [
    'step2',
    {
      filename: '697182__znukem__single-footstep2.wav',
      volume: 0.7,
    },
  ],
  [
    'switch',
    {
      filename: '144248__dwoboyle__door-garage_door-handle-02.wav',
      volume: 0.2,
    },
  ],
  [
    'exit',
    {
      filename: '422495__nightflame__swinging-staff-whoosh-low-03.wav',
      volume: 0.5,
    },
  ],
  [
    'unlock',
    {
      filename: '458400__breviceps__lock-the-door.wav',
      volume: 0.4,
    },
  ],
  [
    'take-item',
    {
      filename: '654251__strechy__item-pickup-sound.wav',
      volume: 0.4,
    },
  ],
  [
    'bounce',
    {
      filename: '751699__el_boss__game-jump-sound-boing-2-of-2.wav',
      volume: 0.5,
    },
  ],
  [
    'stone',
    {
      filename:
        '460180__johanwestling__stone_tile_dragging_friction_scrape_m10.wav',
      volume: 0.2,
    },
  ],
  [
    'torch-on',
    {
      filename: '479338__danielvega__torch-on.mp3',
      volume: 0.2,
    },
  ],
  [
    'torch-off',
    {
      filename: '479338__danielvega__torch-off.mp3',
      volume: 0.2,
    },
  ],
  [
    'game-end',
    {
      filename:
        '337049__shinephoenixstormcrow__320655__rhodesmas__level-up-01.mp3',
      volume: 0.4,
    },
  ],
]);
