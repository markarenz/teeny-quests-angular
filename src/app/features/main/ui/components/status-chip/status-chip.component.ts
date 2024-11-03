import { Component, Input } from '@angular/core';
import { capitalizeWords } from '@main/utils';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [],
  templateUrl: './status-chip.component.html',
  styleUrl: './status-chip.component.css',
})
export class StatusChipComponent {
  @Input('itemStatus') itemStatus: string = '';

  itemStatusDisplay: string = '';

  ngOnInit(): void {
    this.itemStatusDisplay = capitalizeWords(this.itemStatus);
  }
}
