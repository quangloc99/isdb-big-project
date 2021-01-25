import {Component, Inject, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CurrentUserInfoObserver} from "./current-user-info-observer.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {makeFormData, showServerError} from "./utils";
import {DetailInfo, ProductOrder} from "./user-info";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DetailInfoObserverService} from "./detail-info-observer.service";

@Component({
  selector: 'app-worker-archive-order-dialog',
  template: `
    <h3 mat-dialog-title>Confirmation</h3>
    <mat-dialog-content>
      Do you want to archive this order?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button color="primary" (click)="doArchive()">Yes</button>
      <button mat-button color="primary" matDialogClose>No</button>
    </mat-dialog-actions>
  `,
  styles: [`
  `]
})
export class WorkerArchiveOrderDialog {
  constructor(
    private dialogRef: MatDialogRef<WorkerArchiveOrderDialog>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private userInfoObserver: CurrentUserInfoObserver,
    @Inject(MAT_DIALOG_DATA) private data: {order: ProductOrder }
  ) {
  }

  doArchive() {
    this.dialogRef.close(true);
    this.http.put("/worker/archive-order", makeFormData({
      product_order_id: this.data.order.product_order_id
    })).subscribe(
      _ => this.snackBar.open("Archive successfully", '', {duration: 3000}),
      err => showServerError(err, this.snackBar),
      () => this.userInfoObserver.triggerUpdateProductOrderList()
    );
  }
}

@Component({
  selector: 'app-worker-spend-detail-dialog',
  template: `
    <h3 mat-dialog-title>Spend detail</h3>
    <mat-dialog-content>
        <form [formGroup]="form">
          <div>
            <mat-form-field>
              <mat-label>Detail type</mat-label>
              <mat-select formControlName="detail_type_id">
                <mat-option *ngFor="let detail of detailInfoObserver.currentDetailInfo" [value]="detail.detail_type_id">
                  {{detail.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <ng-template [ngIf]="currentDetail">
              Remaining: {{currentDetail.quantity_remain}}
            </ng-template>
          </div>
          <mat-form-field>
            <mat-label>Quantity</mat-label>
            <input matInput formControlName="quantity">
          </mat-form-field>
        </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button color="primary" (click)="commitSpentDetail()">Commit</button>
      <button mat-button color="primary" matDialogClose="">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      max-width: 400px;
    }

  `]
})
export class WorkerSpendDetailDialog implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<WorkerSpendDetailDialog>,
    public detailInfoObserver: DetailInfoObserverService,
    @Inject(MAT_DIALOG_DATA) private data: { order: ProductOrder }
  ) {
    this.form = this.fb.group({
      "detail_type_id": [null, Validators.required],
      "quantity": [0, Validators.min(1)]
    });
  }

  ngOnInit() {
  }

  commitSpentDetail() {
    if (this.form.status != 'VALID') return ;
    this.http.put("/resources/spend", makeFormData({
      product_order_id: this.data.order.product_order_id,
      detail_type_id: this.form.value.detail_type_id,
      quantity: this.form.value.quantity
    })).subscribe(
      _ => {
        this.snackBar.open("Spend detail successfully", '', {duration: 3000})
        this.detailInfoObserver.triggerUpdate();
      },
      err => showServerError(err, this.snackBar)
    );
    this.dialogRef.close(this.form.value);
  }

  get currentDetail(): DetailInfo | undefined {
    return this.detailInfoObserver.currentDetailInfo?.find(x => x.detail_type_id == this.form.value.detail_type_id);
  }
}
