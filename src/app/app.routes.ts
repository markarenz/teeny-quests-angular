import { Routes } from '@angular/router';
import { HomeComponent } from './features/main/ui/pages/home/home.component';
import { GameComponent } from './features/game/ui/pages/game/game.component';
import { EditorHomeComponent } from './features/editor/ui/pages/editor-home/editor-home.component';
import { hasAuthGuard } from './features/auth/guards/has-auth/has-auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  {
    path: 'editor',
    component: EditorHomeComponent,
    canActivate: [hasAuthGuard],
    children: [{ path: 'home', component: EditorHomeComponent }],
  },
];
