import { Component } from '@angular/core';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { audioIdMap } from '@content/audio-ids';

@Component({
  selector: 'app-sound-credits-page',
  imports: [MainLayoutComponent, ContainerComponent],
  templateUrl: './sound-credits-page.component.html',
  styleUrl: './sound-credits-page.component.css',
  standalone: true,
})
export class SoundCreditsPageComponent {
  public soundCreditsData: string[] = [];

  ngOnInit(): void {
    const creditsArr = [...audioIdMap.values()].map(v => v.credit).sort();
    this.soundCreditsData = [...new Set(creditsArr)];
  }
}
