import { Component } from '@angular/core';
import {CurrentUserInfoObserver} from "./current-user-info-observer.service";
import {ProductOrder, UserInfo} from "./user-info";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/overlay";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fontend-main';
  userInfo: UserInfo | null = null;

  constructor(
    private currentUserInfoObserver: CurrentUserInfoObserver,
    private router: Router,
    private http: HttpClient,
  ) {
    currentUserInfoObserver.userInfo.subscribe(ui => this.userInfo = ui);
    currentUserInfoObserver.userInfo.subscribe(ui => {
      if (!(['/login', '/dashboard'].includes(this.router.url))) return ;
      if ((ui == null) == (this.router.url == '/login')) return;
      if (ui == null) {
        router.navigateByUrl('/login');
      } else {
        router.navigateByUrl('/dashboard');
      }
    });
  }

  doLogout() {
    this.http.post("/user/logout", {}).subscribe(
      _ => this.router.navigateByUrl("/login"),
      error => console.error(error)
    );
  }
}
