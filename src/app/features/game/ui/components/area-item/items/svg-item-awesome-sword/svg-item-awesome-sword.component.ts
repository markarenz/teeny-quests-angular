import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-item-awesome-sword',
  imports: [],
  templateUrl: './svg-item-awesome-sword.component.html',
  styleUrl: './svg-item-awesome-sword.component.css',
  standalone: true,
})
export class SvgItemAwesomeSwordComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
