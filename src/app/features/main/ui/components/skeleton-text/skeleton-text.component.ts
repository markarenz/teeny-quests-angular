import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-text',
  standalone: true,
  imports: [],
  templateUrl: './skeleton-text.component.html',
  styleUrl: './skeleton-text.component.css',
})
export class SkeletonTextComponent {
  @Input('width') width: number = 50;
}
