import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ProductOrder, UserInfo} from "./user-info";
import {CurrentUserInfoObserver} from "./current-user-info-observer.service";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTable} from "@angular/material/table";
import {assignArray} from "./utils";
import {MatDialog} from "@angular/material/dialog";
import {PrototypeDialogComponent} from "./prototype-dialog.component";

interface AdditionalButton {
  label: string;
  onClick(order: ProductOrder): void;
}

export const clientColumns = ['order-id', 'planned-delivery-date', 'delivery-address', 'status', 'show-prototype'];
export const adminColumns = ['order-id', 'client-email', 'planned-delivery-date', 'delivery-address', 'status', 'progress', 'show-prototype'];
export const workerColumns = ['order-id', 'status', 'worker-deadline', 'show-prototype'];

@Component({
  selector: 'app-order-table',
  template: `
    <table mat-table [dataSource]="dataSource" *ngIf="dataSource.length > 0">
      <ng-container matColumnDef="order-id">
        <th mat-header-cell *matHeaderCellDef>Order id</th>
        <td mat-cell *matCellDef="let order">{{order.product_order_id}}</td>
      </ng-container>
      <ng-container matColumnDef="client-email">
        <th mat-header-cell *matHeaderCellDef>Client email</th>
        <td mat-cell *matCellDef="let order">{{ order.user_email }}</td>
      </ng-container>

      <ng-container matColumnDef="planned-delivery-date">
        <th mat-header-cell *matHeaderCellDef>Planned delivery date</th>
        <td mat-cell *matCellDef="let order">{{order.planned_delivery_date}}</td>
      </ng-container>

      <ng-container matColumnDef="delivery-address">
        <th mat-header-cell *matHeaderCellDef>Delivery address</th>
        <td mat-cell *matCellDef="let order"> {{
          (order.delivery_address.length>20)
            ? (order.delivery_address | slice:0:20)+'..'
            :(order.delivery_address)
          }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let order" >
          <div [ngClass]="['status', order.order_status]">{{order.order_status}}</div>
        </td>
      </ng-container>

      <ng-container matColumnDef="progress">
        <th mat-header-cell *matHeaderCellDef>Progress</th>
        <td mat-cell *matCellDef="let order" class="make-children-lineup">
          <mat-progress-spinner diameter="25" strokeWidth="7" [value]="order.assigned_workers_count == 0 ? 0 : 100 * order.finished_workers_count / order.assigned_workers_count"></mat-progress-spinner>
          {{order.finished_workers_count}} / {{order.assigned_workers_count}}
        </td>
      </ng-container>

      <ng-container matColumnDef="worker-deadline">
        <th mat-header-cell *matHeaderCellDef>Deadline</th>
        <td mat-cell *matCellDef="let order"> {{order.deadline}} </td>
      </ng-container>

      <ng-container matColumnDef="show-prototype">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let order">
          <button mat-button color="primary" (click)="showPrototype(order)">Show prototype</button>
        </td>
      </ng-container>

      <ng-container *ngFor="let but of additionalButtons" [matColumnDef]="'but-' + but.label">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let order">
          <button mat-raised-button color="primary" (click)="but.onClick(order);">{{but.label}}</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
      <tr mat-row *matRowDef="let myRowData; columns: columnsToDisplay"></tr>
    </table>
    <ng-template [ngIf]="dataSource.length == 0">
      You currently don't have any orders.
    </ng-template>
  `,
  styles: [`
    table {
      width: 100%;
    }

    .make-children-lineup > * {
      display: inline-block;
    }

    .status {
      font-weight: bold;
    }
    .status.pending { color: lightcoral; }
    .status.making { color: darkorange; }
    .status.finished { color: lightgreen; }
    .status.delivered { color: lightblue; }
  `]
})
export class OrderTableComponent implements OnInit {
  @Input() additionalButtons: AdditionalButton[] = [];
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  @Input() columnsToDisplay: string[] = [];
  dataSource: ProductOrder[] = [];

  constructor(
    private userInfoObserver: CurrentUserInfoObserver,
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = this.userInfoObserver.currentOwningProductOrderList;
      this.userInfoObserver.owningProductOrder.subscribe(
        res => {
          assignArray(this.dataSource, res);
          console.log(this.table, res);
          setTimeout( () => this.table?.renderRows(), 0);
        },
          err => {
            this.snackbar.open(err.message ? err.message : err, '', {duration: 3000});
            assignArray(this.dataSource, []);
            console.log(this.table);
            setTimeout( () => this.table?.renderRows(), 0);
          }
      );
      this.columnsToDisplay = Array.from(this.columnsToDisplay);
      for (let button of this.additionalButtons) {
        this.columnsToDisplay.push(`but-${button.label}`);
      }
    }, 700);
  }

  showPrototype(order: ProductOrder) {
    this.dialog.open(PrototypeDialogComponent, {
      data: {product_prototype_id: order.product_prototype_id}
    });
  }
}
