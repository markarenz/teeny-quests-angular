import { Component, Input } from '@angular/core';
import { WallTextureProps } from '@app/features/main/interfaces/types';
import { defaultWallProps } from '../constants';

@Component({
  selector: 'app-blue-shine',
  imports: [],
  templateUrl: './blue-shine.component.html',
  styleUrl: './blue-shine.component.css',
  standalone: true,
})
export class BlueShineComponent {
  @Input('wallProps') wallProps: WallTextureProps = defaultWallProps;
}
