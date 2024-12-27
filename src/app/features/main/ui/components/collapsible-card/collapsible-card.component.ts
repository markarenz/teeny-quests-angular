import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconCaretComponent } from '../icons/icon-caret/icon-caret.component';

@Component({
  selector: 'app-collapsible-card',
  standalone: true,
  imports: [IconCaretComponent],
  templateUrl: './collapsible-card.component.html',
  styleUrl: './collapsible-card.component.css',
})
export class CollapsibleCardComponent {
  isOpen: boolean = false;

  @Input('title') title: string = '';
  @Input('defaultOpen') defaultOpen: boolean = false;

  @Output() onCollapse = new EventEmitter();

  ngOnInit() {
    this.isOpen = this.defaultOpen;
  }

  toggleCollapse() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.onCollapse.emit();
    }
  }
}
