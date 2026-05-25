import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemAwesomeSwordComponent } from './svg-item-awesome-sword.component';

describe('SvgItemAwesomeSwordComponent', () => {
  let component: SvgItemAwesomeSwordComponent;
  let fixture: ComponentFixture<SvgItemAwesomeSwordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgItemAwesomeSwordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgItemAwesomeSwordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
