import { Component, Input } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
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
  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  @Input('title') title = 'Teeny Quests';
  @Input('description') description =
    'Teeny Quests is a series of tiny adventures with puzzles, exploration and whatnot.';

  private handleMetas() {
    const currentUrl = window.location.href;
    this.titleService.setTitle(this.title);
    this.metaService.updateTag({
      name: 'twitter:title',
      content: this.title,
    });
    this.metaService.updateTag({ name: 'og:title', content: this.title });
    this.metaService.updateTag({
      name: 'description',
      content: this.description,
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: this.description,
    });
    this.metaService.updateTag({
      name: 'og:description',
      content: this.description,
    });
    this.metaService.updateTag({ name: 'twitter:url', content: currentUrl });
    this.metaService.updateTag({ name: 'og:url', content: currentUrl });
  }
  ngOnChanges(): void {
    this.handleMetas();
  }

  ngOnInit(): void {
    this.handleMetas();
  }
}
