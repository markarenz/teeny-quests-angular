import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { ContainerComponent } from '@app/features/main/ui/components/container/container.component';
import { gamesApiUrl } from '@config/index';
import { LoaderAnimationComponent } from '@app/features/main/ui/components/loader-animation/loader-animation.component';
import { ButtonComponent } from '@app/features/main/ui/components/button/button.component';
import { BreadcrumbsComponent } from '@app/features/main/ui/components/breadcrumbs/breadcrumbs.component';
import { Link, SubNavItem } from '@app/features/main/interfaces/types';

@Component({
  selector: 'app-editor-game',
  standalone: true,
  imports: [
    ContainerComponent,
    MainLayoutComponent,
    LoaderAnimationComponent,
    FormsModule,
    ButtonComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './editor-game.component.html',
  styleUrl: './editor-game.component.css',
})
export class EditorGameComponent {
  title = 'Editor Game';
  isLoading: boolean = false;
  isValid: boolean = false;
  game: any = {};

  constructor(private _route: ActivatedRoute) {}

  breadcrumbLinks: Link[] = [
    { label: 'Home', href: '' },
    { label: 'Game Editor', href: '/editor' },
    { label: 'Editing Game' },
  ];

  subNavCurrent: string = 'info';
  subNavLinks: SubNavItem[] = [
    { label: 'Info', slug: 'info' },
    { label: 'Areas', slug: 'areas' },
    { label: 'Misc', slug: 'misc' },
  ];

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    fetch(`${gamesApiUrl}?id=${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        this.title = data?.item?.title;
        this.game = data?.item;
      });
  }

  validateForm() {
    let validCheck = true;
    if (this.game.title.length < 1 || this.game.description.length < 1) {
      validCheck = false;
    }
    this.isValid = validCheck;
  }

  handleSaveClick() {
    this.isLoading = true;
    fetch(gamesApiUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({
        ...this.game,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.isLoading = false;
      });
  }
  handleSubNavClick(slug: string) {
    this.subNavCurrent = slug;
  }
}
