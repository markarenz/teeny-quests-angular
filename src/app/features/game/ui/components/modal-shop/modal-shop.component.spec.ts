import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameService } from '@app/features/game/services/game-service/game-service.service';
import { ModalShopComponent } from './modal-shop.component';
import { ToastrModule } from 'ngx-toastr';

describe('ModalShopComponent', () => {
  let component: ModalShopComponent;
  let fixture: ComponentFixture<ModalShopComponent>;
  let gameService: GameService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalShopComponent, ToastrModule.forRoot()],
      providers: [GameService],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(ModalShopComponent);
    gameService = TestBed.inject(GameService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle close shop', () => {
    spyOn(gameService, 'processShopAction');
    component.handleCloseShop();
    expect(gameService.processShopAction).toHaveBeenCalledWith('', 0, 'end');
  });

  it('should handle shop action - buy', () => {
    spyOn(gameService, 'processShopAction');
    component.handleShopAction('healthPotion', 10, 'buy');
    expect(gameService.processShopAction).toHaveBeenCalledWith(
      'healthPotion',
      10,
      'buy'
    );
  });

  it('should handle shop action - sell', () => {
    spyOn(gameService, 'processShopAction');
    component.handleShopAction('healthPotion', 5, 'sell');
    expect(gameService.processShopAction).toHaveBeenCalledWith(
      'healthPotion',
      5,
      'sell'
    );
  });

  it('should handle shop action - sell', () => {
    component.playerInventory = { healthPotion: 2, gold: 50 };
    component.shopInventory = [
      { inventoryItemId: 'healthPotion' },
      { inventoryItemId: 'manaPotion' },
    ];
    component.ngOnChanges();
    expect(component.playerInventoryKeys).toEqual(['healthPotion']);
    expect(component.playerFunds).toEqual(50);
  });
});
