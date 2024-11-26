import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-section',
  standalone: true,
  imports: [],
  templateUrl: './header-section.component.html',
  styleUrl: './header-section.component.css',
})
export class HeaderSectionComponent {
  @Input('title') title: string = '';
  @Input('defaultIsOpen') defaultIsOpen: boolean = true;
  isOpen: boolean = false;

  ngOnInit() {
    this.isOpen = this.defaultIsOpen;
  }

  toggleIsOpen() {
    this.isOpen = !this.isOpen;
  }
}
