import { Component, Input } from '@angular/core';
import { WallTextureProps } from '@app/features/main/interfaces/types';
import { defaultWallProps } from '../constants';

@Component({
  selector: 'app-red-stone',
  standalone: true,
  imports: [],
  templateUrl: './red-stone.component.html',
  styleUrl: './red-stone.component.css',
})
export class RedStoneComponent {
  @Input('wallProps') wallProps: WallTextureProps = defaultWallProps;
}
