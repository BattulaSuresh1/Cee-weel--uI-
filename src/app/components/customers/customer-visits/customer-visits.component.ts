import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS, PAGE_LENGTH, ITEMS_PER_PAGE, CURRENT_PAGE } from '../../../shared/constants/pagination.contacts';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../auth/models/users';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from '../../../auth/services/loader.service';
import { CommonService } from '../../../services/common.service';
import { HttpParams } from '@angular/common/http';
import { CustomerService } from '../../../services/customer.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { environment } from '../../../../environments/environment';

const dialogConfig= new MatDialogConfig();
dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;

@Component({
  selector: 'app-customer-visits',
  templateUrl: './customer-visits.component.html',
  styleUrls: ['./customer-visits.component.css']
})
export class CustomerVisitsComponent implements OnInit {

  public SERVER_PATH = environment.REST_API_URL;
 
  @ViewChild('paginator', {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['image','visit_date','time_entry','time_exit','entry_emotion','exit_emotion','brand_purchased','order_value'];//,'model','color','size','frame_type','collection_type','material','prescription_type','glass_color','frame_width','catalog_no'
 
  public PAGE_SIZE_OPTIONS_DATA:number[] = PAGE_SIZE_OPTIONS;

  public page_length:number = PAGE_LENGTH;

  public items_per_page:number = ITEMS_PER_PAGE;

  public current_page:number = CURRENT_PAGE;

  public customerId:string|number = this.authenticationService.getCustomerId();


  roles: User[];
  dataSource = new MatTableDataSource<User>();
  
  constructor(
    private dialog:MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private loaderService:LoaderService,
    private commonService:CommonService,
    private customerService:CustomerService,
    private authenticationService:AuthenticationService
  ) { 
    matIconRegistry.addSvgIcon(
      "filter",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/SVG/filter.svg")
      );
      
  }
  
  ngOnInit(): void {
    this.getData(this.current_page, this.page_length);
  }

  ngAfterViewInit(){
    // this.dataSource.paginator = this.paginator;
  }

  createCustomer():void{
    dialogConfig.width ="60%";
    dialogConfig.data = {
      id: undefined,
    }
    // this.dialog.open(ProductCreateComponent,dialogConfig);
  

    // UPDATE CONTACT DETAILS AFTER CREATING THE CONTACT
    this.dialog.afterAllClosed.subscribe(e=>{
      this.getData(this.current_page, this.page_length);
    });
  }

  edit(id:number):void{
    dialogConfig.width ="60%";
    dialogConfig.data = {
      id: id,
    }
   
    // this.dialog.open(ProductCreateComponent,dialogConfig);

    // UPDATE CONTACT DETAILS AFTER CREATING THE CONTACT
    this.dialog.afterAllClosed.subscribe(e=>{
      this.getData(this.current_page, this.page_length);
    });
  }

  delete(id:number):void{

    dialogConfig.width ="20%";
    dialogConfig.height ="30%";
    dialogConfig.data = {
      title: "Confirm Action",
      message : "Are you sure you want to delete the Customer?",
      id: id,
   };
    
    // const dialogRef = this.dialog.open(ConfirmDialogComponent,dialogConfig);

    // dialogRef.afterClosed().subscribe(
    //   (res) => {
    //       if(res.status){
    //         this.deleteCustomer(res.id);
    //       }
    //   }
    // );

  }

  // deleteCustomer(id:string){
  //   let params = new HttpParams();
  //   params = params.set('id', id);
  //   this.productService.deleteProduct(params).subscribe(
  //     (res)=>{
  //         this.commonService.openAlert(res.message);
  //         this.getData(this.current_page, this.page_length);
  //     }
  //   )
  // }

  getData(currentPage, perPage):void{
    let params = new HttpParams();
    params = params.set('current_page', currentPage);
    params = params.set('per_page', perPage);
    params = params.set('customerId', this.customerId.toString());

    this.customerService.getVisits(params)
    .subscribe((response: any) =>{

      this.roles = response.data;
      this.roles.length = response.total;

      this.dataSource = new MatTableDataSource<User>(this.roles);
      this.dataSource.paginator = this.paginator;

    })
  }

  getNextData(currentSize, currentPage, perPage):void{
    let params = new HttpParams();
    params = params.set('current_page', currentPage);
    params = params.set('per_page', perPage);
    params = params.set('customerId', this.customerId.toString());

    this.customerService.getVisits(params).subscribe(
      (response: any) =>{
console.log(response);
        this.roles.length = currentSize;
        this.roles.push(...response.data);

        this.roles.length = response.total;

        this.dataSource = new MatTableDataSource<User>(this.roles);
        this.dataSource._updateChangeSubscription();

        this.dataSource.paginator = this.paginator;
    })
  }

  pageChanged(event):void{

    let pageIndex = event.pageIndex + 1;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;

    let previousSize = pageSize * pageIndex;

    this.getNextData(previousSize, (pageIndex).toString(), pageSize.toString());
  }


}
