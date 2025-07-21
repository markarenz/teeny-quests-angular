import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalBgComponent } from '@main/ui/components/modal-bg/modal-bg.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { LoaderAnimationComponent } from '@app/features/main/ui/components/loader-animation/loader-animation.component';
import { GameEditorService } from '@app/features/editor/services/game-editor-service/game-editor-service.service';
import { AuthProviderService } from '@app/features/auth/services/auth-provider-service';
import { User } from '@app/features/auth/interfaces/types';

@Component({
  selector: 'app-new-game-modal',
  standalone: true,
  imports: [
    ModalBgComponent,
    ButtonComponent,
    FormsModule,
    LoaderAnimationComponent,
  ],
  templateUrl: './new-game-modal.component.html',
  styleUrl: './new-game-modal.component.css',
})
export class NewGameModalComponent {
  subscription: Subscription;
  user: User | null = null;

  constructor(
    private _authService: AuthProviderService,
    private _gameEditorService: GameEditorService,
    private router: Router
  ) {
    this.subscription = Subscription.EMPTY;
  }

  ngOnInit() {
    this.subscription = this._authService.userObs.subscribe((data: any) => {
      this.user = data;
    });
  }

  @Output() onBgClick = new EventEmitter<string>();
  @Input('isMenuOpen') isMenuOpen: boolean = false;

  title: string = '';
  description: string = '';
  isValid: boolean = false;
  isLoading: boolean = false;

  validateForm() {
    let validCheck = true;
    if (this.title.length < 1 || this.description.length < 1) {
      validCheck = false;
    }
    this.isValid = validCheck;
  }
  handleCancelClick() {
    this.onBgClick.emit();
  }
  resetForm() {
    this.title = '';
    this.description = '';
    this.isValid = false;
    this.isLoading = false;
  }

  async handleOkClick() {
    this.isLoading = true;
    if (this.user?.id && this.user.username) {
      const newGameId = await this._gameEditorService.createGame({
        title: this.title,
        description: this.description,
        user: this.user,
      });
      this.resetForm();
      this.onBgClick.emit();
      if (newGameId) {
        this.router.navigate(['editor', newGameId]);
      }
    }
  }
}
