import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-heart',
  imports: [],
  templateUrl: './heart.component.html',
  styleUrl: './heart.component.css',
})
export class HeartComponent {
  @Input() value: number = 1; // value between 0 and 1
}
