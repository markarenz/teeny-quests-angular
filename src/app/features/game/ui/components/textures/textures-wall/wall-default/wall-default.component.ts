import { Component, Input } from '@angular/core';
import { WallTextureProps } from '@app/features/main/interfaces/types';
import { defaultWallProps } from '../constants';

@Component({
  selector: 'app-wall-default',
  standalone: true,
  imports: [],
  templateUrl: './wall-default.component.html',
  styleUrl: './wall-default.component.css',
})
export class WallDefaultComponent {
  public halfUnits: number[] = [];

  @Input('wallProps') wallProps: WallTextureProps = defaultWallProps;

  ngOnInit() {
    for (let i = 0; i < 26; i++) {
      this.halfUnits.push((i - 1) * 12.5);
    }
  }
}
