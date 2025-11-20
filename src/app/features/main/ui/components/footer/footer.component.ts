import { Component } from '@angular/core';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { SvgMiniLogoComponent } from '../svg-mini-logo/svg-mini-logo.component';
import { SvgGithubComponent } from '../svg-github/svg-github.component';
import { SvgJoystickComponent } from '../svg-joystick/svg-joystick.component';
import versionData from '@content/version.json';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    ContainerComponent,
    SvgMiniLogoComponent,
    SvgGithubComponent,
    SvgJoystickComponent,
  ],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  public version: string = versionData.version;
  public releaseMode: string =
    versionData.version.split('.')[0] === '0' ? '(Beta)' : '';

  copyrightYear = new Date().getFullYear();
}
