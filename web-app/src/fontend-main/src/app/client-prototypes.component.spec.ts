import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPrototypesComponent } from './client-prototypes.component';

describe('ClientPrototypesComponent', () => {
  let component: ClientPrototypesComponent;
  let fixture: ComponentFixture<ClientPrototypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientPrototypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPrototypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
