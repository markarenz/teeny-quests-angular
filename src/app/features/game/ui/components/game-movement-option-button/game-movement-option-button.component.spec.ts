import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMovementOptionButtonComponent } from './game-movement-option-button.component';

describe('GameMovementOptionButtonComponent', () => {
  let component: GameMovementOptionButtonComponent;
  let fixture: ComponentFixture<GameMovementOptionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMovementOptionButtonComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(GameMovementOptionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
