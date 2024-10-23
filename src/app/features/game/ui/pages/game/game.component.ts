import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ContainerComponent, MainLayoutComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  constructor(private titleService: Title, private metaService: Meta) {}

  // Eventually we will pull this in dynamically
  title = 'Game Page';
  description = 'This is a game.';

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.metaService.addTag({
      name: 'description',
      content: this.description,
    });
  }
}
