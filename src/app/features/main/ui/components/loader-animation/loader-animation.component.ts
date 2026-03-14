import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader-animation',
  imports: [],
  templateUrl: './loader-animation.component.html',
  styleUrl: './loader-animation.component.css',
  standalone: true,
})
export class LoaderAnimationComponent {
  @Input('showBg') showBg: boolean = false;
  @Input('size') size: string = 'full';
  @Input('isFixed') isFixed: boolean = false;
}
