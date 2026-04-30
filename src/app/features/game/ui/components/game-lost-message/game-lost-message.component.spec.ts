import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLostMessageComponent } from './game-lost-message.component';

describe('GameLostMessageComponent', () => {
  let component: GameLostMessageComponent;
  let fixture: ComponentFixture<GameLostMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLostMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameLostMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
