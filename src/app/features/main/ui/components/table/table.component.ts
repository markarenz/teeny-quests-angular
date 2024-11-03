import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FieldLabel } from '@main/interfaces/types';
import { StatusChipComponent } from '../status-chip/status-chip.component';
import { LoaderAnimationComponent } from '../loader-animation/loader-animation.component';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterLink, StatusChipComponent, LoaderAnimationComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input('title') title: string = 'Title';
  @Input('isLoading') isLoading: boolean = false;
  @Input('rows') rows: any[] = [];
  @Input('labels') labels: FieldLabel[] = [];
  @Input('linkFormat') linkFormat: string = '/';
}
