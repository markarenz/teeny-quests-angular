import { Component, Input } from '@angular/core';
import { Link } from '@app/features/main/interfaces/types';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-breadcrumbs',
    imports: [RouterLink],
    templateUrl: './breadcrumbs.component.html',
    styleUrl: './breadcrumbs.component.css'
})
export class BreadcrumbsComponent {
  @Input('links') links: Link[] = [];
}
