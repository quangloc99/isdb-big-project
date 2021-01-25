import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthenticateComponent} from "./authenticate.component";
import {DashboardComponent} from "./dashboard.component";
import {PageNotFound} from "./page-not-found.component";

const routes: Routes = [
  { path: 'login', component: AuthenticateComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '404', component: PageNotFound },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
