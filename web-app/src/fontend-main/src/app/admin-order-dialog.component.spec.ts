import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChangeOrderStatusDialog } from './admin-order-dialog.component';

describe('AdminOrderDialogComponent', () => {
  let component: AdminChangeOrderStatusDialog;
  let fixture: ComponentFixture<AdminChangeOrderStatusDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminChangeOrderStatusDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChangeOrderStatusDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
