import { Routes } from '@angular/router';
import { GameComponent } from './features/game/ui/pages/game/game.component';
import { EditorHomeComponent } from './features/editor/ui/pages/editor-home/editor-home.component';
import { hasAuthGuard } from './features/auth/guards/has-auth/has-auth.guard';
import { EditorGameComponent } from './features/editor/ui/pages/editor-game/editor-game.component';
import { AboutPageComponent } from './features/main/ui/pages/about-page/about-page.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/main/ui/pages/home/home.component').then(
        m => m.HomeComponent
      ),
  },
  {
    path: 'quest/:id',
    loadComponent: () =>
      import('./features/game/ui/pages/game/game.component').then(
        m => m.GameComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/main/ui/pages/about-page/about-page.component').then(
        m => m.AboutPageComponent
      ),
  },
  {
    path: 'editor',
    loadComponent: () =>
      import(
        './features/editor/ui/pages/editor-home/editor-home.component'
      ).then(m => m.EditorHomeComponent),
    canActivate: [hasAuthGuard],
  },
  {
    path: 'editor/:id',
    loadComponent: () =>
      import(
        './features/editor/ui/pages/editor-game/editor-game.component'
      ).then(m => m.EditorGameComponent),
    canActivate: [hasAuthGuard],
  },
];
