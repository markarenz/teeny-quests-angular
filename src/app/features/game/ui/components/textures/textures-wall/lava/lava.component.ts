import { Component, Input } from '@angular/core';
import { WallTextureProps } from '@app/features/main/interfaces/types';
import { defaultWallProps } from '../constants';

@Component({
  selector: 'app-lava',
  imports: [],
  templateUrl: './lava.component.html',
  styleUrl: './lava.component.css',
  standalone: true,
})
export class LavaComponent {
  @Input('wallProps') wallProps: WallTextureProps = defaultWallProps;
}
