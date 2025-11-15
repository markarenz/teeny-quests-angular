import { Component } from '@angular/core';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { ContainerComponent } from '@main/ui/components/container/container.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [MainLayoutComponent, ContainerComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css',
})
export class AboutPageComponent {}
