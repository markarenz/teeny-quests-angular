import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPlayerPositionComponent } from './editor-player-position.component';

describe('EditorPlayerPositionComponent', () => {
  let component: EditorPlayerPositionComponent;
  let fixture: ComponentFixture<EditorPlayerPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPlayerPositionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPlayerPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoudld handle changed player position prop', () => {
    fixture.detectChanges();
    component.playerPosition = '5_5';
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.positionStyle.left.substring(0, 2)).toBe('42');
  });
});
