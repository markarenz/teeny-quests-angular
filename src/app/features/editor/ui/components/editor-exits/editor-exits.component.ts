import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectOptions } from '@app/features/main/interfaces/types';
import { CollapsibleCardComponent } from '@app/features/main/ui/components/collapsible-card/collapsible-card.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { exitDefinitions } from '@content/exit-definitions';

@Component({
  selector: 'app-editor-exits',
  standalone: true,
  imports: [FormsModule, ButtonComponent, CollapsibleCardComponent],
  templateUrl: './editor-exits.component.html',
  styleUrl: './editor-exits.component.css',
})
export class EditorExitsComponent {
  panelMode: string = '';
  exitTypeOptions: SelectOptions[] = exitDefinitions;
  selectedExitType: string = '';
  selectedPosition: string = '';
  isFormValid: boolean = false;

  validateForm() {
    this.isFormValid = this.selectedExitType !== '';
  }

  ngOnInit() {
    //
  }

  handleCreateClick() {
    this.selectedExitType = '';
    this.isFormValid = false;
  }
}
