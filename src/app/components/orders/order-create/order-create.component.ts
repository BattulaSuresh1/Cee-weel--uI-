import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  public SERVER_PATH = environment.REST_API_URL;
  public orderId:number;
  public customer:any;
  public orderItems:any[] = [];
  public order:any;
  public total:number = 0;

  isOrderPlaced: boolean = false;
  public paidAmount: number;
  public balanceAmount: number;
  isPaymentUpdated: boolean = false;
  private _router = Router;
  private _snackBar: MatSnackBar;

  public orderPayments:any[] = [];
  
  public payment_settlement: any[] = [
    { id: 1, name: 'Full Amount' },
    { id: 2, name: 'Balance Amount' }
  ];

  public balanceAmountChild: any;
  constructor(private productService: ProductService,
    // private router:ActivatedRoute,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {

    this.orderId = +this.route.snapshot.paramMap.get('orderId');
    this.getData();
  }

  getData(){
    this.productService.showOrder(this.orderId).subscribe(
      (res) => {
        console.log(res);
        this.customer = res.data.order.customer;
        this.orderItems = res.data.order.orderitems;
        this.order = res.data.order;
        this.orderPayments = res.data.order.orderpayments;
        let paidAmount = 0;
        let totalAmont = this.order.amount;

        this.order.orderpayments.forEach(payment => {
          paidAmount += +(payment.paid_amount)
        });
        this.paidAmount = paidAmount;
        this.balanceAmount = totalAmont - paidAmount;
      }
    )
  }

  setBalanceAmount(amount : any)
  {
    this.balanceAmountChild = amount;
  }
    placeOrder() {
      // Your order placement logic
      this.isOrderPlaced = true;
    }

    generateInvoice() {
      this.productService.generateSalesInvoice(this.orderId).subscribe(
        (res: any) => {
          console.log('sales Invoice', res.sales_invoice_pdf);
          if (res.sales_invoice_pdf) {
            const pdfUrl = res.sales_invoice_pdf;
            const newWindow = window.open(pdfUrl, '_blank');
            // if (newWindow) {
            //   newWindow.onload = () => {
            //     newWindow.print();
            //   };
            // }
          }
        },
        (err) => err
      );
    }

    cancelorder(orderId: number): void {
      console.log("Cancelling order with orderId: ", orderId);
      this.productService.cancelOrder(orderId).subscribe(
        (res) => {
          console.log(res);
          // debugger;
          this.showCancelOrderMessage();
          this.isPaymentUpdated = false;
          this.router.navigate(['/orders']);
        },
        (error) => {
          // Handle cancellation error if needed
          console.error('Cancellation failed:', error);
        }
      );
    }

  showCancelOrderMessage(): void {
    this._snackBar.open('Order canceled Successfully', 'Close', {
      duration: 2000,
    });
  }

  
  generatePdfLink() {
    this.productService.generateSalesOrder(this.orderId).subscribe(
      (res: any) => {
        console.log('sales Invoice', res.sales_invoice_pdf);
        if (res.sales_invoice_pdf) {
          const pdfUrl = res.sales_invoice_pdf;
          const newWindow = window.open(pdfUrl, '_blank');
          // if (newWindow) {
          //   newWindow.onload = () => {
          //     newWindow.print();
          //   };
          // }
        }
      },
      (err) => err
    );
    // return `${this.SERVER_PATH}/pdf/orders/sales_order_copy_${this.order?.id}.pdf`;
  }

  goBack(): void {
    this.location.back();
  }
}
