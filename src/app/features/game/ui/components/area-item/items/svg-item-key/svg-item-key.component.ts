import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-item-key',
  standalone: true,
  imports: [],
  templateUrl: './svg-item-key.component.html',
  styleUrl: './svg-item-key.component.css',
})
export class SvgItemKeyComponent {
  @Input('isFlat') isFlat: boolean = false;
  @Input('variant') variant: string = 'silver';

  public patternIds: string[] = [];

  private getPatternIds() {
    this.patternIds = [
      `gradientItemKey-${this.variant}-01`,
      `gradientItemKey-${this.variant}-02`,
      `#gradientItemKey-${this.variant}-01`,
      `#gradientItemKey-${this.variant}-02`,
    ];
  }
  ngOnInit() {
    this.getPatternIds();
  }

  ngOnChanges() {
    this.getPatternIds();
  }
}
