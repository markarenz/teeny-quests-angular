import { Component, Input } from '@angular/core';
import { QuestArea, QuestAreaMap } from '@app/features/main/interfaces/types';
import { AreaCellComponent } from '@app/features/game/ui/components/area-cell/area-cell.component';
import { AreaActorComponent } from '@app/features/game/ui/components/area-actor/area-actor.component';
import { AreaItemComponent } from '@app/features/game/ui/components/area-item/area-item.component';
import { AreaPropComponent } from '@app/features/game/ui/components/area-prop/area-prop.component';
import { AreaExitComponent } from '@app/features/game/ui/components/area-exit/area-exit.component';
import { getPositionKeysForGridSize } from '@app/features/main/utils';
@Component({
  selector: 'app-quest-thumbnail',
  imports: [
    AreaCellComponent,
    AreaActorComponent,
    AreaItemComponent,
    AreaPropComponent,
    AreaExitComponent,
  ],
  templateUrl: './quest-thumbnail.component.html',
  styleUrl: './quest-thumbnail.component.css',
})
export class QuestThumbnailComponent {
  @Input('cover') cover: string = '';

  public area?: QuestArea;
  public positionKeys = getPositionKeysForGridSize();

  ngOnChanges() {
    if (this.cover) {
      this.area = JSON.parse(this.cover) as QuestArea;
    }
  }
}
