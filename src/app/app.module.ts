import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MainAppService } from './features/main/services/main-app-service';
import { GameEditorService } from './features/editor/services/game-editor-service/game-editor-service.service';
import { GameService } from './features/game/services/game-service/game-service.service';
import { AuthProviderService } from './features/auth/services/auth-provider-service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [BrowserModule, FormsModule],
  providers: [
    MainAppService,
    GameEditorService,
    AuthProviderService,
    GameService,
  ],
  exports: [RouterModule],
})
export class AppModule {}
