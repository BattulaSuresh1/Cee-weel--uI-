import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrescriptionService } from '../../../../services/prescription.service';
import { ProductService } from '../../../../services/product.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../../../services/common.service';
import { AuthenticationService } from '../../../../auth/services/authentication.service';

const dialogConfig= new MatDialogConfig();
dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  public SERVER_PATH = environment.REST_API_URL;
  @Input() cart:any;
  @Input() prescriptions:any;

  @Output() newEvent = new EventEmitter();

  public prescription:any;
  public prescriptionForm:FormGroup;

  public selected:number = 0;
  public lensForm:FormGroup;
  public measurementsForm:FormGroup;
  
  // public life_styles:string[] = [];
  // public lens_recommendeds:string[] = [];
  // public tint_types:string[] = [];
  // public mirror_coatings:string[] = [];
  // public colours:string[] = [];
  // public gradients:string[] = [];
  
  selectedEye: string;


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

  isTypeEnabled: boolean = false;
  isIndexEnabled: boolean = false;
  isDiaEnabled: boolean = false;
  isFromEnabled: boolean = false;
  isToEnabled: boolean = false;
  isRpEnabled: boolean = false;
  isMaxcylEnabled: boolean = false;
  isMrpEnabled: boolean = false;
  isCostpriceEnabled: boolean = false;


  constructor(private fb:FormBuilder,
    private dialog:MatDialog,
    private commonService: CommonService,
    private prescriptionService: PrescriptionService,
    private productService:ProductService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.createForm();
    this.createLensForm();
    this.createMeasurementsForm();
    this.getDetails();
    this.getCart();
    this.setupProductDetails();
    this.prescriptionForm.get('prescriptionId').valueChanges.subscribe(id => {
      this.prescription = this.prescriptions.find(p => p.id === id);
    })

        const eyeSelectionControl = this.lensForm.get('eye_selection');
      eyeSelectionControl.valueChanges.subscribe((eyeSelection) => {
        this.onEyeSelectionChange({ value: eyeSelection });
      });

      const rightEyeControls = [
      'brand', 'type', 'index', 'dia', 'from', 'to', 'rp', 'max_cyl'
    ];

    const leftEyeControls = [
      'brand', 'type', 'index', 'dia', 'from', 'to', 'rp', 'max_cyl'
    ];

    const bothEyesControls = [
      'brand', 'type', 'index', 'dia', 'from', 'to', 'rp', 'max_cyl'
    ];


    rightEyeControls.forEach(control => {
      this.lensForm.get(`right_eye.${control}`).valueChanges.subscribe(() => {
        this.updateRightEyeName();
        if (eyeSelectionControl.value === 'right_eye') {
          this.lensFormSubmit();
        }
      }); 
    });

    leftEyeControls.forEach(control => {
      this.lensForm.get(`left_eye.${control}`).valueChanges.subscribe(() => {
        this.updateLeftEyeName();
        if (eyeSelectionControl.value === 'left_eye') {
          this.lensFormSubmit();
        }
      });
    });

    bothEyesControls.forEach(control => {
      this.lensForm.get(`both_eyes.${control}`).valueChanges.subscribe(() => {
        this.updateBothEyesName();
        if (eyeSelectionControl.value === 'both_eyes') {
          this.lensFormSubmit();
        }
      });
    });

  }
  


  updateRightEyeName(): void {
    const rightEyeGroup = this.lensForm.get('right_eye');
  
    const brand = this.brands.find(item => item.id === rightEyeGroup.get('brand').value)?.name;
    const type = this.types.find(item => item.id === rightEyeGroup.get('type').value)?.name;
    const index = this.indexs.find(item => item.id === rightEyeGroup.get('index').value)?.name;
    const dia = this.dias.find(item => item.id === rightEyeGroup.get('dia').value)?.name;
    const from = this.froms.find(item => item.id === rightEyeGroup.get('from').value)?.from;
    const to = this.tos.find(item => item.id === rightEyeGroup.get('to').value)?.to;
    // const rp = this.rps.find(item => item.id === rightEyeGroup.get('rp').value)?.rp;
    const maxCyl = this.max_cyls.find(item => item.id === rightEyeGroup.get('max_cyl').value)?.name;
  
    const concatenatedName = `${brand}-${type}-${index}-${dia}-${from}/${to} -Max Cyl${maxCyl}`;
  
    // Set the concatenated name to the 'name' form control
    this.lensForm.get('right_eye.name').setValue(concatenatedName);
  }
  
  updateLeftEyeName(): void {
    const leftEyeGroup = this.lensForm.get('left_eye');
  
    const brand = this.brands.find(item => item.id === leftEyeGroup.get('brand').value)?.name;
    const type = this.types.find(item => item.id === leftEyeGroup.get('type').value)?.name;
    const index = this.indexs.find(item => item.id === leftEyeGroup.get('index').value)?.name;
    const dia = this.dias.find(item => item.id === leftEyeGroup.get('dia').value)?.name;
    const from = this.froms.find(item => item.id === leftEyeGroup.get('from').value)?.from;
    const to = this.tos.find(item => item.id === leftEyeGroup.get('to').value)?.to;
    // const rp = this.rps.find(item => item.id === leftEyeGroup.get('rp').value)?.rp;
    const maxCyl = this.max_cyls.find(item => item.id === leftEyeGroup.get('max_cyl').value)?.name;
  
    const concatenatedName = `${brand}-${type}-${index}-${dia}-${from}/${to} -Max Cyl${maxCyl}`;
  
    // Set the concatenated name to the 'name' form control
    this.lensForm.get('left_eye.name').setValue(concatenatedName);
  }

  updateBothEyesName(): void {
    const bothEyesGroup = this.lensForm.get('both_eyes');
  
    const brand = this.brands.find(item => item.id === bothEyesGroup.get('brand').value)?.name;
    const type = this.types.find(item => item.id === bothEyesGroup.get('type').value)?.name;
    const index = this.indexs.find(item => item.id === bothEyesGroup.get('index').value)?.name;
    const dia = this.dias.find(item => item.id === bothEyesGroup.get('dia').value)?.name;
    const from = this.froms.find(item => item.id === bothEyesGroup.get('from').value)?.from;
    const to = this.tos.find(item => item.id === bothEyesGroup.get('to').value)?.to;
    // const rp = this.rps.find(item => item.id === bothEyesGroup.get('rp').value)?.rp;
    const maxCyl = this.max_cyls.find(item => item.id === bothEyesGroup.get('max_cyl').value)?.name;
  
    const concatenatedName = `${brand}-${type}-${index}-${dia}-${from}/${to} -Max Cyl${maxCyl}`;
  
    // Set the concatenated name to the 'name' form control
    this.lensForm.get('both_eyes.name').setValue(concatenatedName);
  }


    onBrandChange(brandId: any): void {
      // Implement your logic to enable/disable Type based on the selected Brand
      this.isTypeEnabled = !!brandId;
    
      // Reset Type and Index values if Brand is changed
      if (!brandId) {
        this.lensForm.get('right_eye.type').reset();
        this.lensForm.get('right_eye.index').reset();
        this.lensForm.get('right_eye.dia').reset();
        this.lensForm.get('right_eye.from').reset();
        this.lensForm.get('right_eye.to').reset();
        this.lensForm.get('right_eye.rp').reset();
        this.lensForm.get('right_eye.max_cyl').reset();
        this.lensForm.get('right_eye.mrp').reset();
        this.lensForm.get('right_eye.cost_price').reset();
       
        this.isMrpEnabled = false;
      }

       // Reset Type and Index values if Brand is changed
       else if (!brandId) {
        this.lensForm.get('left_eye.type').reset();
        this.lensForm.get('left_eye.index').reset();
        this.lensForm.get('left_eye.dia').reset();
        this.lensForm.get('left_eye.from').reset();
        this.lensForm.get('left_eye.to').reset();
        this.lensForm.get('left_eye.rp').reset();
        this.lensForm.get('left_eye.max_cyl').reset();
        this.lensForm.get('left_eye.mrp').reset();
        this.lensForm.get('left_eye.cost_price').reset();
       
        this.isMrpEnabled = false;
      }

       // Reset Type and Index values if Brand is changed
       else if (!brandId) {
        this.lensForm.get('both_eyes.type').reset();
        this.lensForm.get('both_eyes.index').reset();
        this.lensForm.get('both_eyes.dia').reset();
        this.lensForm.get('both_eyes.from').reset();
        this.lensForm.get('both_eyes.to').reset();
        this.lensForm.get('both_eyes.rp').reset();
        this.lensForm.get('both_eyes.max_cyl').reset();
        this.lensForm.get('both_eyes.mrp').reset();
        this.lensForm.get('both_eyes.cost_price').reset();
       
        this.isMrpEnabled = false;
      }
    }
    
    // Implement similar methods for Type, Index, and Dia if needed
    
    onTypeChange(typeId: any): void {
      // Implement your logic to enable/disable Index based on the selected Type
      this.isIndexEnabled = !!typeId;
    
      // Reset Index value if Type is changed
      if (!typeId) {
        this.lensForm.get('right_eye.index').reset();
        this.isMrpEnabled = false;
      }

      else if (!typeId) {
        this.lensForm.get('left_eye.index').reset();
        this.isMrpEnabled = false;
      }

      if (!typeId) {
        this.lensForm.get('both_eyes.index').reset();
        this.isMrpEnabled = false;
      }
    }
    
    onIndexChange(indexId: any): void {
      // Implement your logic to enable/disable Dia based on the selected Index
      this.isDiaEnabled = !!indexId;
    
      // Reset Dia value if Index is changed
      if (!indexId) {
        this.lensForm.get('right_eye.dia').reset();
      }

      else if (!indexId) {
        this.lensForm.get('left_eye.dia').reset();
      }

      if (!indexId) {
        this.lensForm.get('both_eyes.dia').reset();
      }
    }

    onDiaChange(diaId: any): void {
      // Implement your logic to enable/disable Dia based on the selected Index
      this.isFromEnabled = !!diaId;
    
      // Reset from value if dia is changed
      if (!diaId) {
        this.lensForm.get('right_eye.from').reset();
      }
    }

    onFromChange(fromId: any): void {
      // Implement your logic to enable/disable Dia based on the selected Index
      this.isToEnabled = !!fromId;
    
      // Reset to value if from is changed
      if (!fromId) {
        this.lensForm.get('right_eye.to').reset();
      }
    }

    onToChange(toId: any): void {
      // Implement your logic to enable/disable Dia based on the selected Index
      this.isRpEnabled = !!toId;
    
      // Reset rp value if to is changed
      if (!toId) {
        this.lensForm.get('right_eye.rp').reset();
      }
    }
  
    onRpChange(rpId: any): void {
      // Implement your logic to enable/disable Dia based on the selected Index
      this.isMaxcylEnabled = !!rpId;
    
      // Reset max cyl value if rp is changed
      if (!rpId) {
        this.lensForm.get('right_eye.max_cyl').reset();
      }
    }

    onMaxcylChange(maxcylId: any): void {
      // Implement your logic to enable/disable Dia based on the selected Index
      this.isMrpEnabled = !!maxcylId;
    
      // Reset mrp value if rp is changed
      if (!maxcylId) {
        this.lensForm.get('right_eye.mrp').reset();
      }
    }

    onMrpChange(mrpId: any): void {
      // Implement your logic to enable/disable Dia based on the selected Index
      this.isCostpriceEnabled = !!mrpId;
    
      // Reset mrp value if rp is changed
      if (!mrpId) {
        this.lensForm.get('right_eye.cost_price').reset();
      }
    }
  

  getDetails():void{
    this.prescriptionService.createPrescription().subscribe(
      (res:any) => {
      
        //  this.life_styles = res.data.life_styles;
        //  this.lens_recommendeds = res.data.lens_recommendeds;
        //  this.tint_types = res.data.tint_types;
        //  this.mirror_coatings = res.data.mirror_coatings;
        //  this.colours = res.data.tint_colors;
        //  this.gradients = res.data.tint_gradients;
         this.brands = res.data.brands;
         this.eye_selections = res.data.eye_selections;
         this.types = res.data.type;
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

  getCart(){
    this.productService.showCart(this.cart.id).subscribe(
      (response:any) => {
        if(response.data.cart.prescription != undefined){
          this.prescription = response.data.cart.prescription;
          this.prescriptionForm.patchValue({
            prescriptionId: response.data.cart.prescription.id
          });
        }
        if(response.data.cart.lens != undefined){
          this.lensForm.patchValue({
            life_style: +response.data.cart.lens.life_style,
            lens_recommended: +response.data.cart.lens.lens_recommended,
            tint_type: response.data.cart.lens.tint_type,
            mirror_coating: +response.data.cart.lens.mirror_coating,
            colour: +response.data.cart.lens.tint_value,
            gradient: +response.data.cart.lens.tint_value,
           
            
            brand: +response.data.cart.lens.brands,
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
          
        if( 
          response.data.cart.measurements != undefined && 
          response.data.cart.measurements.precalvalues.length >= 2  &&
          response.data.cart.measurements.thickness.length >= 3
          ){
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
                  left:  response.data.cart.measurements.thickness[0].left
                },
                nose_edge_thickness: {
                  right: response.data.cart.measurements.thickness[1].right,
                  left:  response.data.cart.measurements.thickness[1].left
                },
                temple_edge_thickness: {
                  right: response.data.cart.measurements.thickness[2].right,
                  left:  response.data.cart.measurements.thickness[2].left
                },
              },
              lens_size:{
                lens_width: response.data.cart.measurements.lens_width,
                bridge_distance: response.data.cart.measurements.bridge_distance,
                lens_height: response.data.cart.measurements.lens_height,
                temple: response.data.cart.measurements.temple,
                total_width: response.data.cart.measurements.total_width,
              }
          });

        }
      }
    );
  }

  createForm(){
    this.prescriptionForm = this.fb.group({
      prescriptionId:["",[Validators.required]]
    })
  }
   

  // createLensForm():void{
  //   this.lensForm = this.fb.group({
  //       // life_style: ["",[Validators.required]],
  //       // lens_recommended: ["",[Validators.required]],
  //       // tint_type: ["",[Validators.required]],
  //       // // mirror_coating: ["",[Validators.required]],
  //       // mirror_coating: [""],
  //       // colour: ["",[Validators.required]],
  //       // gradient: ["",[Validators.required]],

  //       eye_selection:this.fb.group({
  //         right_eye : this.fb.group({
  //           brand: ["", [Validators.required]],
  //           type: ["", [Validators.required]],
  //           index: ["", [Validators.required]],
  //           dia: ["", [Validators.required]],
  //           from: ["", [Validators.required]],
  //           to: ["", [Validators.required]],
  //           rp: ["", [Validators.required]],
  //           max_cyl: ["", [Validators.required]],
  //           code: ["", [Validators.required]],
  //           name: ["", [Validators.required]],
  //           mrp: ["", [Validators.required]],
  //           cost_price: ["", [Validators.required]],
  //         }),

  //         left_eye : this.fb.group({

  //           brand: ["", [Validators.required]],
  //           type: ["", [Validators.required]],
  //           index: ["", [Validators.required]],
  //           dia: ["", [Validators.required]],
  //           from: ["", [Validators.required]],
  //           to: ["", [Validators.required]],
  //           rp: ["", [Validators.required]],
  //           max_cyl: ["", [Validators.required]],
  //           code: ["", [Validators.required]],
  //           name: ["", [Validators.required]],
  //           mrp: ["", [Validators.required]],
  //           cost_price: ["", [Validators.required]],
  //         }),

  //         both_eyes : this.fb.group({

  //           brand: ["", [Validators.required]],
  //           type: ["", [Validators.required]],
  //           index: ["", [Validators.required]],
  //           dia: ["", [Validators.required]],
  //           from: ["", [Validators.required]],
  //           to: ["", [Validators.required]],
  //           rp: ["", [Validators.required]],
  //           max_cyl: ["", [Validators.required]],
  //           code: ["", [Validators.required]],
  //           name: ["", [Validators.required]],
  //           mrp: ["", [Validators.required]],
  //           cost_price: ["", [Validators.required]],
  //         })
  //       }),
        
  //   });
  // }
 

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
      brand: ['', ],
      type: ['', ],
      index: ['', ],
      dia: ['', ],
      from: ['', ],
      to: ['', ],
      rp: ['', ],
      max_cyl: ['', ],
      code: ['', ],
      name: ['', ],
      mrp: ['', ],
      cost_price: ['', ],
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

    console.log(event, 'selection')
    this.selectedEye = event.value;
    //  Reset all eye controls to avoid conflicts
     ['right_eye', 'left_eye', 'both_eyes'].forEach(eyeControl => {
      Object.keys(this.lensForm.get(eyeControl).value).forEach(control => {
        
          this.lensForm.get(eyeControl).get(control).reset();
       });
     });
      // If the eye selection changes, submit the form data
  this.lensFormSubmit();
  }

  // Add a function to get the current eye form based on user selection
getCurrentEyeForm(): FormGroup {
  return this.lensForm.get(this.selectedEye) as FormGroup;
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

  tabChange(input:number = 0){

    if(input === 1){
      this.prescriptionFormSubmit()
    }else if (input === 2){
      this.lensFormSubmit();
    }

    this.selected = input;
  }

  setupProductDetails(){
    this.productPrice = +this.cart.product.price;
    this.productDiscount = +this.cart.product.discount;
    this.productQuantity = +this.cart.quantities;
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
  }

  prescriptionFormSubmit(){
    if(this.prescriptionForm.invalid){
      return;
    }

    let params = { 
      prescriptionId: this.prescriptionForm.get('prescriptionId').value,
      quantities: this.productQuantity,
      status: this.cart.status
     };

    this.productService.updateCart(this.cart.id, params).subscribe(
      (response:any)=>{
         this.commonService.openAlert(response.message); 
      },
      (err)=> console.log(err)
    )
  }

  // lensFormSubmit(){

  //   // if(this.lensForm.invalid){
  //   //   return;
  //   // }

  //   this.lensForm.addControl("cartId", new FormControl(this.cart.id));

  //   this.productService.addLensToCart(this.lensForm.value).subscribe(
  //     (response:any)=>{
  //        this.commonService.openAlert(response.message); 
  //        //console.log(response);
  //     },
  //     (err)=> console.log(err)
  //   )
  // }

  lensFormSubmit() {
    if (this.lensForm.invalid || !this.selectedEye) {
      return;
    }
  
    // Update eye_selection for each eye in the form data
    ['right_eye', 'left_eye', 'both_eyes'].forEach((eyeControl) => {
      this.lensForm.get(eyeControl).get('eye_selection').setValue(this.selectedEye);
    });
  
    this.lensForm.addControl('cartId', new FormControl(this.cart.id));
  
    this.productService.addLensToCart(this.lensForm.value).subscribe(
      (response: any) => {
        this.commonService.openAlert(response.message);
      },
      (err) => console.log(err)
    );
  }
  

  measurementFormSubmit(){

    if(this.measurementsForm.invalid){
      return;
    }
    this.measurementsForm.addControl("cartId", new FormControl(this.cart.id));

    this.productService.addMeasurementsToCart(this.measurementsForm.value).subscribe(
      (response:any)=>{
         this.commonService.openAlert(response.message); 
      },
      (err)=> console.log(err)
    )
  }
}
