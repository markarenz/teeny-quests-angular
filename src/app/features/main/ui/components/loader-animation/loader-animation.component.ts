import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader-animation',
  standalone: true,
  imports: [],
  templateUrl: './loader-animation.component.html',
  styleUrl: './loader-animation.component.css',
})
export class LoaderAnimationComponent {
  @Input('cover') cover: boolean = false;
}
