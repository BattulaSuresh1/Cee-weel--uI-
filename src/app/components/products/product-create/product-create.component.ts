import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Role } from '../../../auth/models/roles';
import { GET_ALL, CURRENT_PAGE } from '../../../shared/constants/pagination.contacts';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { RolesService } from '../../../services/roles.service';
import { CommonService } from '../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BrandsService } from 'src/app/services/brands.service';


const dialogConfig= new MatDialogConfig();
dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;
@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {


  selectedCategory: string;
  selectedType: string;
  isSecondDropdownDisabled: boolean = true;
  SecondDropdownDisabled: Boolean = true;
  sizeDisabled:boolean = true;

  filteredBrands: any[] = [];
  itemCtrl: FormControl;
  filteredItems: Observable<any[]>;
  showAddButton: boolean = false;

  prompt = 'Press <enter> to add "';

  items: string[] = [  ];


  onCategoryChange() {
    // Enable the second dropdown only if the selected category is "frames"
    this.SecondDropdownDisabled = this.selectedCategory  == '3' || this.selectedCategory  ==  '4';

    this.isSecondDropdownDisabled = this.selectedCategory == '1';

    this.sizeDisabled =  this.selectedCategory == '3' || this.selectedCategory =='4';


    // Reset the selected type when disabling the second dropdown
    // if (this.isSecondDropdownDisabled) {
    //   this.selectedType = null;
    // };
  }

  public uploadType:string ="products";
  /** USING THIS TO RESET FORM  WITH OUT SHOWING FORMVALIDAITON ERRORS**/
  @ViewChild('myForm', {static: false}) myForm: NgForm;
 public productForm:FormGroup;

 public roles:Role[];
 public item_types:any[];
 public rim_types:any[];
 public brands:any[];
 public shapes:any[];
 public collection_types:any[];
 public materials:any[];
 public colors:any[];
 public prescription_types:any[];
 public glass_colors:any[];
 public barcodes: any[];
 public frame_widths:any[];
 public page_length:number = GET_ALL;
 public current_page:number = CURRENT_PAGE;
 public productId:number = undefined;
 public buttonText:string = "Create";


  constructor(private dialog : MatDialog,
    @Inject (MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private commonService: CommonService,
    private rolesService:RolesService,
    private brandservice: BrandsService,
    private productService:ProductService) {
    this.productId = data.id;

     this.itemCtrl = new FormControl();
     this.filteredItems = this.itemCtrl.valueChanges
      .pipe(
       startWith(''),
       map(item => item ? this.filterItems(item) : this.items.slice())
       )
    }


  filterItems(name: string) {
    let results = this.items.filter((item:any) =>
      item.name.toLowerCase().indexOf(name.toLowerCase()) === 0);

    this.showAddButton = results.length === 0;
    if (this.showAddButton) {
      results = [this.prompt + name + '"'];
    }

    return results;
  }

  optionSelected(option) {
    this.itemCtrl.setValue(option.value.name);
    this.productForm.get('brand').setValue(option.value.id);
    this.productForm.get('brand').updateValueAndValidity();
   
  }

//   optionSelecteds(option) {
//     // Set the display value to the name of the selected item type
//     this.itemCtrl.setValue(option.value.name);
//     // Set the selected item type ID in the form control
//     this.productForm.get('item_type').setValue(option.value.id);
//     // Update the validity of the form control
//     this.productForm.get('item_type').updateValueAndValidity();
// }


  addOption() {
    let option = this.removePromptFromOption(this.itemCtrl.value);
    if (!this.items.some((entry: any) => entry.name === option)) {
      this.addBrand({ name: option });
    }
  }

  addBrand(params: any) {
    this.brandservice.storeBrand(params).subscribe(
      (response) => {
        this.commonService.openAlert(response.message);
        if (!this.items.some((entry:any) => entry.name === params.name)) {
          const index = this.items.push(response.data) - 1;
          this.itemCtrl.setValue(response.data.name);
          this.productForm.get('brand').setValue(response.data.id);
          this.productForm.get('brand').updateValueAndValidity();
        }
      },
      (err) => {

        if (err instanceof HttpErrorResponse) {
          if (err.status === 422) {
            const validatonErrors = err.error.errors;

          }
        }
      }
    )
  }

  removePromptFromOption(option) {
    if (option.startsWith(this.prompt)) {
      option = option.substring(this.prompt.length, option.length -1);
    }
    return option;
  }

  ngOnInit(): void {
    this.createproductForm();
    this.getProductsData();

    //   this.productForm.get('item_type').valueChanges.subscribe(val => {

    //   this.productForm.get('rim_type').enable();
    //   this.productForm.get('size').enable();
    //   this.productForm.get('prescription_type').enable();
    //   this.productForm.get('glass_color').enable();
    //   this.productForm.get('color').enable();
    //   this.productForm.get('material').enable();
    //   this.productForm.get('frame_width').enable();
      
    //   if(val == 'CONTACT LENSE - ( CL )' || val ==  'OPTHALMIC LENSE - ( OL )'){
    //     this.productForm.get('rim_type').disable();
    //     this.productForm.get('size').disable();
    //     this.productForm.get('prescription_type').disable();
    //     this.productForm.get('material').disable();
    //     this.productForm.get('frame_width').disable();
    //   }

    //   if(val == 'FRAME - ( FR )' ){
    //     this.productForm.get('prescription_type').disable();
    //   }

    //   if(val == 'FRAME - ( FR )' || val == 'OPTHALMIC LENSE - ( OL )'){
    //     this.productForm.get('glass_color').disable();
    //   }

    //   if(val == 'OPTHALMIC LENSE - ( OL )'){
    //     this.productForm.get('color').disable();
    //     this.productForm.get('collection_type').disable();
    //   }
    // });

  
       this.productForm.get('item_type').valueChanges.subscribe(val => {

      this.productForm.get('rim_type').enable();
      this.productForm.get('size').enable();
      this.productForm.get('prescription_type').enable();
      this.productForm.get('glass_color').enable();
      this.productForm.get('color').enable();
      this.productForm.get('material').enable();
      this.productForm.get('frame_width').enable();
      
      if(val == '3' || val ==  '4'){
        this.productForm.get('rim_type').disable();
        this.productForm.get('size').disable();
        this.productForm.get('prescription_type').disable();
        this.productForm.get('material').disable();
        this.productForm.get('frame_width').disable();
      }

      if(val == '1' ){
        this.productForm.get('prescription_type').disable();
      }

      if(val == '1' || val == '4'){
        this.productForm.get('glass_color').disable();
      }

      if(val == '4'){
        this.productForm.get('color').disable();
        this.productForm.get('collection_type').disable();
      }
    });

    
    // Subscribe to changes in the item_type form control
    this.productForm.get('item_type').valueChanges.subscribe(val => {
      // Check if brands array is properly initialized and has a filter method
      if (Array.isArray(this.brands) && typeof this.brands.filter === 'function') {
          // Filter the brands based on the selected item type
          this.filteredBrands = this.brands.filter(brand => {
              // Check if the brand's category array contains the selected item type
              return brand.category.includes(val);
          });
      }
  });
  }

  // getProductsData():void{

  //   if(this.productId == undefined){
  //     this.productService.createProduct().subscribe(
  //       (res:any)=>{

  //           this.item_types = res.data.item_types;
  //           this.rim_types = res.data.rim_types;
  //           this.brands = res.data.brands;
  //           this.items = this.brands;
  //           this.shapes = res.data.shapes;
  //           this.collection_types = res.data.collection_types;
  //           this.materials = res.data.materials;
  //           this.colors = res.data.colors;
  //           this.prescription_types = res.data.prescription_types;
  //           this.glass_colors = res.data.glass_colors;
  //           this.frame_widths = res.data.frame_widths;
  //           this.barcodes = res.data.barcodes;
  //       }
  //     )
  //   }
  //   else{
  //     this.buttonText = "Update";
  //     this.productService.showProduct(this.productId).subscribe(
  //       (res:any)=>{
  //         console.log(res)
  //         this.item_types = res.data.item_types;
  //         this.rim_types = res.data.rim_types;
  //         this.brands = res.data.brands;
  //         this.shapes = res.data.shapes;
  //         this.collection_types = res.data.collection_types;
  //         this.materials = res.data.materials;
  //         this.colors = res.data.colors;
  //         this.prescription_types = res.data.prescription_types;
  //         this.glass_colors = res.data.glass_colors;
  //         this.frame_widths = res.data.frame_widths;
  //         this.barcodes = res.data.barcodes;

  //           let product = res.data.product;

  //         let selectedBrand = this.brands.find(val => {
  //           return val.id == product.brand;
  //         });

  //         this.itemCtrl.setValue(selectedBrand.name);

  //           this.productForm.patchValue({
  //             name: product.name,
  //             item_type: +product.item_type,
  //             item_code: product.item_code,
  //             item_description: product.item_description,
  //             price: product.price,
  //             discount:product.discount,
  //             brand: +product.brand,
  //             model: product.model,
  //             color: +product.color,
  //             size: +product.size,
  //             rim_type: +product.rim_type,
  //             collection_type: +product.collection_type,
  //             material: +product.material,
  //             prescription_type: +product.prescription_type,
  //             glass_color: +product.glass_color,
  //             frame_width: +product.frame_width,
  //             catalog_no: product.catalog_no,
  //             images: product.images,
  //             barcode : product.barcode
  //           });
  //       }
  //     )
  //   }
  // }

  getProductsData(): void {
    if (this.productId == undefined) {
      this.productService.createProduct().subscribe(
        (res: any) => {
          this.item_types = res.data.item_types;
          this.rim_types = res.data.rim_types;
          this.brands = res.data.brands;
          this.items = this.brands;
          this.shapes = res.data.shapes;
          this.collection_types = res.data.collection_types;
          this.materials = res.data.materials;
          this.colors = res.data.colors;
          this.prescription_types = res.data.prescription_types;
          this.glass_colors = res.data.glass_colors;
          this.frame_widths = res.data.frame_widths;
          this.barcodes = res.data.barcodes;
        }
      );
    } else {
      this.buttonText = "Update";
      this.productService.showProduct(this.productId).subscribe(
        (res: any) => {
          console.log(res);
          this.item_types = res.data.item_types;
          this.rim_types = res.data.rim_types;
          this.brands = res.data.brands;
          this.shapes = res.data.shapes;
          this.collection_types = res.data.collection_types;
          this.materials = res.data.materials;
          this.colors = res.data.colors;
          this.prescription_types = res.data.prescription_types;
          this.glass_colors = res.data.glass_colors;
          this.frame_widths = res.data.frame_widths;
          this.barcodes = res.data.barcodes;
  
          let product = res.data.product;
  
          this.productForm.patchValue({
            name: product.name,
            item_type: +product.item_type,
            item_code: product.item_code,
            item_description: product.item_description,
            price: product.price,
            discount: product.discount,
            brand: +product.brand,
            model: product.model,
            color: +product.color,
            size: +product.size,
            rim_type: +product.rim_type,
            collection_type: +product.collection_type,
            material: +product.material,
            prescription_type: +product.prescription_type,
            glass_color: +product.glass_color,
            frame_width: +product.frame_width,
            catalog_no: product.catalog_no,
            images: product.images,
            barcode: product.barcode
          });
        }
      );
    }
  }
  

  createproductForm(){
    this.productForm = this.fb.group({
      name: ['',[Validators.required]],
      item_type: ['',[Validators.required]],
      // item_code: ['',[Validators.required]],
      item_code: [''],
      item_description: ['',[Validators.required]],
      price: ['',[Validators.required]],
      discount: ['', [ Validators.required , Validators.min(0), Validators.max(100)]],
      brand: ['',[Validators.required]],
      model: ['',[Validators.required]],
      color: ['',[Validators.required]],
      size: ['',[Validators.required]],
      rim_type: ['',[Validators.required]],
      collection_type: ['',[Validators.required]],
      material: ['',[Validators.required]],
      prescription_type: [''],
      glass_color: ['',[Validators.required]],
      frame_width: [''],
      catalog_no: ['',[Validators.required]],
      images: [''],
      barcode : ['' ,[Validators.required]],
    })
  }

  get formValidate(){
    return this.productForm.controls;
  }

  addAttachment(fileName:any){
    this.productForm.patchValue({images: fileName})
  }




  productFormSubmit(){

    // this.productForm.get('rim_type').enable();
    // this.productForm.get('size').enable();
    // this.productForm.get('prescription_type').enable();
    console.log(this.productForm.value);

    console.log(this.productForm.controls);

    if(this.productForm.invalid){
      return;
    }

    if(this.productId == undefined){
      this.productService.storeProduct(this.productForm.value).subscribe(
        (response)=>{
            this.productForm.reset();
            // this.myForm.resetForm();
            this.itemCtrl.setValue('');
            this.commonService.openAlert(response.message);
            this.createproductForm();
            // alert('form submit Working')
            // console.log(response)
        },
        (err)=>{

            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.productForm.get(prop);
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
      this.productService.updateProduct(this.productId,this.productForm.value).subscribe(
        (response)=>{
            this.commonService.openAlert(response.message);
            this.cancel();
        },
        (err)=>{
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.productForm.get(prop);
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
