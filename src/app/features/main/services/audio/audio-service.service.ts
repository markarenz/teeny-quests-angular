import { Injectable } from '@angular/core';
import { audioIdMap } from '@content/audio-ids';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private sounds = new Map<string, HTMLAudioElement>();

  constructor() {
    this.loadSounds();
  }

  public loadSounds = (): void => {
    audioIdMap.forEach((AudioDefinition, soundId) => {
      const { filename, volume } = AudioDefinition;
      let audio = new Audio();
      audio.autoplay = false;
      audio.src = '/audio/' + filename;
      audio.load();
      audio.volume = volume;
      this.sounds.set(soundId, audio);
    });
  };

  public playSound = (soundId: string): void => {
    const sound = this.sounds.get(soundId);
    if (!sound) {
      return;
    }
    sound.currentTime = 0;
    sound.play();
  };
}
