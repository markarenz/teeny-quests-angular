import { Component } from '@angular/core';
import { MainAppService } from '@main/services/main-app-service';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { SvgMiniLogoComponent } from '../svg-mini-logo/svg-mini-logo.component';
import { SvgGithubComponent } from '../svg-github/svg-github.component';
import { SvgDiscordComponent } from '../icons/svg-discord/svg-discord.component';
import { SvgRidiculopathyComponent } from '../icons/svg-ridiculopathy/svg-ridiculopathy.component';
import { SvgShareComponent } from '../icons/svg-share/svg-share.component';
import versionData from '@content/version.json';

@Component({
  selector: 'app-footer',
  imports: [
    ContainerComponent,
    SvgMiniLogoComponent,
    SvgGithubComponent,
    SvgDiscordComponent,
    SvgRidiculopathyComponent,
    SvgShareComponent,
  ],
  templateUrl: './footer.component.html',
  standalone: true,
})
export class FooterComponent {
  constructor(public mainAppService: MainAppService) {}

  public openSharingModal() {
    this.mainAppService.setIsSharingOpen(true);
  }

  public version: string = versionData.version;
  public releaseMode: string =
    versionData.version.split('.')[0] === '0' ? '(Beta)' : '';

  copyrightYear = new Date().getFullYear();
}
