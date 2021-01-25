import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <h1>404</h1>
    <p>That's it, <a href="/login">go back</a>.</p>
    <p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Or wonder beyond!!!</a></p>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 100px);
    }

    h1 {
      font-size: 80px;
    }

    :host > * {
      margin: 0;
    }
  `]
})
export class PageNotFound implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
