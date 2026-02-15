import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallDefaultComponent } from './wall-default.component';

describe('WallDefaultComponent', () => {
  let component: WallDefaultComponent;
  let fixture: ComponentFixture<WallDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WallDefaultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WallDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
