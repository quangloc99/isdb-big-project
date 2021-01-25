import { Component, OnInit } from '@angular/core';
import {ProductOrder, UserInfo} from "./user-info";
import {CurrentUserInfoObserver} from "./current-user-info-observer.service";
import {AdminChangeOrderStatusDialog, AdminWorkerManagementDialog} from "./admin-order-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/overlay";
import {WorkerArchiveOrderDialog, WorkerSpendDetailDialog} from "./worker-order-dialog.component";
import {clientColumns, adminColumns, workerColumns} from "./order-table.component";

@Component({
  selector: 'app-dashboard',
  template: `
    <mat-tab-group dynamicHeight>
      <ng-template [ngIf]="userInfo?.privilege == 'client'">
        <mat-tab label="Your prototypes">
          <app-client-prototypes></app-client-prototypes>
        </mat-tab>
        <mat-tab label="Your orders">
          <app-order-table
            [columnsToDisplay]="orderTableColumns.clientColumns"
          ></app-order-table>
        </mat-tab>
      </ng-template>

      <ng-template [ngIf]="userInfo?.privilege == 'admin'">
        <mat-tab label="All orders">
          <app-order-table [columnsToDisplay]="orderTableColumns.adminColumns" [additionalButtons]="[
            {label: 'Change status', onClick: openDialogForOrder(dia_comp.adminChangeOrderStatus)},
            {label: 'Manage workers', onClick: openDialogForOrder(dia_comp.adminWorkerManagement)}
          ]"></app-order-table>
        </mat-tab>
        <mat-tab label="Detail info">
            <app-detail-info-table></app-detail-info-table>
        </mat-tab>
      </ng-template>

      <ng-template [ngIf]="userInfo?.privilege == 'worker'">
        <mat-tab label="All active assigned orders">
          <app-order-table
            [columnsToDisplay]="orderTableColumns.workerColumns"
            [additionalButtons]="[
              { label: 'Spend details', onClick: openDialogForOrder(dia_comp.workerSpendDetail) },
              { label: 'Archive order', onClick: openDialogForOrder(dia_comp.workerArchiveOrder) }
            ]"
          ></app-order-table>
        </mat-tab>
        <mat-tab label="Archived orders">
          Not coming soon :)))
        </mat-tab>
        <mat-tab label="Detail info">
          <app-detail-info-table></app-detail-info-table>
        </mat-tab>
      </ng-template>
    </mat-tab-group>
  `,
  styles: [
  ]
})
export class DashboardComponent implements OnInit {
  userInfo: UserInfo | null = null;
  dia_comp = {
    adminChangeOrderStatus: AdminChangeOrderStatusDialog,
    adminWorkerManagement: AdminWorkerManagementDialog,
    workerArchiveOrder: WorkerArchiveOrderDialog,
    workerSpendDetail: WorkerSpendDetailDialog,
  };

  orderTableColumns = { clientColumns, adminColumns, workerColumns };

  constructor(
    private userInfoObserver: CurrentUserInfoObserver,
    private dialog: MatDialog
  ) {
    userInfoObserver.userInfo.subscribe(ui => this.userInfo = ui);
  }
  ngOnInit(): void {
    console.log(this.userInfo?.privilege);
  }

  openDialogForOrder(dialogComponent: ComponentType<any>) {
    return (order: ProductOrder) => this.dialog.open(dialogComponent, {
      data: {order}
    });
  }
}
