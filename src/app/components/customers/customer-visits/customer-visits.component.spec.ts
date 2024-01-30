import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVisitsComponent } from './customer-visits.component';

describe('CustomerVisitsComponent', () => {
  let component: CustomerVisitsComponent;
  let fixture: ComponentFixture<CustomerVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
