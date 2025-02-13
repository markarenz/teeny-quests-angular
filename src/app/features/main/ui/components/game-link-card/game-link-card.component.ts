import { Component, Input } from '@angular/core';
import { SkeletonTextComponent } from '../skeleton-text/skeleton-text.component';

@Component({
  selector: 'app-game-link-card',
  standalone: true,
  imports: [SkeletonTextComponent],
  templateUrl: './game-link-card.component.html',
  styleUrl: './game-link-card.component.css',
})
export class GameLinkCardComponent {
  @Input('isSkeleton') isSkeleton: boolean = false;
  @Input('title') title: string = '';
  @Input('username') username: string = '';
  @Input('description') description: string = '';
}
