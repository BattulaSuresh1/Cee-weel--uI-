import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartLensComponent } from './cart-lens.component';

describe('CartLensComponent', () => {
  let component: CartLensComponent;
  let fixture: ComponentFixture<CartLensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartLensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartLensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
