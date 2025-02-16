import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgGithubComponent } from './svg-github.component';

describe('SvgGithubComponent', () => {
  let component: SvgGithubComponent;
  let fixture: ComponentFixture<SvgGithubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgGithubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgGithubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
