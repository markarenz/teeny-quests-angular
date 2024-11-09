import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContainerComponent, MainLayoutComponent],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private titleService: Title, private metaService: Meta) {}

  title = 'Teeny Quests';
  description =
    'Embark on a journey of miniscule proportions, and even make your own game for friends to play.';

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.metaService.addTag({
      name: 'description',
      content: this.description,
    });
  }
}
