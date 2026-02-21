import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemSapphireComponent } from './svg-item-sapphire.component';

describe('SvgItemSapphireComponent', () => {
  let component: SvgItemSapphireComponent;
  let fixture: ComponentFixture<SvgItemSapphireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemSapphireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgItemSapphireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
