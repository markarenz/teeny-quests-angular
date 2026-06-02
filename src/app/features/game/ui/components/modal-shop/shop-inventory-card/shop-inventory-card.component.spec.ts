import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopInventoryCardComponent } from './shop-inventory-card.component';

describe('ShopInventoryCardComponent', () => {
  let component: ShopInventoryCardComponent;
  let fixture: ComponentFixture<ShopInventoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopInventoryCardComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(ShopInventoryCardComponent);
    component = fixture.componentInstance;
    component.key = 'healthPotion';
    component.transactionMode = 'buy';
    component.playerFunds = 100;
    component.playerInventory = { healthPotion: 2, gold: 100 };
    fixture.detectChanges();
  });

  it('should create', async () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should handle click', async () => {
    spyOn(component.onTransaction, 'emit');
    component.handleTransaction('healthPotion', 'buy');
    expect(component.onTransaction.emit).toHaveBeenCalled();
  });
});
