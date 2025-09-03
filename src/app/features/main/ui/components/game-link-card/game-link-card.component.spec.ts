import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLinkCardComponent } from './game-link-card.component';

describe('GameLinkCardComponent', () => {
  let component: GameLinkCardComponent;
  let fixture: ComponentFixture<GameLinkCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLinkCardComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(GameLinkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
