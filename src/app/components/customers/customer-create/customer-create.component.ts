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
import { debounceTime } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';


export interface state{
    name: string;
}

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})

export class CustomerCreateComponent implements OnInit {

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

    
    // onDatepickerInput(event: any) {
    //   const input = event.target as HTMLInputElement;
    //   let trimmed = input.value.replace(/\s+/g, ''); // Remove whitespace
    
    //   if (trimmed.length > 2 && trimmed.indexOf('/') === -1) {
    //     trimmed = trimmed.replace(/^(\d{2})(\d{2})/, '$1/$2/');
    //   }
    
        
    //   // Setting the value with time to match the format of the date picker
    //   const currentDate = new Date(); // Get current date and time
    //   const [day, month, year] = trimmed.split('/').map(Number); // Extract day, month, year
    
    //   if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
    //     currentDate.setDate(day);
    //     currentDate.setMonth(month - 1); // Month starts from 0
    //     currentDate.setFullYear(year);
    
    //     // Formatting the date to match the format of the date picker's selected value
    //     const formattedDate  = `${day}-${month}-${year}`; // "2001-12-06T18:30:00.000Z"
    //     console.log(formattedDate); 
    //     // Store the formattedDate variable where you're storing the date_of_birth value
    //   }
    
    //   input.value = trimmed;
    // }

    onDatepickerInput(event: any) {
      const input = event.target as HTMLInputElement;
      let trimmed = input.value.replace(/\s+/g, ''); // Remove whitespace
    
      if (trimmed.length > 2 && trimmed.indexOf('/') === -1) {
        trimmed = trimmed.replace(/^(\d{2})(\d{2})/, '$1/$2/');
      }
    
      // Setting the value with time to match the format of the date picker
      const currentDate = new Date(); // Get current date and time
      const [month, day, year] = trimmed.split('/').map(Number); // Extract month, day, year
    
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        currentDate.setDate(day);
        currentDate.setMonth(month - 1); // Month starts from 0
        currentDate.setFullYear(year);
    
        // Formatting the date to match the format of the date picker's selected value
        const formattedDate = `${day}-${month}-${year}`; // "06-12-2001"
        console.log(formattedDate);
        // Store the formattedDate variable where you're storing the date_of_birth value
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
      this.customerService.createCustomer().pipe(debounceTime(0)).subscribe(
        (res:any)=>{
         
            this.countries = res.data.countries;
            this.states = res.data.states;
            this.cities = res.data.cities; 

           // Patch the form values after a short delay
        this.customerForm.patchValue({
          code: res.data.customer.code,
          // ... other form values
        });

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
              // billing_street: customer.customerbranch.billing_street,
              // billing_city: customer.customerbranch.billing_city,
              // billing_state: customer.customerbranch.billing_state,
              // billing_country_id: customer.customerbranch.billing_country_id,
              // billing_zip_code: customer.customerbranch.billing_zip_code,
              // shipping_street: customer.customerbranch.shipping_street,
              // shipping_city: customer.customerbranch.shipping_city,
              // shipping_state: customer.customerbranch.shipping_state,
              // shipping_country_id: customer.customerbranch.shipping_country_id,
              // shipping_zip_code: customer.customerbranch.shipping_zip_code,
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
      profession:  ['',[Validators.required]],
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
      // billing_street: ['',[Validators.required]],
      // billing_city: ['',[Validators.required]],
      // billing_state: ['',[Validators.required]],
      // billing_country_id: ['',[Validators.required]],
      // billing_zip_code: ['',[Validators.required]],
      // shipping_street: ['',[Validators.required]],
      // shipping_city: ['',[Validators.required]],
      // shipping_state: ['',[Validators.required]],
      // shipping_country_id: ['',[Validators.required]],
      // shipping_zip_code: ['',[Validators.required]],
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

  // CountryChange(country_id:number){
  //   this.customerService.getStatesCountry(country_id).subscribe(data => {
  //     this.countries = data.countries;
  //  }); 
  // }
  
  onCountryChange(countryId: number): void{

    
    this.customerService.getStatesCountry(countryId).subscribe(data => {
       this.states = data.states;
    });
  }

  // countrySearch(value) {
  //   const filter = value.toLowerCase();
  //   this.countries = this.search(this.countries, filter);
  // }
  
  // search(array: any[], filter: string) {
  //   if (filter.trim() === '') {
  //     return array; // Return the entire array when the filter is empty
  //   } else {
  //     return array.filter(option =>
  //       option.name.toLowerCase().startsWith(filter)
  //     );
  //   }
  // }

  // stateSearch(value) {
  //   const filter = value.toLowerCase();
  //   this.states = this.search(this.states, filter);
  // }

  // citiesSearch(value) {
  //   const filter = value.toLowerCase();
  //   this.cities = this.search(this.cities , filter)
  // }

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
