import { Component } from '@angular/core';
import { ContainerComponent } from '@main/ui/components/container/container.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  copyrightYear = new Date().getFullYear();
}
