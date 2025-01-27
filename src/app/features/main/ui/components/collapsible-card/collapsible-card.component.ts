import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconCaretComponent } from '../icons/icon-caret/icon-caret.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-collapsible-card',
  standalone: true,
  imports: [IconCaretComponent, IconButtonComponent],
  templateUrl: './collapsible-card.component.html',
  styleUrl: './collapsible-card.component.css',
})
export class CollapsibleCardComponent {
  isOpen: boolean = false;

  @Input('isCollapsible') isCollapsible: boolean = true;
  @Input('showNewButton') showNewButton: boolean = false;
  @Input('title') title: string = '';
  @Input('defaultOpen') defaultOpen: boolean = false;

  @Output() onNewButtonClick = new EventEmitter();
  @Output() onCollapse = new EventEmitter();

  ngOnInit() {
    this.isOpen = this.defaultOpen || !this.isCollapsible;
  }

  handleNewButtonClick() {
    this.onNewButtonClick.emit();
  }

  toggleCollapse() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.onCollapse.emit();
    }
  }
}
