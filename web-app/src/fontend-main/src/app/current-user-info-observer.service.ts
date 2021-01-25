import { Injectable } from '@angular/core';
import {Observable, Subscriber} from "rxjs";
import {ProductOrder, UserInfo} from "./user-info";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {filter, map, mergeMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserInfoObserver {
  userInfo: Observable<UserInfo | null>;
  owningProductOrder: Observable<ProductOrder[]>;
  private _currentUserInfo: UserInfo | null = null;
  private _currentOwningProductOrderList: ProductOrder[] = [];
  private updateOwningProductOrderSubscriber: Subscriber<any> | null = null;

  constructor(private router: Router, private http: HttpClient) {
    this.userInfo = this.router.events.pipe(
      filter(ev => ev instanceof NavigationEnd),
      mergeMap(_ => http.get("/user/info", {responseType: 'text'})),
      map(str => this._currentUserInfo = str.length ? JSON.parse(str) as UserInfo : null)
    );
    const statusPriority = ['pending', 'making', 'finished', 'delivered'];
    this.owningProductOrder = new Observable<any>(subscriber => this.updateOwningProductOrderSubscriber = subscriber)
      .pipe(
        mergeMap(_ => this.http.get<ProductOrder[]>("/order/all")),
        map(res => {
          res.sort((u, v) => {
            const cmpStatus = statusPriority.indexOf(u.order_status) - statusPriority.indexOf(v.order_status);
            if (cmpStatus == 0) {
              return u.product_order_id - v.product_order_id;
            }
            return cmpStatus;
          });
          return res;
        })
      );

    this.owningProductOrder.subscribe(res => {
      this._currentOwningProductOrderList = res;
    });

    this.userInfo.subscribe(_ => this.triggerUpdateProductOrderList());
  }

  get currentUserInfo() {
    return this._currentUserInfo;
  }

  get currentOwningProductOrderList () {
    return this._currentOwningProductOrderList;
  }

  triggerUpdateProductOrderList() {
    console.log("calling trigger update");
    this.updateOwningProductOrderSubscriber?.next();
  }
}
