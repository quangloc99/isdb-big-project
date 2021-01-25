import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Prototype} from "./user-info";
import {MatSnackBar} from "@angular/material/snack-bar";
import {showServerError} from "./utils";

@Component({
  selector: 'app-prototype-dialog',
  template: `
    <h3 mat-dialog-title>{{prototypeTitle}}</h3>
    <mat-dialog-content>
      <p>
        {{prototypeDescriptionBody}}
      </p>

    </mat-dialog-content>
    <div class="center-align" *ngIf="prototype && prototype.resources.length > 0">
      <div>
        <button mat-button color="primary" (click)="decResourceId()"><mat-icon>keyboard_arrow_left</mat-icon></button>
        <span style="width: 50px; text-align: center">
          {{ resourceId + 1}} / {{ prototype.resources.length}}
        </span>
        <button mat-button color="primary" (click)="incResourceId()"><mat-icon>keyboard_arrow_right</mat-icon></button>
      </div>
      <div style="min-height: 400px; display: flex; flex-direction: column; justify-content: center">
        <img alt="prototype image" [src]="'/prototype/resource/' + prototype.resources[resourceId].location" />
      </div>
    </div>
    <mat-dialog-actions>
      <button mat-raised-button color="primary" *ngIf="data.hasOrderButton" [matDialogClose]="true">Order</button>
      <button mat-button color="primary" matDialogClose>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    img {
      width: 300px;
    }
    .center-align {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class PrototypeDialogComponent implements OnInit {
  prototype: Prototype | undefined;
  resourceId: number = 0;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PrototypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product_prototype_id: number, hasOrderButton: boolean}
  ) {
    this.http.get<Prototype>(`/prototype/${this.data.product_prototype_id}`)
      .subscribe(
        val => {
          this.prototype = val
          this.resourceId = 0;
        },
        err => {
          showServerError(err, this.snackBar);
          dialogRef.close(false);
        }
      )
  }

  ngOnInit(): void {
  }

  get prototypeTitle() {
    return this.prototype?.description?.split('\n')?.[0];
  }

  get prototypeDescriptionBody() {
    return this.prototype?.description?.split('\n')?.slice(1).join('\n');
  }

  incResourceId() {
    if (!this.prototype) return ;
    this.resourceId += 1;
    this.resourceId %= this.prototype.resources.length;
  }

  decResourceId() {
    if (!this.prototype) return ;
    this.resourceId += this.prototype.resources.length - 1;
    this.resourceId %= this.prototype.resources.length;
  }
}
