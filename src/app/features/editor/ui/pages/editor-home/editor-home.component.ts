import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';

@Component({
  selector: 'app-editor-home',
  standalone: true,
  imports: [MainLayoutComponent, ContainerComponent],
  templateUrl: './editor-home.component.html',
  styleUrl: './editor-home.component.css',
})
export class EditorHomeComponent {
  constructor(private titleService: Title, private metaService: Meta) {}
  // Eventually we will pull this in dynamically
  title = 'Editor Page';
  description = 'This is the editor.';

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.metaService.addTag({
      name: 'description',
      content: this.description,
    });
  }
}
