import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedStoneComponent } from './red-stone.component';

describe('RedStoneComponent', () => {
  let component: RedStoneComponent;
  let fixture: ComponentFixture<RedStoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedStoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedStoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
