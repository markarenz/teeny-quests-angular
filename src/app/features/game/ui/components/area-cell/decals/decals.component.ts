import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-decals',
  standalone: true,
  imports: [],
  templateUrl: './decals.component.html',
  styleUrl: './decals.component.css',
})
export class DecalsComponent {
  @Input('decalType') decalType: string = '';
}
