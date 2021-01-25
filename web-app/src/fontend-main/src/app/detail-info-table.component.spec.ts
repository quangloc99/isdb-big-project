import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInfoTableComponent } from './detail-info-table.component';

describe('DetailInfoTableComponent', () => {
  let component: DetailInfoTableComponent;
  let fixture: ComponentFixture<DetailInfoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailInfoTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInfoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
