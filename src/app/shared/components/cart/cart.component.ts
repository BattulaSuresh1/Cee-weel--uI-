import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { Router } from '@angular/router';
import { MatDialog , MatDialogConfig } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  public cartList:any = [];
  public prescriptionList:any = [];
  public TotalCartItem:number;
  public selectedViewPrescription: number = 0;

  public total:number = 0;
  public productDiscount:number = 0;
  public totalGST: number = 0;
  public subtotal:number = 0;
  public discount:number = 0;
  public discountType: string = 'percentage';
  public discountPercent: number = 0;
  public discountValue: number = 0;
  public coupon:string;
  public formSubmitted = false;
  public userDetails = this.authenticationService.getUserDetails();
  public customerId:string = this.authenticationService.getCustomerId();

  public totalPriceWithDiscount:number = 0;
  public totalDiscount: number = 0;
  
 
   public orderForm: FormGroup;
   public orderId: number;

   public discountTypeOption: any[] = [
    { id: 1, name: 'Percentage'},
    { id: 2, name: 'Amount'}
  ];

  constructor(private productService:ProductService,
    private authenticationService: AuthenticationService,
    private prescriptionService: PrescriptionService,
    private _router: Router) { }

  goToOverviewPage(): void {
    // Navigate to the overview page
    this._router.navigate(['/overview']);
  }
  ngOnInit(): void {

    this.getCartItems();
    this.getPrescriptoins();
  }

  // onInput(event: any): void {
  //   // const discount = event.target.value;
  //   // this.total = this.subtotal + this.totalGST - discount;
  //   // this.discount = discount;

  //   // const totalWithoutDisc = this.subtotal ;
  //   const totalWithoutDisc = this.totalPriceWithDiscount;

  //   if (this.discountType == "percentage") {
  //     const discountPercent = event.target.value;
  //     const discountAmt = totalWithoutDisc * (discountPercent / 100);
  //     this.total = Math.round(totalWithoutDisc - discountAmt);
  //     this.discount = discountAmt;
  //     this.discountPercent = discountPercent;
  //   }
  //   else { // Amount
  //     const discountAmt = event.target.value;
  //     // const discountPercent = (discountAmt/totalWithoutDisc) * 100;
  //     this.discount = discountAmt;
  //     this.total = Math.round(totalWithoutDisc - discountAmt);
  //     // this.discountPercent = discountPercent;
  //     // console.log(discountPercent);
  //   }
    
  //   if (this.total < 0)
  //     this.total = 0;
  // }

  onInput(event: any): void {
    const totalWithoutDisc = this.totalPriceWithDiscount;
    if (this.discountType == "percentage") {
      const discountPercent = event.target.value;
      const discountAmt = totalWithoutDisc * (discountPercent / 100);
      this.total = Math.round(totalWithoutDisc - discountAmt);
      this.discount = discountAmt;
      this.discountPercent = discountPercent;
    } else { // Amount
      const discountAmt = event.target.value;
      
      // Check if product discount is provided before applying it
      if (this.discountType === "amount" && discountAmt <= totalWithoutDisc) {
        this.discount = discountAmt;
      } else {
        this.discount = 0;
      }
  
      this.total = Math.round(totalWithoutDisc - this.discount);
    }
  
    if (this.total < 0) {
      this.total = 0;
    }
  }
  
  getCartItems():void{
    let params = new HttpParams();
    params = params.set('current_page', '1');
    params = params.set('per_page', '100');
    params = params.set('customerId', this.customerId);

    this.productService.getCarts(params)
    .subscribe((response: any) =>{
      this.cartList = response.data;
      this.TotalCartItem = response.total;
      this.total = 0;
      this.discount = 0;
      this.subtotal = 0;

      this.cartList.map(cart => {
        this.subtotal += cart.product.price * cart.quantities;
        this.discount += +cart.discount;
      });

      this.total = this.subtotal - this.discount;
      this.total = Math.round(this.total);
      this.totalPriceWithDiscount = this.total;
      this.totalDiscount = Math.round(this.discount);
      this.authenticationService.setTotalCartItems(this.TotalCartItem);
      console.log(this.discount , this.subtotal ,'sure');
    })
  }

  prescriptionUpdate(prescriptionId: any) {
    const param = {
      prescriptionId: prescriptionId.value,
  
    };
    this.selectedViewPrescription= prescriptionId.value;

    this.prescriptionService.updatePrescription(this.customerId, param).subscribe(
      (response: any) => {
        console.log(response);
      },
      (err) => console.log(err)
    );
  }

  getPrescriptoins():void{
    let params = new HttpParams();
    params = params.set('customerId', this.customerId);

    this.prescriptionService.getPrescriptions(params)
    .subscribe((response: any) =>{
      this.prescriptionList = response.data;
    })
  }

  cartUpdate(){
    this.getCartItems();
  }

  navigateToPlaceOrder(){

    if(this.cartList.length > 0){
      let params = { customerId: this.customerId, userId: this.userDetails.user_id ,discount: this.discount };
      this.productService.storeOrder(params).subscribe(
        (res:any) => {
          this._router.navigate(['/order-place',res.data.id]);
        },
        err => console.log(err)
      );
    }
  }

  ngOnDestroy() {
    this.authenticationService.setTotalCartItems(0);
  }

  showDiscountType(): void {
    const selectedDiscountType = this.discountType;
    console.log(`The discountType selected: ${selectedDiscountType}`);
  }
  
  onSelectProduct(event: any, productId: number): void {
 
    if (event.target.checked) {
      var updateStatus = 1;
    } else {
      var updateStatus = 0;
    }
 
  const param = {
      product_id: productId,
      update_status:updateStatus
    };
 
  }
}
