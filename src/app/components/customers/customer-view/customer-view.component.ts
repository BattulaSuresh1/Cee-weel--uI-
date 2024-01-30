import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { OverviewComponent } from '../overview/overview.component';
import { ITEMS_PER_PAGE, CURRENT_PAGE } from '../../../shared/constants/pagination.contacts';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild('myForm', {static: false}) myForm: NgForm;
  public SERVER_PATH = environment.REST_API_URL;
  public customerId:number;
  public visitId:number;
  public userId:number;
  public customer:any;
  public buttonText:string = "Add";
  public customerForm:FormGroup;
  public countries:any[];

  public items_per_page:number = ITEMS_PER_PAGE;

  public current_page:number = CURRENT_PAGE;

  constructor(private customerService:CustomerService,
    private commonService:CommonService,
    private activatedroute:ActivatedRoute,
    private authenticationService:AuthenticationService,
    private fb:FormBuilder) { }

  ngOnInit(): void {
   // this.visitId = + this.activatedroute.snapshot.paramMap.get("visitId");

   this.userId = + this.activatedroute.snapshot.paramMap.get("visitId");
   console.log('urlUserid',  this.userId );
   this.authenticationService.setCustomerId(this.userId);
   this.createCustomerForm();
  }
  
  ngAfterViewInit(){
    this.getDetails();
  }

  getDetails():void{

    // let urlUserId = + this.activatedroute.snapshot.paramMap.get("userId");
    this.customerService.showCustomer(this.userId).subscribe(
      (res:any)=>{
        console.log(res);

          this.countries = res.data.countries;
          // let customer = res.data.customer;
          // this.customer = (customer != undefined) ? customer :{}
          this.customerId = res.data.customer.id;
          // this.buttonText = (customer != undefined) ? "Update" : "Add";
          this.customerForm.patchValue(res.data.customer);
          // this.authenticationService.setCustomerId(this.customerId);
      }
    )
   
  }

  createCustomerForm(){
    this.customerForm = this.fb.group({
      name: ['',[Validators.required]],
      // last_name: ['',[Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      phone: ['',[Validators.required]],
      code:  ['',[Validators.required]],
      profession:  ['',[Validators.required]],
      alternate_phone:  ['',[Validators.required]],
      date_of_birth:  ['',[Validators.required]],
      age:  ['',[Validators.required]],
      doa:  ['',[Validators.required]],
      life_style:  ['',[Validators.required]],
      address:  ['',[Validators.required]],
      nearby:  ['',[Validators.required]],
      city:  ['',[Validators.required]],
      state:  ['',[Validators.required]],
      country_id:  ['',[Validators.required]],
      visit_id: [this.visitId],
      images: ['']
    });
  }

  get formValidate(){
    return this.customerForm.controls;
  }

  customerFormSubmit(){

    if(this.customerForm.invalid){
      return;
    }

    if(this.customerId == undefined  || isNaN(this.customerId)){
      this.customerService.storeCustomer(this.customerForm.value).subscribe(
        (response)=>{
            this.customerForm.reset();
            this.myForm.resetForm();
            this.commonService.openAlert(response.message); 
            this.createCustomerForm();
            this.buttonText = "Update";
            this.customerId = response.data.id;
            this.authenticationService.setCustomerId(this.customerId);
            this.customerForm.patchValue(response.data);
        },
        (err)=>{ 

            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.customerForm.get(prop);
                  if(formControl){
                    formControl.setErrors({
                      serverError: validatonErrors[prop]
                    });
                  }
                });
              }
            }
        }
      )

    }else{
      this.customerService.updateCustomer(this.customerId,this.customerForm.value).subscribe(
        (response)=>{
            this.commonService.openAlert(response.message); 
        },
        (err)=>{ 
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.customerForm.get(prop);
                  if(formControl){
                    formControl.setErrors({
                      serverError: validatonErrors[prop]
                    });
                  }
                });
              }
            }
        }
      )
    }
  }

  ngOnDestroy(){
    // this.authenticationService.removeCustomerId();
  }

}
