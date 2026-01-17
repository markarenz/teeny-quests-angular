import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorInputConditionsComponent } from './editor-input-conditions.component';
import { GameEventActionCondition } from '@app/features/main/interfaces/types';
import {
  ConditionComparison,
  EventConditionType,
} from '@app/features/main/interfaces/enums';

const mockCondition: GameEventActionCondition = {
  id: 'condition-1',
  conditionType: EventConditionType.INVENTORY,
  identifier: 'gold',
  comparison: ConditionComparison.GREATER_THAN,
  value: 100,
};

describe('EditorInputConditionsComponent', () => {
  let component: EditorInputConditionsComponent;
  let fixture: ComponentFixture<EditorInputConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorInputConditionsComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(EditorInputConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get condition label', () => {
    const label = component.getConditionLabel(mockCondition);
    expect(label).toBe('Inventory');
  });
  it('should handle create click', () => {
    spyOn(component.onConditionsChange, 'emit');
    component.conditions = [];
    component.handleCreateClick();
    expect(component.conditions?.length).toBe(1);
    expect(component.onConditionsChange.emit).toHaveBeenCalled();
  });

  it('should handle edit click', () => {
    component.conditions = [mockCondition];
    component.handleEditClick('condition-1');
    expect(component.selectedConditionId).toBe('condition-1');
    expect(component.selectedCondition).toEqual(mockCondition);

    component.handleEditClick('condition-1');
    expect(component.selectedConditionId).toBeNull();
    expect(component.selectedCondition).toBeNull();
  });

  it('should handle delete click', () => {
    spyOn(component.onConditionsChange, 'emit');
    component.conditions = [mockCondition];
    component.handleDeleteClick('condition-1');
    expect(component.conditions?.length).toBe(0);
    expect(component.onConditionsChange.emit).toHaveBeenCalledWith([]);
  });

  it('should handle condition input change', () => {
    spyOn(component.onConditionsChange, 'emit');
    component.conditions = [mockCondition];
    component.selectedConditionId = 'condition-1';
    component.selectedCondition = { ...mockCondition };
    component.inputConditionObjectId = 'silver';
    component.inputConditionValue = '200';

    component.handleConditionInputChange();

    expect(component.conditions?.[0].identifier).toBe('silver');
    expect(component.conditions?.[0].value).toBe('200');
    expect(component.onConditionsChange.emit).toHaveBeenCalled();
  });

  it('should not handle condition input change if no selected condition', () => {
    spyOn(component.onConditionsChange, 'emit');
    component.conditions = [mockCondition];
    component.selectedConditionId = null;
    component.selectedCondition = null;

    component.handleConditionInputChange();

    expect(component.conditions?.[0]).toEqual(mockCondition);
    expect(component.onConditionsChange.emit).not.toHaveBeenCalled();
  });
  it('should handle condition update', () => {
    spyOn(component, 'refreshUIData');
    component.conditions = [mockCondition];
    component.selectedConditionId = 'condition-1';
    component.selectedCondition = { ...mockCondition };
    component.handleConditionTypeChange();
    expect(component.refreshUIData).toHaveBeenCalled();
  });
  it('should ignore condition update if no condition selected', () => {
    spyOn(component, 'refreshUIData');
    component.conditions = [mockCondition];
    component.selectedConditionId = '';
    component.handleConditionTypeChange();
    expect(component.refreshUIData).not.toHaveBeenCalled();
  });
});
