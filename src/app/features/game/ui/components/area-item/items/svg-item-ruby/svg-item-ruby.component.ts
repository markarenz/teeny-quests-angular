import { Component, Input } from '@angular/core';
import { SvgShadowComponent } from '../svg-shadow/svg-shadow.component';

@Component({
  selector: 'app-svg-item-ruby',
  standalone: true,
  imports: [SvgShadowComponent],
  templateUrl: './svg-item-ruby.component.html',
  styleUrl: './svg-item-ruby.component.css',
})
export class SvgItemRubyComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = '';
}
