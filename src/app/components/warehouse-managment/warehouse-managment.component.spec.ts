import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseManagmentComponent } from './warehouse-managment.component';

describe('WarehouseManagmentComponent', () => {
  let component: WarehouseManagmentComponent;
  let fixture: ComponentFixture<WarehouseManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
