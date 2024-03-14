import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS, PAGE_LENGTH, ITEMS_PER_PAGE, CURRENT_PAGE } from '../../shared/constants/pagination.contacts';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from '../../auth/services/loader.service';
import { CommonService } from '../../services/common.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../../auth/services/authentication.service';

const dialogConfig= new MatDialogConfig();
dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public SERVER_PATH = environment.REST_API_URL;
 
  @ViewChild('paginator', {static: true}) paginator: MatPaginator;

  fb = FormBuilder;

  displayedColumns: string[] = ['id','amount','paidAmount','balance','status','actions'];//,'model','color','size','frame_type','collection_type','material','prescription_type','glass_color','frame_width','catalog_no'
 
  public PAGE_SIZE_OPTIONS_DATA:number[] = PAGE_SIZE_OPTIONS;

  public page_length:number = PAGE_LENGTH;

  public items_per_page:number = ITEMS_PER_PAGE;

  public current_page:number = CURRENT_PAGE;

  dataSource = new MatTableDataSource<any[]>();

  public filter:FormControl = new FormControl("",Validators.required)

  public orderStatus: FormControl = new FormControl("")
  myForm: FormGroup;


  public customerId:string|number = this.authenticationService.getCustomerId();
  public userDetails = this.authenticationService.getUserDetails();

  options = [
    { label: 'Order Placed', value: '0' },
    { label: 'Order Completed', value: '1' },
    { label: 'Order Cancelled', value: '2' },
  ];

  pageIndex = 0;

  constructor(
    private dialog:MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private loaderService:LoaderService,
    private commonService:CommonService,
    private productService:ProductService,
    private authenticationService:AuthenticationService
  ) { 
    matIconRegistry.addSvgIcon(
      "filter",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/SVG/filter.svg")
      );
      
  }



  onSubmit() {
    const selectedStatus = this.myForm.get('order_status').value;
    const filter = this.myForm.get('filter').value;
    alert(`Selected Value: ${selectedStatus}  ${filter}`);
  }

  ngOnInit(): void {
    this.getData(this.current_page, this.page_length);

    this.filter.valueChanges.subscribe((f) => {
      this.page_length = ITEMS_PER_PAGE;
        this.getData(this.current_page, this.page_length);
    });

    this.myForm = this.fb.bind({
      order_status: [''], // Default value is an empty string, you can set it to a default value if needed
      filter: [''], // Default value is an empty string, you can set it to a default value if needed
    });
  }
  

  ngAfterViewInit(){
    // this.dataSource.paginator = this.paginator;
  }

  advancedFilter(){
    this.current_page = 0;
    this.pageIndex = 0;
    this.getData(this.current_page, this.page_length);
  }

  getData(currentPage, perPage):void{
    const customerId = (this.customerId != null)? this.customerId.toString() : '';
    // const userId = (this.userDetails != null)? this.userDetails.user_id.toString() : '';
    let params = new HttpParams();
    params = params.set('current_page', currentPage);
    params = params.set('per_page', perPage);
    params = params.set('customerId', customerId);
    // params = params.set('userId', userId);
    let order_status = this.orderStatus.value;
    params = params.set('order_status', order_status);


    if(this.filter.value != "") {
      let filter = this.filter.value;
      params = params.set('filter',filter);
    }

     
    this.productService.getOrders(customerId)
    .subscribe((response: any) =>{
      console.log(response.data);
      this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.page_length = response.total;
    })

  }

  pageChanged(event: PageEvent) {
    this.page_length = event.pageSize;
    this.current_page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.getData(this.current_page, this.page_length);
  }

  getPaidAmount(orderpayments){
    let paidAmount= 0;
    orderpayments.forEach(payment => {
      paidAmount += +(payment.paid_amount)
    });
    return paidAmount;
  }

  getBalanceAmount(order){
    let balanceAmount = 0;
    let paidAmount = 0;
    const totalAmont = order.amount;
    order.orderpayments.forEach(payment => {
      paidAmount += +(payment.paid_amount)
    });
    balanceAmount = totalAmont - paidAmount;
    return balanceAmount;
  }


getOrderDetails(orderId: string) {
  this.productService.getOrders(orderId).subscribe((response: any) => {
    // Assuming the API response contains 'balanceAmount' and 'orderStatus' properties
    const order = response.data; // Assuming 'data' contains the order details
    const orderStatus = this.getOrderStatusValue(order);
    console.log('Order Status:', orderStatus);
  });
}

getOrderStatusValue(order: any): string {
  const balanceAmount = this.getBalanceAmount(order);

  if (order) {

    const orderStatus = order.order_status;

    console.log(`id:: ${order.id}----status:: ${order.order_status}`)
    console.log(orderStatus)
    if (orderStatus == 0) {
      return 'Order Placed';
    } else if (orderStatus == 1) {
      return 'Order completed';
    } else if (orderStatus == 2) {
      return 'Order Canceled';
    }
  }
  return 'Unknown Status';
}
}