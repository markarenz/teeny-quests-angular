import { Component, Input } from '@angular/core';
import { WallTextureProps } from '@app/features/main/interfaces/types';
import { defaultWallProps } from '../constants';

@Component({
  selector: 'app-blue-shine',
  standalone: true,
  imports: [],
  templateUrl: './blue-shine.component.html',
  styleUrl: './blue-shine.component.css',
})
export class BlueShineComponent {
  @Input('wallProps') wallProps: WallTextureProps = defaultWallProps;
}
