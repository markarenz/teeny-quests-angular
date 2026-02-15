import { Component, Input } from '@angular/core';
import { WallTextureProps } from '@app/features/main/interfaces/types';
import { defaultWallProps } from '../constants';

@Component({
  selector: 'app-cave',
  standalone: true,
  imports: [],
  templateUrl: './cave.component.html',
  styleUrl: './cave.component.css',
})
export class CaveComponent {
  @Input('wallProps') wallProps: WallTextureProps = defaultWallProps;
}
