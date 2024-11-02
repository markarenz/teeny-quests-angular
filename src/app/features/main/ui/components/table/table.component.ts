import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FieldLabel } from '@main/interfaces/types';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input('title') title: string = 'Title';
  @Input('rows') rows: any[] = [];
  @Input('labels') labels: FieldLabel[] = [];
  @Input('linkFormat') linkFormat: string = '/';
}
