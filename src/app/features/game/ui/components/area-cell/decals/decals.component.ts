import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-decals',
  imports: [],
  templateUrl: './decals.component.html',
  styleUrl: './decals.component.css',
  standalone: true,
})
export class DecalsComponent {
  @Input('decalType') decalType: string = '';
}
