import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBgComponent } from './modal-bg.component';

describe('ModalBgComponent', () => {
  let component: ModalBgComponent;
  let fixture: ComponentFixture<ModalBgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
