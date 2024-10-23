import { Component, Input } from '@angular/core';
import { HeaderComponent } from '@main/ui/components/header/header.component';
import { FooterComponent } from '@main/ui/components/footer/footer.component';
import { MainNavComponent } from '@main/ui/components/main-nav/main-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MainNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  @Input('title') title = '';
}
