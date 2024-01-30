import { Component, OnInit, AfterViewInit, AfterContentInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { CustomerService } from '../../../services/customer.service';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrescriptionCreateComponent } from '../../prescriptions/prescription-create/prescription-create.component';
import { environment } from '../../../../environments/environment';

const dialogConfig= new MatDialogConfig();
dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, AfterViewInit,OnDestroy{



  public SERVER_PATH = environment.REST_API_URL;
  public customerId:string|number = this.authenticationService.getCustomerId();;

  public visits:any = [];
  public prescriptionsOphthalmicLens:any = [];
  public prescriptionsContactLens:any = [];

  public status: boolean = true;

  constructor(private authenticationService:AuthenticationService,
    private customerService:CustomerService,
    private dialog:MatDialog,
   ) { }

  ngOnInit(): void {
    console.log(`customer ID :: `,this.customerId);
  }

  ngAfterViewInit(){
    // if(this.customerId == undefined || this.customerId == null){
      this.authenticationService.getCustomerSubject().subscribe(
        (input) => {
          this.status = false;
          this.customerId = input;
          this.getCustomerOverviews();
        }
      );
    // }else{
      if(this.status){
        this.customerId =  this.authenticationService.getCustomerId();
        this.getCustomerOverviews();
      }
     
    // }
  }
  

  getCustomerOverviews():void{
    let params = { customerId:  this.customerId };
    this.customerService.getCustomerOverview(params).subscribe(
      (res) => {
        console.log(res);
          this.visits = res.data.lastFiveVisits;
          this.prescriptionsOphthalmicLens = res.data.prescriptionsOphthalmicLens;
          this.prescriptionsContactLens = res.data.prescriptionsContactLens;
      }
    )
  }

  createPrescription(prescription = ''):void{
    dialogConfig.width ="65%";
    dialogConfig.data = {
      id: undefined,
      prescription: prescription,
    }

    this.dialog.open(PrescriptionCreateComponent,dialogConfig);
  

    // UPDATE CONTACT DETAILS AFTER CREATING THE CONTACT
    this.dialog.afterAllClosed.subscribe(e=>{
      this.getCustomerOverviews();
    });
  }

  ngOnDestroy(){
    // this.authenticationService.removeCutomerSubject();
  }

}
