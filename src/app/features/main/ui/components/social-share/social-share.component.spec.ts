import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainAppService } from '@main/services/main-app-service';
import { SocialShareComponent } from './social-share.component';

describe('SocialShareComponent', () => {
  let component: SocialShareComponent;
  let fixture: ComponentFixture<SocialShareComponent>;
  let mainAppService: MainAppService;

  beforeEach(async () => {
    (globalThis as any).gtag = jasmine.createSpy('gtag');

    await TestBed.configureTestingModule({
      imports: [SocialShareComponent],
      providers: [MainAppService],
    }).compileComponents();

    mainAppService = TestBed.inject(MainAppService);
    fixture = TestBed.createComponent(SocialShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle close', () => {
    spyOn(mainAppService, 'setIsSharingOpen');
    component.handleClose();
    expect(mainAppService.setIsSharingOpen).toHaveBeenCalledWith(false);
  });

  it('should handle social out click', () => {
    spyOn(window, 'open');
    const link = {
      name: 'Twitter',
      url: 'https://twitter.com/share',
      icon: 'twitter',
    };
    component.handleSocialOutClick(link);
    expect((globalThis as any).gtag).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(link.url, '_blank');
  });
});
