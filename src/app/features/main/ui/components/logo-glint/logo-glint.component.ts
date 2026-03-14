import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo-glint',
  imports: [],
  templateUrl: './logo-glint.component.html',
  styleUrl: './logo-glint.component.css',
  standalone: true,
})
export class LogoGlintComponent {
  @Input('num') num: string = '1';
}
