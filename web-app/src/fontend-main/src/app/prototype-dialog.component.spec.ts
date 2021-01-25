import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrototypeDialogComponent } from './prototype-dialog.component';

describe('PrototypeDialogComponent', () => {
  let component: PrototypeDialogComponent;
  let fixture: ComponentFixture<PrototypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrototypeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrototypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
