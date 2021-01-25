import {Component, Input, OnInit} from '@angular/core';
import {Prototype} from "./user-info";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {mergeMap} from "rxjs/operators";
import {dateToYYYY_MM_DD, makeFormData, showServerError} from "./utils";
import {CurrentUserInfoObserver} from "./current-user-info-observer.service";
import {PrototypeDialogComponent} from "./prototype-dialog.component";

@Component({
  selector: 'app-order-dialog',
  template: `
    <h3 mat-dialog-title>Order product</h3>
    <mat-dialog-content>
      <p>
        <mat-form-field appearance="fill">
          <mat-label>Wanted delivery date</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="wantedDeliveryDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </p>
      <p><mat-form-field>
        <mat-label>Delivery address</mat-label>
        <input matInput [(ngModel)]="deliveryAddress">
      </mat-form-field></p>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-raised-button color="primary" [mat-dialog-close]="result">Order</button>
      <button mat-button color="primary" [mat-dialog-close]="undefined">Close</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class OrderDialog {
  wantedDeliveryDate: Date = new Date();
  deliveryAddress: string = "";

  get result() {
    return { wantedDeliveryDate: this.wantedDeliveryDate, deliveryAddress: this.deliveryAddress };
  }
}

@Component({
  selector: `app-prototype-card`,
  template: `
    <mat-card *ngIf="prototype">
        <mat-card-title>{{title}}</mat-card-title>
        <img [alt]="title"
             *ngIf="prototype.resources.length"
             mat-card-image [width]="200" [src]="'/prototype/resource/' + prototype.resources[0].location"
        >
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="doMakeOrder()">Order</button>
          <button mat-button color="primary" (click)="openPrototypeDialog()">Detail</button>
        </mat-card-actions>
    </mat-card>
  `,
  styles: [` `]
})
export class PrototypeCard implements OnInit {
  @Input() prototypeId: number = -1;
  prototype: Prototype | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userInfoObserver: CurrentUserInfoObserver,
  ) {}

  ngOnInit(): void {
    this.http.get<Prototype | null>(`/prototype/${this.prototypeId}`).subscribe(
      pr => this.prototype = pr
    );
  }

  get title() : string {
    return this.prototype ? this.prototype.description.split(/\n/)[0] : "";
  }

  doMakeOrder() {
    this.dialog.open(OrderDialog).afterClosed().pipe(
      mergeMap(res => this.http.post("/order/form", makeFormData({
        prototype_id: this.prototypeId,
        wanted_delivery_date: dateToYYYY_MM_DD(res.wantedDeliveryDate as Date),
        delivery_address: res.deliveryAddress
      }))),
    ).subscribe(
      _ => {
        this.snackBar.open("Successfully formed order.", "", {duration: 3000});
        this.userInfoObserver.triggerUpdateProductOrderList();
      },
      err => showServerError(err, this.snackBar)
    );
  }

  openPrototypeDialog() {
    this.dialog.open(PrototypeDialogComponent, {
      data: {
        product_prototype_id: this.prototypeId,
        hasOrderButton: true
      },
    }).afterClosed().subscribe(
      confirmMakeOrder => {
        if (confirmMakeOrder) this.doMakeOrder();
      }
    );
  }
}

@Component({
  selector: 'app-client-prototypes',
  template: `
    <button mat-raised-button color="primary" disabled>Add prototype (not coming soon).</button>
    <hr>
    <div class="flex-container">
      <app-prototype-card *ngFor="let pr of owningPrototypes" [prototypeId]="pr.product_prototype_id"></app-prototype-card>
    </div>
  `,
  styles: [`
    :host {
      padding: 10px;
    }

    .flex-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .flex-container > * {
      flex: 1 1 auto;
      max-width: 300px;
    }

    app-prototype-card {
      margin: 10px;
    }
  `]
})
export class ClientPrototypesComponent implements OnInit {
  owningPrototypes: Prototype[] | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Prototype[]>("/prototype/owning").subscribe(
      p => this.owningPrototypes = p
    );
  }

}
