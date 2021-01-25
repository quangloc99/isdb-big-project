import {Component, OnInit, ViewChild} from '@angular/core';
import {DetailInfoObserverService} from "./detail-info-observer.service";
import {DetailInfo} from "./user-info";
import {MatTable} from "@angular/material/table";
import {assignArray} from "./utils";

@Component({
  selector: 'app-detail-info-table',
  template: `
    <table mat-table [dataSource]="dataSource">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let detail">{{detail.name}}</td>
      </ng-container>
      <ng-container matColumnDef="quantity-left">
        <th mat-header-cell *matHeaderCellDef>Quantity remain</th>
        <td mat-cell *matCellDef="let detail">{{detail.quantity_remain}}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
      <tr mat-row *matRowDef="let myRowData; columns: columnsToDisplay"></tr>
    </table>
  `,
  styles: [`
    table {
      width: 100%;
    }
  `]
})
export class DetailInfoTableComponent implements OnInit {
  columnsToDisplay = ['name', 'quantity-left'];
  dataSource: DetailInfo[] = [];
  @ViewChild(MatTable) table: MatTable<any> | undefined;

  constructor(
    private detailInfoObserver: DetailInfoObserverService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = Array.from(this.detailInfoObserver.currentDetailInfo ?? []);
      this.detailInfoObserver.detailInfo.subscribe(info => {
        assignArray(this.dataSource, info);
        this.table?.renderRows();
      });
    }, 700);
  }
}
