import { Component } from '@angular/core';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { ContainerComponent } from '@main/ui/components/container/container.component';

@Component({
  selector: 'app-editor-how-to',
  imports: [MainLayoutComponent, ContainerComponent],
  templateUrl: './editor-how-to.component.html',
  styleUrl: './editor-how-to.component.css',
  standalone: true,
})
export class EditorHowToComponent {}
