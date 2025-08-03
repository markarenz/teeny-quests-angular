import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableField } from '@main/interfaces/types';
import { StatusChipComponent } from '../status-chip/status-chip.component';
import { LoaderAnimationComponent } from '../loader-animation/loader-animation.component';
import { formatDate } from '@app/features/main/utils';
import { IconButtonComponent } from '../icons/icon-button/icon-button.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    RouterLink,
    StatusChipComponent,
    LoaderAnimationComponent,
    IconButtonComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input('title') title: string = 'Title';
  @Input('isLoading') isLoading: boolean = false;
  @Input('rows') rows: any[] = [];
  @Input('tableFields') tableFields: TableField[] = [];
  @Input('linkFormat') linkFormat: string = '/';

  public formatDate = formatDate;
}
