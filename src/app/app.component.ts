import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],

  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'teeny-quests-angular';
}
