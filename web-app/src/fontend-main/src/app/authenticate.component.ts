import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {map, mergeMap} from "rxjs/operators";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {makeFormData, showServerError} from "./utils";

interface LoginResponse {
  code?: number;
  message: string;
}

@Component({
  selector: 'authenticate',
  template: `
    <mat-card>
      <mat-card-title>Login</mat-card-title>
      <form [formGroup]="formGroup" (submit)="onSubmit()">
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password">
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Submit</button>
      </form>
    </mat-card>

    <h1>Accounts for testing</h1>
    <p>All users have the same password:
      <code>123456</code>
    </p>
    Admin: <ul><li>admin@here.com</li></ul>

    User: <ul>
      <li>user1@nowhere.com</li>
      <li>user2@anywhere.ru</li>
    </ul>

    Workers: <ul>
      <li>worker1@nocompany.com</li>
      <li>worker2@nocompany.com</li>
      <li>worker3@nocompany.com</li>
      <li>worker4@nocompany.com</li>
    </ul>

  `,
  styles: [`
    mat-card-title {
      width: 300px;
      text-align: center;
    }

    form {
       min-width: 150px;
       max-width: 500px;
       width: 100%;
    }

    form > * {
       width: 100%;
    }

    :host > mat-card > * {
      margin: auto;
      display: block;
    }
  `],
})
export class AuthenticateComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  formGroup = new FormGroup({
    "email": new FormControl(""),
    "password": new FormControl("")
  });

  ngOnInit(): void {
    // this.formGroup.reset();
  }

  onSubmit() {
    console.log(this.formGroup);
    this.http.post<LoginResponse>("/user/login", makeFormData(this.formGroup.value), { responseType: 'json'}).pipe(
      map(response => {
        console.log(response);
        if (response.code != 0) {
          throw response;
        }
      }),
    ).subscribe(
      _ => this.router.navigateByUrl("/dashboard"),
      response => showServerError(response, this.snackBar)
    )
  }
}
