import { Component } from '@angular/core';
import { LogoGlintComponent } from '@main/ui/components/logo-glint/logo-glint.component';

@Component({
  selector: 'app-logo-main',
  standalone: true,
  imports: [LogoGlintComponent],
  templateUrl: './logo-main.component.html',
  styleUrl: './logo-main.component.css',
})
export class LogoMainComponent {}
