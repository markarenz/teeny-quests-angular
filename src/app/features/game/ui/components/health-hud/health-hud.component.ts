import { Component, Input } from '@angular/core';
import { HeartComponent } from './heart/heart.component';

@Component({
  selector: 'app-health-hud',
  imports: [HeartComponent],
  templateUrl: './health-hud.component.html',
  styleUrl: './health-hud.component.css',
})
export class HealthHudComponent {
  @Input() health: number = 4.0;
  @Input() maxHealth: number = 4.0;

  get hearts(): number[] {
    const full = Math.floor(this.health);
    const remainder = this.health - full;
    const values = Array(this.maxHealth).fill(0);
    values.fill(1, 0, full);
    if (remainder > 0) {
      values.fill(remainder, full, full + 1);
    }
    return values;
  }
}
