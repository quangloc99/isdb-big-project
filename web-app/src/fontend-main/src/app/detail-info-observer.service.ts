import { Injectable } from '@angular/core';
import {DetailInfo} from "./user-info";
import {Observable, Subscriber} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {mergeMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DetailInfoObserverService {
  detailInfo: Observable<DetailInfo[]>;
  private _currentDetailInfo: DetailInfo[] | undefined;
  private _trigger: Subscriber<any> = undefined as any;
  constructor(
    private http: HttpClient
  ) {
    this.detailInfo = new Observable<any>(subscriber => {
      this._trigger = subscriber;
    }).pipe(mergeMap(_ => this.http.get<DetailInfo[]>("/resources/all")));
    this.detailInfo.subscribe(info => this._currentDetailInfo = info);
    setTimeout(() => this.triggerUpdate(), 0);
  }

  get currentDetailInfo() {
    return this._currentDetailInfo ?? [];
  }

  triggerUpdate() {
    this._trigger.next();
  }
}
