import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLinkActive } from '@angular/router';
import { MainNavComponent } from './features/main/ui/components/main-nav/main-nav.component';
import { FooterComponent } from './features/main/ui/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MainNavComponent,
    FooterComponent,
  ],

  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'teeny-quests-angular';
}
