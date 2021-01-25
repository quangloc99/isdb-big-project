import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticateComponent } from './authenticate.component';

import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { DashboardComponent } from './dashboard.component';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {ClientPrototypesComponent, OrderDialog, PrototypeCard} from './client-prototypes.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { OrderTableComponent } from './order-table.component';
import {MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {
  AdminAddWorkerDialog,
  AdminChangeOrderStatusDialog,
  AdminWorkerManagementDialog
} from './admin-order-dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {WorkerArchiveOrderDialog, WorkerSpendDetailDialog} from "./worker-order-dialog.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { PrototypeDialogComponent } from './prototype-dialog.component';
import { DetailInfoTableComponent } from './detail-info-table.component';
import { PageNotFound } from './page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent,
    DashboardComponent,
    ClientPrototypesComponent,
    PrototypeCard,
    OrderDialog,
    OrderTableComponent,

    AdminChangeOrderStatusDialog,
    AdminWorkerManagementDialog,
    AdminAddWorkerDialog,

    WorkerArchiveOrderDialog,
    WorkerSpendDetailDialog,
    PrototypeDialogComponent,
    DetailInfoTableComponent,
    PageNotFound,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    OrderDialog,

    AdminChangeOrderStatusDialog,
    AdminWorkerManagementDialog,
    AdminAddWorkerDialog,

    WorkerArchiveOrderDialog,
    WorkerSpendDetailDialog,

    PrototypeDialogComponent,
  ]
})
export class AppModule { }
