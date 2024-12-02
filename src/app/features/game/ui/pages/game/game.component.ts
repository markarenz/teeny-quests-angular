import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ContainerComponent } from '@main/ui/components/container/container.component';
import { MainLayoutComponent } from '@main/ui/components/main-layout/main-layout.component';
import { gamesApiUrl } from '@config/index';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ContainerComponent, MainLayoutComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  isLoading: boolean = false;
  game: any = {};
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private _route: ActivatedRoute
  ) {}

  // Eventually we will pull this in dynamically
  title = '';
  description = '';

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    fetch(`${gamesApiUrl}?id=${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        this.title = data?.item?.title;
        this.game = data?.item;
        this.titleService.setTitle(this.title);
        this.metaService.addTag({
          name: 'description',
          content: this.description,
        });
      });
  }
}
