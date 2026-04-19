import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaActorComponent } from './area-actor.component';

describe('AreaActorComponent', () => {
  let component: AreaActorComponent;
  let fixture: ComponentFixture<AreaActorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaActorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaActorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
