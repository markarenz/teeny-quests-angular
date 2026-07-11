import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { MainAppService } from '@main/services/main-app-service';
import { Title, Meta } from '@angular/platform-browser';
import { SocialShareComponent } from '@main/ui/components/social-share/social-share.component';
import { HeaderComponent } from '@main/ui/components/header/header.component';
import { FooterComponent } from '@main/ui/components/footer/footer.component';
import { MainNavComponent } from '@main/ui/components/main-nav/main-nav.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    HeaderComponent,
    FooterComponent,
    MainNavComponent,
    SocialShareComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  standalone: true,
})
export class MainLayoutComponent {
  private subscriptions: Subscription[] = [];
  public isSharingOpen: boolean = false;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private _mainAppService: MainAppService
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
    this.subscriptions.push(
      this._mainAppService.isSharingOpenObs.subscribe(data => {
        this.isSharingOpen = data;
      })
    );
  }

  isMenuOpen: boolean = false;
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
