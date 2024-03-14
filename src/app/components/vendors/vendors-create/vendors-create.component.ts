import { Component, OnInit, ViewChild, Inject ,  ElementRef, HostListener, NgModule  } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators,  FormControl } from '@angular/forms';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CURRENT_PAGE, GET_ALL } from '../../../shared/constants/pagination.contacts';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { RolesService } from '../../../services/roles.service';
import { Role } from '../../../shared/models/Role';
import { Router } from '@angular/router';
import { VendorService } from 'src/app/services/vendor.service';

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
 public vendorForm:FormGroup;

  selectedCountry: number; // Property to store the selected country ID
  // selectedCountry = new FormControl('');
  selectedState = new FormControl('');
  public roles:Role[];
  public countries:any[] =[];
  public states:any[] = [];
  public cities:any[] = [];

 public page_length:number = GET_ALL;
 public current_page:number = CURRENT_PAGE;

 public vendorId:number = undefined;
 public buttonText:string = "Create";
 public uploadType:string ="vendor";

  constructor(private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService,
    private fb:FormBuilder,
    private rolesService:RolesService,
    private router: Router,
    private vendorService:VendorService,
    private el: ElementRef ){
     this.vendorId = data.id;
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
    this.createvendorForm();  //this method is used to intialize the form of vendor data
    this.getVendorData();     // this method is used fetch the data of vendors from the API
      
     this.vendorForm.get('country').valueChanges.subscribe(
      val  => {
        // debugger;
        console.log('country changed..', val);
        this.onCountryChange(val);
      }
    )
    this.vendorForm.get('state').valueChanges.subscribe(
      val =>{
        console.log('state changed..', val);
        this.onStateChange(val);
      }
    )
  }

  getVendorData():void{
    if(this.vendorId === undefined ){
      this.vendorService.createVendor().subscribe(
        (res:any)=>{
         
            this.countries = res.data.countries;
            this.states = res.data.states;
            this.cities = res.data.cities; 
          console.log(res);
        }
      )
     
    }else{
      this.buttonText = "Update";
      this.vendorService.showVendor(this.vendorId).subscribe(
        (res:any)=>{
            this.countries = res.data.countries;
            this.states = res.data.states;
            this.cities = res.data.cities;
            let vendor = res.data.vendor;
            console.log(res);

            this.vendorForm.patchValue({
              name: vendor.name,
              email: vendor.email,
              phone: vendor.phone,
              code: vendor.code,
              profession: vendor.profession,
              alternate_phone: vendor.alternate_phone,
              date_of_birth: vendor.date_of_birth,
              age: vendor.age,
              doa: vendor.doa,
              life_style: vendor.life_style,
              address: vendor.address,
              nearby: vendor.nearby,
              city: +vendor.city,
              state: +vendor.state,
              country: +vendor.country_id,
              images: vendor.images,  
            });

            this.vendorForm.updateValueAndValidity();

            console.log(this.vendorForm.value);
        }
      )
    }
  }

  createvendorForm(){
    this.vendorForm = this.fb.group({
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
    this.vendorForm.get('date_of_birth').valueChanges.subscribe((dateOfBirth) => {
      if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear()- birthDate.getFullYear();
        this.vendorForm.get('age').setValue(age);
      }
    });

  }

  
  
  onCountryChange(countryId: number): void{

  
    this.vendorService.getStatesCountry(countryId).subscribe(data => {
       this.states = data.states;
    });
  }

  
  onStateChange(stateId: number): void {
    this.vendorService.getStatesCities(stateId).subscribe(data => {
      this.cities = data.cities;     
    });
  }
  get formValidate(){
    return this.vendorForm.controls;
  }

  addAttachment(fileName:any){
    this.vendorForm.patchValue({images: fileName})
  }

  vendorFormSubmit(){
    const countryId = this.selectedCountry;
    
        // Other form data
        const formData = this.vendorForm.value;

        // Add the countryId to the form data
        formData.country_id = countryId;

    if(this.vendorForm.invalid){
      return;
    }

    if(this.vendorId == undefined){
      this.vendorService.storeVendors(this.vendorForm.value).subscribe(
        (response)=>{
            this.vendorForm.reset();
            this.myForm.resetForm();
            this.commonService.openAlert(response.message);
            this.createvendorForm();
            // this.router.navigate(['/order-products']);
        },
        (err)=>{

            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.vendorForm.get(prop);
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
      this.vendorService.updateVendor(this.vendorId,this.vendorForm.value).subscribe(
        (response)=>{
            this.commonService.openAlert(response.message);
            this.cancel();
        },
        (err)=>{
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.vendorForm.get(prop);
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
