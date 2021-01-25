import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Worker, ProductOrder, WorkerForOrder} from "./user-info";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {dateToYYYY_MM_DD, makeFormData, showServerError} from "./utils";
import {CurrentUserInfoObserver} from "./current-user-info-observer.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {filter, mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-admin-change-order-status-dialog',
  template: `
    <h3 mat-dialog-title>Change order status</h3>
    <mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-select [(value)]="data.order.order_status">
          <mat-option value="pending">pending</mat-option>
          <mat-option value="making">making</mat-option>
          <mat-option value="finished">finished</mat-option>
          <mat-option value="delivered">delivered</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-raised-button color="primary" (click)="changeStatus()">Change status</button>
    </mat-dialog-actions>
  `,
  styles: [
  ]
})
export class AdminChangeOrderStatusDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      order: ProductOrder
    },
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private userInfoObserver: CurrentUserInfoObserver,
    private dialogRef: MatDialogRef<AdminChangeOrderStatusDialog>
  ) {
    this.data.order = Object.assign({}, this.data.order);
  }

  ngOnInit(): void {
  }

  changeStatus() {
    console.log(this.data.order);
    this.http.put("/order/change-status", makeFormData({
      product_order_id: this.data.order.product_order_id,
      order_status: this.data.order.order_status
    })).subscribe(
      _ => this.snackBar.open("Order status changed successfully.", '', {duration: 3000}),
      err => showServerError(err, this.snackBar),
      () => this.userInfoObserver.triggerUpdateProductOrderList()
    );
    this.dialogRef.close(this.data.order.order_status);
  }
}

@Component({
  selector: 'app-admin-add-worker-dialog',
  template: `
    <h3 mat-dialog-title>Add worker</h3>
    <mat-dialog-content>
      <form [formGroup]="fg" (ngSubmit)="doAddWorker()">
        <mat-form-field appearance="fill">
          <mat-label>[id] Worker (email)</mat-label>
          <mat-select formControlName="selectedWorkerId">
            <mat-option *ngFor="let worker of freeWorkers" [value]="worker.worker_id">
              [{{worker.worker_id}}] {{worker.name}} ({{worker.email}})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Deadline</mat-label>
          <input formControlName="deadline" matInput [matDatepicker]="picker">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker disabled="false"></mat-datepicker>
        </mat-form-field>
        <div>
          <button mat-raised-button color="primary" type="submit">Add</button>
          <button mat-button color="primary" matDialogClose>Cancel</button>
        </div>
      </form>
    </mat-dialog-content>
  `,
  styles: [`
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 400px;
    }
    form > * {
      width: 400px;
    }
  `]
})
export class AdminAddWorkerDialog implements OnInit {
  freeWorkers: Worker[] = [];
  fg: FormGroup;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AdminAddWorkerDialog>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { order: ProductOrder }
  ) {
    this.fg = this.fb.group({
      selectedWorkerId: [undefined, Validators.required],
      deadline: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.http.get<Worker[]>(`/worker/free-for-order/${this.data.order.product_order_id}`).subscribe(
      res => this.freeWorkers = res,
      err => {
        this.dialogRef.close();
        showServerError(err, this.snackBar);
      }
    )
  }

  doAddWorker() {
    if (this.fg.status != 'VALID') {
      this.snackBar.open("All fields are required", '', {duration: 1500});
      return ;
    }
    this.dialogRef.close(this.fg.value);
  }
}

@Component({
  selector: 'app-admin-worker-management-dialog',
  template: `
    <h3 mat-dialog-title>Manage worker</h3>
    <mat-dialog-content>
      <button mat-raised-button color="primary" (click)="openAddWorkerDialog()">Add worker</button>
      <hr>
      <table mat-table [dataSource]="workers" *ngIf="workers.length > 0">
        <ng-container matColumnDef="worker-id">
          <th mat-header-cell *matHeaderCellDef>Worker id</th>
          <td mat-cell *matCellDef="let worker">{{worker.worker_id}}</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let worker">{{worker.name}}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>email</th>
          <td mat-cell *matCellDef="let worker">{{worker.email}}</td>
        </ng-container>
        <ng-container matColumnDef="deadline">
          <th mat-header-cell *matHeaderCellDef>Deadline</th>
          <td mat-cell *matCellDef="let worker">{{worker.deadline}}</td>
        </ng-container>
        <ng-container matColumnDef="is_finished">
          <th mat-header-cell *matHeaderCellDef>Finished?</th>
          <td mat-cell *matCellDef="let worker" [class]="worker.is_finished ? 'finished' : 'not-finished'"><mat-icon>{{worker.is_finished ? 'done' : 'close'}}</mat-icon></td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
        <tr mat-row *matRowDef="let myRowData; columns: columnsToDisplay"></tr>
      </table>
    </mat-dialog-content>
    <ng-template [ngIf]="workers.length == 0">
      There is no assigned workers yet.
    </ng-template>
  `,
  styles: [`
    .finished { color: lightgreen }
    .not-finished { color: red }

    mat-dialog-content {
      width: 600px;
    }
    table {
      width: 100%;
    }
  `]
})
export class AdminWorkerManagementDialog implements OnInit{
  workers: WorkerForOrder[] = [];
  columnsToDisplay = ['worker-id', 'name', 'email', 'deadline', 'is_finished'];

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private userInfoObserver: CurrentUserInfoObserver,
    @Inject(MAT_DIALOG_DATA) private data: {order: ProductOrder}
  ) {
    this.loadWorkers();
  }

  loadWorkers() {
    this.http.get<WorkerForOrder[]>(`/order/${this.data.order.product_order_id}/workers`)
      .subscribe(
        val => this.workers = val,
        err => showServerError(err, this.snackBar)
      );
  }

  ngOnInit(): void {
    console.log("wth???");
  }

  openAddWorkerDialog() {
    this.dialog.open(AdminAddWorkerDialog, {
      data: this.data
    }).afterClosed().pipe(
      filter(res => !!res),
      mergeMap(res =>  this.http.put("/worker/assign-to-order", makeFormData({
        worker_id: res.selectedWorkerId,
        deadline: dateToYYYY_MM_DD(res.deadline),
        product_order_id: this.data.order.product_order_id
      }))
    )).subscribe(
        _ => {
          this.snackBar.open("Add worker successfully", '', {duration: 3000})
          this.userInfoObserver.triggerUpdateProductOrderList();
          this.loadWorkers();
        },
        err => showServerError(err, this.snackBar)
      );
  }
}
