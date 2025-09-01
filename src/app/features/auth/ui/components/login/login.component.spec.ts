import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthProviderService;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, OAuthModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
    authService = TestBed.inject(AuthProviderService);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle sign in', () => {
    spyOn(authService, 'login');
    component.handleUserMenuAction('signIn');
    expect(authService.login).toHaveBeenCalled();
  });

  it('should handle sign out', () => {
    spyOn(authService, 'logout');
    component.handleUserMenuAction('signOut');
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should handle menu toggle', () => {
    expect(component.isUserMenuOpen).toBeFalse();
    component.toggleUserMenu();
    expect(component.isUserMenuOpen).toBeTrue();
    component.toggleUserMenu();
    expect(component.isUserMenuOpen).toBeFalse();
  });
});
