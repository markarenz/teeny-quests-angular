import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgActorShopComponent } from './svg-actor-shop.component';

describe('SvgActorShopComponent', () => {
  let component: SvgActorShopComponent;
  let fixture: ComponentFixture<SvgActorShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgActorShopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgActorShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
