import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-place',
  templateUrl: './order-place.component.html',
  styleUrls: ['./order-place.component.css']
})
export class OrderPlaceComponent implements OnInit {

  @Output('updateEvent') public orderUpdateEvent = new EventEmitter();

  public orderId: number;
  public orderItem:any;
  public isOrderShow:boolean = true;
  public orderForm: FormGroup;
  public balanceAmount: number;
  orderStatus: any;

  public paymentTypeOptions: any[] = [
    { id: 1, name: 'CASH' },
    { id: 2, name: 'UPI'},
    { id: 3, name: 'ONLINE'}
  ];

  public paymentSettlementOptions: any[] = [
    { id: 1, name: 'Full Amount' }
    
  ];

  public orderStatusOptions: any[] = [
    { id: 1, name: 'Progress' },
    { id: 2, name: 'Complete'}
  ];

  public isError:boolean = false;

  constructor(
    private productService:ProductService,
    private route: ActivatedRoute,
    private fb:FormBuilder,
    private _router:Router,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('orderId');
    this.createOrderForm();
    this.getOrders();
    this.formEvents();
  }

  formEvents(){
    this.orderForm.get('paymentSettlement').valueChanges.subscribe(
      (val) =>{
        if(val.id === 1){
          this.orderForm.get('amount').setValue(this.balanceAmount);
          this.orderForm.get('amount').disable();
        }else{
          this.orderForm.get('amount').setValue('');
          this.orderForm.get('amount').enable();
        }
      }
    );

    this.orderForm.get('amount').valueChanges.subscribe((v) => {
      const enterAmount = +v;
      const orderAmount = +this.orderItem.amount;
      // console.log(`${enterAmount} - ${orderAmount}`);
        if(enterAmount > orderAmount){
          this.isError = true;
        }else{
          this.isError = false;
        }
        this.cd.detectChanges();
    });
  }

  createOrderForm(){
    this.orderForm = this.fb.group({
      paymentType: ['',[Validators.required]],
      paymentSettlement: ['',[Validators.required]], 
      amount: ['',[Validators.required]],
      // orderStatus: ['',[Validators.required]]
    });
  }

  get formValidate(){ return this.orderForm.controls; }

  getOrders(){
    this.productService.showOrder(this.orderId).subscribe( (res:any) => {
      this.orderItem = res.data.order;

      const orderpayments = this.orderItem.orderpayments;

      if(orderpayments.length > 0 ) {
        this.paymentSettlementOptions.push({ id: 2, name: 'Balance Amount'});
      } else {
        this.paymentSettlementOptions.push({ id: 2, name: 'Advance Amount'});
      }

        this.checkOrderShow();
    });
  }

  orderFormSubmit(){
    if(this.orderForm.invalid || this.isError){
      return;
    }
    this.orderForm.get('amount').enable();
    const params = {
      payment_type: this.orderForm.value.paymentType.id.toString(),
      payment_settlement: this.orderForm.value.paymentSettlement.id.toString(), 
      amount: this.orderForm.value.amount,
      order_status: this.getOrderStatusValue(),
   
     };
       params['order_status'] = this.getOrderStatusValue();


    this.productService.updateOrder(this.orderId,params).subscribe( (res:any) => {
      this.orderItem = res.data;
      this.checkOrderShow();
      this.updateOrder();
      this.ngOnInit();
      this._router.navigate(['/orders']);
    });
  }

  checkOrderShow(){
    const totalAmont = this.orderItem.amount;
    let paidAmount = 0;
    this.orderItem.orderpayments.forEach(payment => {
      paidAmount += +(payment.paid_amount)
    });
    this.balanceAmount = totalAmont - paidAmount;
    const orderStatus = this.orderItem.order_status;
    if(orderStatus == '1' || orderStatus == '0' ){
      this.isOrderShow = true;
    }else if(orderStatus == 2){
      this.isOrderShow = false;
    }

    this.orderStatus = this.orderItem.order_status;
  }
  updateOrder(){
    this.orderUpdateEvent.emit('true');
  }

  
  getOrderStatusValue(): string {
    const orderAmount = +this.orderItem.amount;
    const paidAmount = +this.orderItem.paid_amount;
  
    // if (paidAmount === orderAmount) {
    //   return '1'; // Order Completed
    // } else if (paidAmount > 0 && paidAmount < orderAmount) {
    //   return '0'; // Order Placed
    // } else {
    //   return '2'; // Order Canceled or no payment made yet
    // }

    if(paidAmount !== orderAmount){
      return '0'
    } else if (paidAmount === orderAmount){
      return '1'
    } else {
      return '2'
    }

  };
  
  

  

  // getOrderStatusValue(): string {  
    
  //    if (this.balanceAmount === 0) {
  //     return '1'; // If balanceAmount is 0, set status to '1' (Order Completed)
  //   }

  //   else if (this.balanceAmount !== 0 && this.balanceAmount !== this.orderItem.amount) {
  //     return '0'; // If balanceAmount is not 0 and not fully paid, set status to '0' (Order Placed)
  //   }
    
  //   else {
  //     return '2'; // If fully paid and not canceled, set status to '2' (Order Canceled)
  //   }
  // }
}
