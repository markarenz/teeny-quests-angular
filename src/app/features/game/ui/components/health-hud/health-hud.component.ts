import { Component, Input } from '@angular/core';
import { HeartComponent } from './heart/heart.component';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-health-hud',
  imports: [HeartComponent, BrowserModule],
  templateUrl: './health-hud.component.html',
  styleUrl: './health-hud.component.css',
})
export class HealthHudComponent {
  @Input() health: number = 4.0;

  get hearts(): number[] {
    if (this.health <= 0) {
      return [];
    }
    const full = Math.floor(this.health);
    const remainder = this.health - full;
    const values = Array(full).fill(1.0);
    if (remainder > 0) {
      values.push(remainder);
    }
    return values;
  }
}
