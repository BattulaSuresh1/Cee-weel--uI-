import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS, PAGE_LENGTH, ITEMS_PER_PAGE, CURRENT_PAGE } from '../../../shared/constants/pagination.contacts';
import { MatTableDataSource } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from '../../../auth/services/loader.service';
import { CommonService } from '../../../services/common.service';
import { ProductService } from '../../../services/product.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent implements OnInit {

  public SERVER_PATH = environment.REST_API_URL;
 
  @ViewChild('paginator', {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['id','amount','paidAmount','balance','status','actions'];//,'model','color','size','frame_type','collection_type','material','prescription_type','glass_color','frame_width','catalog_no'
 
  public PAGE_SIZE_OPTIONS_DATA:number[] = PAGE_SIZE_OPTIONS;

  public page_length:number = PAGE_LENGTH;

  public items_per_page:number = ITEMS_PER_PAGE;

  public current_page:number = CURRENT_PAGE;

  dataSource = new MatTableDataSource<any[]>();


  public customerId:string|number = this.authenticationService.getCustomerId();
  public userDetails = this.authenticationService.getUserDetails();
  public filter: FormControl = new FormControl("", Validators.required)


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
  
  ngOnInit(): void {
    this.getData(this.current_page, this.page_length);
    this.filter.valueChanges.subscribe((f) => {
      this.getData(this.current_page, this.page_length);
    });
    this.filter.valueChanges.pipe(
      debounceTime(300), // Adjust the debounce time as needed (in milliseconds)
      distinctUntilChanged()
    ).subscribe((filterValue) => {
      // Check if the filter value is empty, reset the data
      if (!filterValue || filterValue.trim() === '') {
        this.dataSource = new MatTableDataSource<any>([]);
        return;
      }
    
      this.getData(this.current_page, this.page_length);
    });
  }

  // ngOnInit(): void {
  //   this.getData(this.current_page, this.page_length);
  //   this.filter.valueChanges.pipe(
  //     debounceTime(300),
  //     distinctUntilChanged()
  //   ).subscribe((filterValue) => {
  //     this.getData(this.current_page, this.page_length, filterValue);
  //   });
  // }

  ngAfterViewInit(){
    // this.dataSource.paginator = this.paginator;
  }


  getData(currentPage, perPage):void{
    const customerId = (this.customerId != null)? this.customerId.toString() : '';
    // console.log('customer id ' , customerId);
    const userId = (this.userDetails != null)? this.userDetails.user_id.toString() : '';
    let params = new HttpParams();
    params = params.set('current_page', currentPage);
    params = params.set('per_page', perPage);
    params = params.set('customerId', customerId);
    // params = params.set('userId', userId);
   if( customerId !== ''){
    
    console.log('customer ID',customerId)
      this.productService.getOrders(params)
      .subscribe((response: any) =>{
        console.log(response.data);
        this.dataSource = new MatTableDataSource<any>(response.data);
        this.dataSource.paginator = this.paginator;
        this.page_length = response.total;
      })
   }
   
  }

  // getData(currentPage, perPage, searchValue?): void {
  //   const customerId = this.customerId ? this.customerId.toString() : '';
  //   const userId = this.userDetails ? this.userDetails.user_id.toString() : '';
    
  //   let params = new HttpParams();
  //   params = params.set('current_page', currentPage);
  //   params = params.set('per_page', perPage);
  //   params = params.set('customerId', customerId);

  //   if (searchValue) {
  //     // Set additional search parameters as needed
  //     // For example:
  //     params = params.set('searchField', searchValue);
  //   }

  //   if (customerId !== '') {
  //     this.productService.getOrders(params)
  //       .subscribe((response: any) => {
  //         this.dataSource = new MatTableDataSource<any>(response.data);
  //         this.dataSource.paginator = this.paginator;
  //         this.page_length = response.total;
  //       });
  //   }
  // }

  pageChanged(event: PageEvent) {
    this.page_length = event.pageSize;
    this.current_page = event.pageIndex + 1;
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



}
