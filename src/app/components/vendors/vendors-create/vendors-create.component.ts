import { Component, OnInit, ViewChild, Inject ,  ElementRef, HostListener, NgModule  } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, MinLengthValidator, FormControl } from '@angular/forms';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CURRENT_PAGE, GET_ALL } from '../../../shared/constants/pagination.contacts';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { RolesService } from '../../../services/roles.service';
import { Role } from '../../../shared/models/Role';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export interface state{
    name: string;
}


@Component({
  selector: 'app-vendors-create',
  templateUrl: './vendors-create.component.html',
  styleUrls: ['./vendors-create.component.css']
})
export class VendorsCreateComponent implements OnInit {

  /** USING THIS TO RESET FORM  WITH OUT SHOWING FORMVALIDAITON ERRORS**/
  @ViewChild('myForm', {static: false}) myForm: NgForm;
 public customerForm:FormGroup;

  selectedCountry: number; // Property to store the selected country ID
  // selectedCountry = new FormControl('');
  selectedState = new FormControl('');
  public roles:Role[];
  public countries:any[] =[];
  public states:any[] = [];
  public cities:any[] = [];

 public page_length:number = GET_ALL;
 public current_page:number = CURRENT_PAGE;

 public customerId:number = undefined;
 public buttonText:string = "Create";
 public uploadType:string ="customer";

  constructor(private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService,
    private fb:FormBuilder,
    private rolesService:RolesService,
    private router: Router,
    private customerService:CustomerService,
    private el: ElementRef ){
     this.customerId = data.id;
    }

    onDatepickerInput(event: any) {
      const input = event.target as HTMLInputElement;
      let trimmed = input.value.replace(/\s+/g, ''); // Remove whitespace
    
      if (trimmed.length > 2 && trimmed.indexOf('/') === -1) {
        trimmed = trimmed.replace(/^(\d{2})(\d{2})/, '$1/$2/');
      }
    
        
      // Setting the value with time to match the format of the date picker
      const currentDate = new Date(); // Get current date and time
      const [day, month, year] = trimmed.split('/').map(Number); // Extract day, month, year
    
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        currentDate.setDate(day);
        currentDate.setMonth(month - 1); // Month starts from 0
        currentDate.setFullYear(year);
    
        // Formatting the date to match the format of the date picker's selected value
        const formattedDate  = `${day}-${month}-${year}`; // "2001-12-06T18:30:00.000Z"
        console.log(formattedDate); 
        
      }
    
      input.value = trimmed;
    }

    
  ngOnInit(): void {
    this.createcustomerForm();  //this method is used to intialize the form of customer data
    this.getCustomerData();     // this method is used fetch the data of customers from the API
      
     this.customerForm.get('country').valueChanges.subscribe(
      val  => {
        // debugger;
        console.log('country changed..', val);
        this.onCountryChange(val);
      }
    )
    this.customerForm.get('state').valueChanges.subscribe(
      val =>{
        console.log('state changed..', val);
        this.onStateChange(val);
      }
    )
  }

  getCustomerData():void{
    if(this.customerId === undefined ){
      this.customerService.createCustomer().subscribe(
        (res:any)=>{
         
            this.countries = res.data.countries;
            this.states = res.data.states;
            this.cities = res.data.cities; 
          console.log(res);
        }
      )
     
    }else{
      this.buttonText = "Update";
      this.customerService.showCustomer(this.customerId).subscribe(
        (res:any)=>{
            this.countries = res.data.countries;
            this.states = res.data.states;
            this.cities = res.data.cities;
            let customer = res.data.customer;
            console.log(res);

            this.customerForm.patchValue({
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              code: customer.code,
              profession: customer.profession,
              alternate_phone: customer.alternate_phone,
              date_of_birth: customer.date_of_birth,
              age: customer.age,
              doa: customer.doa,
              life_style: customer.life_style,
              address: customer.address,
              nearby: customer.nearby,
              city: +customer.city,
              state: +customer.state,
              country: +customer.country_id,
              images: customer.images,  
            });

            this.customerForm.updateValueAndValidity();

            console.log(this.customerForm.value);
        }
      )
    }
  }

  createcustomerForm(){
    this.customerForm = this.fb.group({
      name: ['',[Validators.required]],
      // email: ['', [Validators.required,Validators.email]],
      email: [''],
      phone: ['',[Validators.required , Validators.pattern(/^\d{10}$/)]],
      code:  [''],
      profession:  ['',],
      alternate_phone:  ['',[Validators.pattern(/^\d{10}$/)]],
      date_of_birth:  ['',],
      age:  ['',],
      // doa:['',[Validators.required]],
      doa: [''],
      life_style:  [''],
      address:  [''],
      nearby:  [''],
      city:  ['',[Validators.required]],
      state:  ['',[Validators.required]],
      country:  ['',[Validators.required]],
      images: [''],
     
    });
    this.customerForm.get('date_of_birth').valueChanges.subscribe((dateOfBirth) => {
      if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear()- birthDate.getFullYear();
        this.customerForm.get('age').setValue(age);
      }
    });

  }

  
  
  onCountryChange(countryId: number): void{

  
    this.customerService.getStatesCountry(countryId).subscribe(data => {
       this.states = data.states;
    });
  }

  
  onStateChange(stateId: number): void {
    this.customerService.getStatesCities(stateId).subscribe(data => {
      this.cities = data.cities;     
    });
  }
  get formValidate(){
    return this.customerForm.controls;
  }

  addAttachment(fileName:any){
    this.customerForm.patchValue({images: fileName})
  }

  customerFormSubmit(){
    const countryId = this.selectedCountry;
    
        // Other form data
        const formData = this.customerForm.value;

        // Add the countryId to the form data
        formData.country_id = countryId;

    if(this.customerForm.invalid){
      return;
    }

    if(this.customerId == undefined){
      this.customerService.storeCustomer(this.customerForm.value).subscribe(
        (response)=>{
            this.customerForm.reset();
            this.myForm.resetForm();
            this.commonService.openAlert(response.message);
            this.createcustomerForm();
            // this.router.navigate(['/order-products']);
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
            this.cancel();
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
  cancel():void{
    this.dialog.closeAll();
  }
}
