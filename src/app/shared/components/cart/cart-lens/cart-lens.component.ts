import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectorRef, Inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrescriptionService } from '../../../../services/prescription.service';
import { ProductService } from '../../../../services/product.service';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../../../services/common.service';
import { AuthenticationService } from '../../../../auth/services/authentication.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { startWith, debounceTime, switchMap, map } from 'rxjs/operators';



const dialogConfig= new MatDialogConfig();
dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;

@Component({
  selector: 'app-cart-lens',
  templateUrl: './cart-lens.component.html',
  styleUrls: ['./cart-lens.component.css']
})
export class CartLensComponent implements OnInit {

 
  public SERVER_PATH = environment.REST_API_URL;
  @Input() cart:any;
  @Input() prescriptions:any;
  @Input() lensData: any;
  @Output() newEvent = new EventEmitter();

  public prescription:any;
  public prescriptionForm:FormGroup;
  public customerId:string = this.authenticationService.getCustomerId();

  public selected:number = 0;
  public lensForm:FormGroup;
  public measurementsForm:FormGroup;
  

  lensMasters: any[] = [];
  searchTerm: any ;
  
  selectedEye: string;
  itemCode: string;

  eye_selections: any[] = [];
  brands: any[] = [];
  types: any[] = [];
  indexs: any[] = [];
  dias: any[] = [];
  froms: any[] = [];
  tos: any[] = [];
  rps: any[] = [];
  max_cyls: any[] = [];
  codes: any[] = [];
  names: any[] = [];
  mrps: any[] = [];
  cost_prices: any[] = [];

  selectedLensMasterData: any; // Variable to store selected lens master data

  public diameters:string[] = [];
  public base_curves:string[] = [];
  public vertex_distances:string[] = [];
  public pantascopic_angles:string[] = [];
  public frame_wrap_angles:string[] = [];
  public reading_distances:string[] = [];
  public shapes:string[] = [];

  public productDiscount:number = 0;
  public productTotal:number = 0;
  public productQuantity:number = 0;
  public productPrice:number = 0;
  offerPrice:any

  searchResults: any[];

  
  public prescriptionList:any = [];

  searchTermctr = new FormControl('');
  
  cartId: number;
  // customerID: number;
  customer_id: string = this.authenticationService.getCustomerId();
  constructor(private fb:FormBuilder,
    private dialog:MatDialog,
    private commonService: CommonService,
    private prescriptionService: PrescriptionService,
    private productService:ProductService,
    private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private dialogRef: MatDialogRef<CartLensComponent>
    ) {
      this.cartId = data?.cartId  ,
    // this.customerID = data?.customerId
    this.customer_id = data?.customerId ;
  }


    ngOnInit(): void {
      this.createForm();
      this.createLensForm();
      this.createMeasurementsForm();
      this.getDetails();
      this.setupProductDetails();
      this.getCart(); 
      this.prescriptionForm.get('prescriptionId').valueChanges.subscribe(id => {
        this.prescription = this.prescriptions.find(p => p.id === id);
      });
    
      this.lensForm.get("eye_selection").valueChanges.subscribe(data => {
        console.log(data.value);
        if(data == '1'){
          this.updateDataRightEye();
        } else if(data == '2'){
          this.updateDataLeftEye();
        } else if(data == '3'){
          this.updateDataBothEyes();
        }
      });
    
      console.log(this.cartId , this.customer_id , 'cart ....')
      // Check if cartId is available in data, otherwise set it to a default value
      this.cartId = this.data?.cartId || null;
     
      this.customer_id =this.data?.customerId;
      this.setupSearchAutocomplete();
    }
    
    // setupSearchAutocomplete(): void {
    //   this.searchTermctr.valueChanges.pipe(
    //     startWith(''),
    //     debounceTime(300),
    //     switchMap(term => {
    //       if (!term || term.length < 5) {
    //         // Don't make a request if the search term is too short
    //         return [];
    //       }
    //       return this.productService.searchLensMasters(term).pipe(
    //         map(response => response.data)
    //       );
    //     })
    //   ).subscribe(results => {
    //     this.searchResults = results;
    //     this.cdr.detectChanges(); // Detect changes to update the view
    //   });
    // }

    setupSearchAutocomplete(): void {
      this.searchTermctr.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        switchMap(term => {
          if (!term || term.length < 5) {
            // Don't make a request if the search term is too short
            return [];
          }
          return this.productService.searchLensMasters(term).pipe(
           
            map(response => response.data.filter(item =>
              
              item.code.toLowerCase().includes(term.toLowerCase()) || // Check if code includes the term
              item.name.toLowerCase().includes(term.toLowerCase()) ,// Check if name includes the term
              console.log(term ,'term'),
            ))
          );
        })
      ).subscribe(results => {
        this.searchResults = results;
        this.cdr.detectChanges(); // Detect changes to update the view
      });
    }
    
  
    displayFn(lensMaster: any): string {
      return lensMaster ? `${lensMaster.code}` : '';
    }
    
   
    
    searchLensMasters(): void {
    const searchTerm = this.searchTermctr.value;
    if (!searchTerm) {
      console.error('Search term is empty.');
      return;
    }
  
    this.productService.searchLensMasters(searchTerm).subscribe(
      (response) => {
        if (response.success) {
          this.searchResults = response.data;
          this.selectedLensMasterData = response.data;
          
          // Assuming you want to patch the value of a form control
          // Replace 'formControlName' with the actual name of your form control
          this.lensForm.get('formControlName').patchValue(response.data);
        } else {
          console.error('No matching records found.');
        }
      },
      (error) => {
        console.error('Error searching for lens masters:', error);
      }
    );
  }

    
    

    updateDataRightEye(): void {
     
      console.log('lensdata', this.searchResults);
      if (!this.searchResults || this.searchResults.length == 0) {
        console.error('No matching lens master found or array is empty.');
        return;
      }
      const lensData = this.searchResults[0];
      this.lensForm.get("right_eye").patchValue({
        brand:lensData.brand,
        type:lensData.type,
        index:lensData.index,
        dia:lensData.dia,
        from:lensData.from,
        to:lensData.to,
        rp:lensData.rp,
        max_cyl:lensData.max_cyl,
        code:lensData.code,
        name:lensData.name,
        mrp:lensData.mrp,
        cost_price:lensData.cost_price,
      },{onlySelf: true, emitEvent:true});

      this.lensForm.get("right_eye").updateValueAndValidity();
      // this.cdr.detectChanges();
      console.log('updated Lens:: ',this.lensForm.value)
    }
    
    updateDataLeftEye(): void {
     
      console.log('lensdata', this.searchResults);
      if (!this.searchResults || this.searchResults.length == 0) {
        console.error('No matching lens master found or array is empty.');
        return;
      }
      const lensData = this.searchResults[0];
      // Patch form controls with data from selectedLensMaster
      // console.log('updated Lens:: ',this.lensForm.value)
      this.lensForm.get("left_eye").patchValue({
        brand:lensData.brand,
        type:lensData.type,
        index:lensData.index,
        dia:lensData.dia,
        from:lensData.from,
        to:lensData.to,
        rp:lensData.rp,
        max_cyl:lensData.max_cyl,
        code:lensData.code,
        name:lensData.name,
        mrp:lensData.mrp,
        cost_price:lensData.cost_price
      },{onlySelf: true, emitEvent:true});

      this.lensForm.get("left_eye").updateValueAndValidity();
      // this.cdr.detectChanges();
      console.log('updated Lens:: ',this.lensForm.value)
    }

    updateDataBothEyes(): void {
     
      console.log('lensdata', this.searchResults);
      if (!this.searchResults || this.searchResults.length == 0) {
        console.error('No matching lens master found or array is empty.');
        return;
      }
      const lensData = this.searchResults[0];
      // Patch form controls with data from selectedLensMaster
      // console.log('updated Lens:: ',this.lensForm.value);
      this.lensForm.get("both_eyes").patchValue({
        brand:lensData.brand,
        type:lensData.type,
        index:lensData.index,
        dia:lensData.dia,
        from:lensData.from,
        to:lensData.to,
        rp:lensData.rp,
        max_cyl:lensData.max_cyl,
        code:lensData.code,
        name:lensData.name,
        mrp:lensData.mrp,
        cost_price:lensData.cost_price

      },{onlySelf: true, emitEvent:true});

      this.lensForm.get("both_eyes").updateValueAndValidity();
      // this.cdr.detectChanges();
      console.log('updated Lens:: ',this.lensForm.value)
    }
    
    getDetails():void{

      this.prescriptionService.getPrescriptions(this.customer_id).subscribe(
        (response: any) => {
          if (response.success) {
            this.prescriptions = response.data;
            console.log(this.prescriptions, '....prescriptions....');
          } else {
            console.error("Failed to fetch prescription details:", response.message);
          }
        },
        (error) => {
          console.error('Error fetching prescription details:', error);
        }
      );
     
      
      
      this.prescriptionService.createPrescription().subscribe(
        (res:any) => {
        
           this.brands = res.data.lens_brands.filter(brand => brand.category.includes(3) || brand.category.includes(4));
           this.eye_selections = res.data.eye_selections;


           this.types =  res.data.type;
           this.indexs = res.data.index;
           this.dias = res.data.dia;
           this.froms = res.data.from;
           this.tos = res.data.to;
           this.rps = res.data.rp;
           this.max_cyls = res.data.max_cyl;
           this.codes = res.data.code
           this.names = res.data.name
           this.mrps = res.data.mrp
           this.cost_prices = res.data.cost_price
       
           this.diameters = res.data.diameters;
           this.base_curves = res.data.base_curves;
           this.vertex_distances = res.data.vertex_distances;
           this.pantascopic_angles = res.data.pantascopic_angles;
           this.frame_wrap_angles = res.data.frame_wrap_angles;
           this.reading_distances = res.data.reading_distances;
           this.shapes = res.data.shapes;
  
           
        },
        (err) => {
          console.log(err);
        }
      )
    }
  
   

    getCart() {
      if (!this.data?.cartId) {
        console.error('Cart is not available.');
        console.log(this.data.cartId , 'cartId')
        return;
      }
    

      this.productService.showCart(this.cartId).subscribe(
        (response: any) => {
            if (response.data && response.data) {
              if(response.data.cartId.prescription != undefined){
                // this.prescription = response.data.prescription;
                this.prescriptionForm.patchValue({
                  prescriptionId: response.data.prescription.id
                });
                console.log(this.data.cartId ,this.prescription, 'this.data.cartId')
            }
           
            if (response.data.cart.lens !== undefined) {
              this.lensForm.patchValue({
                life_style: +response.data.cart.lens.life_style,
                lens_recommended: +response.data.cart.lens.lens_recommended,
                tint_type: response.data.cart.lens.tint_type,
                mirror_coating: +response.data.cart.lens.mirror_coating,
                colour: +response.data.cart.lens.tint_value,
                gradient: +response.data.cart.lens.tint_value,
                brand: +response.data.cart.lens.lens_brands,
                type: +response.data.cart.lens.type,
                index: +response.data.cart.lens.index,
                dia: +response.data.cart.lens.dia,
                from: +response.data.cart.lens.from,
                to: +response.data.cart.lens.to,
                rp: +response.data.cart.lens.rp,
                max_cyl: +response.data.cart.lens.max_cyl,
                code: +response.data.cart.lens.code,
                name: +response.data.cart.lens.name,
                mrp: +response.data.cart.lens.mrp,
                cost_price: +response.data.cart.lens.cost_price,
              });
            }
    
            if (
              response.data.cart.measurements !== undefined &&
              response.data.cart.measurements.precalvalues.length >= 2 &&
              response.data.cart.measurements.thickness.length >= 3
            ) {
              this.measurementsForm.patchValue({
                diameter: +response.data.cart.measurements.diameter,
                base_curve: +response.data.cart.measurements.base_curve,
                vertex_distance: +response.data.cart.measurements.vertex_distance,
                pantascopic_angle: +response.data.cart.measurements.pantascopic_angle,
                frame_wrap_angle: +response.data.cart.measurements.frame_wrap_angle,
                reading_distance: +response.data.cart.measurements.reading_distance,
                shapes: response.data.cart.measurements.shape,
                precal_values: {
                  right_value: {
                    pd: response.data.cart.measurements.precalvalues[0].pd,
                    ph: response.data.cart.measurements.precalvalues[0].ph,
                  },
                  left_value: {
                    pd: response.data.cart.measurements.precalvalues[1].pd,
                    ph: response.data.cart.measurements.precalvalues[1].ph,
                  },
                },
                thickness: {
                  center_thickness: {
                    right: response.data.cart.measurements.thickness[0].right,
                    left: response.data.cart.measurements.thickness[0].left
                  },
                  nose_edge_thickness: {
                    right: response.data.cart.measurements.thickness[1].right,
                    left: response.data.cart.measurements.thickness[1].left
                  },
                  temple_edge_thickness: {
                    right: response.data.cart.measurements.thickness[2].right,
                    left: response.data.cart.measurements.thickness[2].left
                  },
                },
                lens_size: {
                  lens_width: response.data.cart.measurements.lens_width,
                  bridge_distance: response.data.cart.measurements.bridge_distance,
                  lens_height: response.data.cart.measurements.lens_height,
                  temple: response.data.cart.measurements.temple,
                  total_width: response.data.cart.measurements.total_width,
                }
              });
    
            }
          }
        },
        (error) => {
          console.error('Error fetching cart:', error);
        }
      );
    }
    
    createForm(){
      this.prescriptionForm = this.fb.group({
        prescriptionId:["",[Validators.required]]
      })
    }
   
  
    createLensForm(): void {
      this.lensForm = this.fb.group({
        eye_selection: ['', [Validators.required]],
        right_eye: this.createEyeFormGroup(),
        left_eye: this.createEyeFormGroup(),
        both_eyes: this.createEyeFormGroup(),
        // Add other common form controls
      });
    }
  
    createEyeFormGroup(): FormGroup {
      return this.fb.group({
        brand: ["", [Validators.required]],
        type: ["", [Validators.required] ],
        index: ["", [Validators.required]],
        dia: ["", [Validators.required] ],
        from: ["", [Validators.required]],
        to: ["", [Validators.required] ],
        rp: ["", [Validators.required]],
        max_cyl: ["", [Validators.required] ],
        code: ["", [Validators.required]],
        name: ["", [Validators.required] ],
        mrp: ["", [Validators.required]],
        cost_price: ["", [Validators.required]],
      });
    }
  
  
    get lensFormValidate(){ return this.lensForm.controls; }
  
    get precalRightValuesValidate(){ return this.measurementsFormValidate.precal_values.get("right_value")["controls"]; }
    get precalLeftValuesValidate(){ return this.measurementsFormValidate.precal_values.get("left_value")["controls"]; }
  
    get centerThicknessValidate(){ return this.measurementsFormValidate.thickness.get("center_thickness")["controls"]; }
    get noseEdgeThicknessValidate(){ return this.measurementsFormValidate.thickness.get("nose_edge_thickness")["controls"]; }
    get templeEdgeThicknessValidate(){ return this.measurementsFormValidate.thickness.get("temple_edge_thickness")["controls"]; }
  
    get lensSizeValidate(){ return this.measurementsFormValidate.lens_size["controls"]; }
  
    
    onEyeSelectionChange(event: any): void {
      console.log('selectedEye' , event.value)  ;   
       this.selectedEye = event.value; // Assuming the event value contains the selected eye ('right_eye', 'left_eye', or 'both_eyes')
    }
  
    getCurrentEyeForm(): FormGroup {
      switch (this.selectedEye) {
        case '1':
          return this.lensForm.get('right_eye') as FormGroup;
        case '2':
          return this.lensForm.get('left_eye') as FormGroup;
        case '3':
          return this.lensForm.get('both_eyes') as FormGroup;
        default:
          throw new Error('Invalid selected eye value');
      }
    }
  
  
  
    createMeasurementsForm():void{
      this.measurementsForm = this.fb.group({
        diameter: ["",[Validators.required]],
        base_curve: ["",[Validators.required]],
        precal_values: this.fb.group({
          right_value: this.fb.group({
            pd: ["",[Validators.required]],
            ph: ["",[Validators.required]],
          }),
          left_value: this.fb.group({
            pd: ["",[Validators.required]],
            ph: ["",[Validators.required]],
          }),
        }),
        vertex_distance: ["",[Validators.required]],
        pantascopic_angle: ["",[Validators.required]],
        frame_wrap_angle: ["",[Validators.required]],
        // reading_distance: ["",[Validators.required]],
        reading_distance: [""],
  
        thickness: this.fb.group({
          center_thickness: this.fb.group({
            right: ["",[Validators.required]],
            left: ["",[Validators.required]],
          }),
          nose_edge_thickness: this.fb.group({
            right: ["",[Validators.required]],
            left: ["",[Validators.required]],
          }),
          temple_edge_thickness: this.fb.group({
            right: ["",[Validators.required]],
            left: ["",[Validators.required]],
  
            
          }),
        }),
        shapes: ["",[Validators.required]],
        lens_size: this.fb.group({
          lens_width: ["",[Validators.required]],
          bridge_distance: ["",[Validators.required]],
          lens_height: ["",[Validators.required]],
          temple: ["",[Validators.required]],
          total_width: ["",[Validators.required]],
        }) 
      });
    }
  
    get measurementsFormValidate(){ return this.measurementsForm.controls; }
    
    tintTypeChange(type:string){
      if(type === "Colour"){
        this.lensFormValidate.colour.setValidators([Validators.required]);
        this.lensFormValidate.gradient.setValidators(null);
      }else{
        this.lensFormValidate.colour.setValidators(null);
        this.lensFormValidate.gradient.setValidators([Validators.required]);
      }
  
      this.lensFormValidate.colour.updateValueAndValidity();
      this.lensFormValidate.gradient.updateValueAndValidity();
    }
  
    // tabChange(input:number = 0){
  
    //   if(input === 1){
    //     this.prescriptionFormSubmit()
    //   }else if (input === 2){
    //     this.lensFormSubmit();
    //   }
  
    //   this.selected = input;
    // }
  
    tabChange(input: number = 0) {
      // Ensure that cart is defined and has an id property
      // if (!this.cart || !this.cart.id) {
      //   console.error('Cart ID is not available.');
      //   return;
      // }
  
      if (input == 1) {
        this.prescriptionFormSubmit();
      } else if (input == 2) {
        this.lensFormSubmit();
      }
  
      this.selected = input;
    }
   
  
    setupProductDetails(){
      this.productPrice = +this.cart?.product?.price;
      this.productDiscount = +this.cart?.product?.discount;
      this.productQuantity = +this.cart?.quantities;
      this.calculateTotal();
    }
  
    calculateTotal(){
      this.productTotal  = this.productPrice * this.productQuantity;
    }
  
    calculateOfferPrice(): number {
      
      const discountAmount = this.getTotalDiscount();
  
      // Calculate the offer price after deducting the discount amount
      const offerPrice = this.productTotal - discountAmount;
  
      // Round to two decimal places if needed
      return Math.round(offerPrice * 100) / 100;
  }
  
  getTotalDiscount(): number{
    // Calculate the discount amount based on the productPrice and productDiscount
    let discountAmount = (this.productPrice * this.productDiscount) / 100;
  
    discountAmount = (this.productQuantity * discountAmount);
  
    return Math.round(discountAmount * 100)/100;
  }
  
    increment(){
      this.productQuantity++;
      // this.calculateTotal();
      this.cartUpdate();
    }
  
    decrement(){
      if(this.productQuantity > 0){
        this.productQuantity--;
        this.calculateTotal();
        this.cartUpdate();
      }
    }
  
    remove():void{
      dialogConfig.width ="20%";
      dialogConfig.height ="30%";
      dialogConfig.data = {
        title: "Remove Item",
        message : "Are you sure you want to remove this item?",
        id: "",
     };
     
     dialogConfig.panelClass = "delelteModel";
      
      const dialogRef = this.dialog.open(ConfirmDialogComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(
        (res) => {
            if(res.status){
              this.deleteCart();
            }
        }
      );
    }
  
    deleteCart(){
      let params = { 
         prescriptionId: this.cart.prescriptionId,
         quantities: this.productQuantity, 
         status: "0" 
        };
      this.productService.updateCart(this.cart.id, params).subscribe(
        (response:any)=>{
           console.log(response);
           this.authenticationService.setTotalCartItems(response.totalCartItems);
           this.newEvent.emit("Delete card")
        },
        (err)=> console.log(err)
      )
     }
  
    cartUpdate(){
     let params = { 
      prescriptionId: this.cart.prescriptionId,
      price: this.cart.price,
      quantities: this.productQuantity, 
      status: this.cart.status,
      discount: +this.cart.product.discount 
      };
     this.productService.updateCart(this.cart.id, params).subscribe(
       (response:any)=>{
          this.authenticationService.setTotalCartItems(response.totalCartItems);
          this.newEvent.emit("update card")
       },
       (err)=> console.log(err)
     )
     console.log(params , 'params')
    }

    
  
    
    

    prescriptionFormSubmit() {
      if (this.prescriptionForm.invalid) {
          return;
      }
  
      const cartId = this.data?.cartId;
      
  
      const formData = { ...this.prescriptionForm.value, cartId }; // Use prescriptionForm instead of lensForm
  
      let params = { 
          prescriptionId: this.prescriptionForm.get('prescriptionId').value,
          quantities: this.productQuantity,
          status: cartId,
      };
  
      this.productService.updateCart(cartId, params).subscribe(
          (response: any) => {
              this.commonService.openAlert(response.message);
          },
          (err) => console.log(err)
      );
  }
  
  
    
 
    lensFormSubmit(): void {
      // if (this.lensForm.invalid) {
      //   // Handle invalid form
      //   return;
      // }
    
      const cartId = this.data?.cartId;
    
      // Add cartId to the lens form value
      const formData = { ...this.lensForm.value, cartId };
    
      console.log( formData , cartId , 'cartId')
      // Submit lens form data
      this.productService.addLensToCart(formData).subscribe(
        (response: any) => {
          this.commonService.openAlert(response.message);
          // Emit event to notify parent component
          this.newEvent.emit("Lens added to cart");
          // Call method to store lens data
          this.storeLensData(formData);
        },
        (error) => {
          // Handle error
        }
      );
    }
    
  
    storeLensData(lensFormData: any): void {
     
      console.log("Storing lens data:", lensFormData);
    }
    
  
    
    measurementFormSubmit(): void {
      if (this.measurementsForm.invalid) {
        console.error("Measurement form is invalid");
        return;
      }
    
      const cartId = this.data?.cartId;
    
      // Add cartId to the measurements form value
      const formData = { ...this.measurementsForm.value, cartId };
    
      // Call service method to add measurements to cart
      this.productService.addMeasurementsToCart(formData).subscribe(
        (response: any) => {
          console.log("Measurement form submitted successfully:", response);
          this.commonService.openAlert(response.message); 
        },
        (err) => {
          console.error("Error submitting measurement form:", err);
        }
      );
    }
    
    cancel():void{
      this.dialog.closeAll();
    }
}