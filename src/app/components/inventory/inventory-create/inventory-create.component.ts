import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from '../../../services/roles.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CURRENT_PAGE, GET_ALL } from '../../../shared/constants/pagination.contacts';
import { Role } from '../../../shared/models/Role';
import { CommonService } from '../../../services/common.service';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-inventory-create',
  templateUrl: './inventory-create.component.html',
  styleUrls: ['./inventory-create.component.css']
})
export class InventoryCreateComponent implements OnInit {

 /** USING THIS TO RESET FORM  WITH OUT SHOWING FORMVALIDAITON ERRORS**/
 @ViewChild('myForm', {static: false}) myForm: NgForm;
 public inventoryForm:FormGroup;

 public inventoryId:number = undefined;

 public btnText:string = "Create";


 public roles:Role[];
 public products:any[] = [];
 public inventory:any;
 public page_length:number = GET_ALL;
 public current_page:number = CURRENT_PAGE;


  constructor(private dialog: MatDialog,
    private commonService: CommonService,
    private fb:FormBuilder,
    private rolesService:RolesService,
    private inventorysService: InventoryService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
      this.inventoryId = data.id;
    }

  ngOnInit(): void {
    this.createinventoryForm();
    this.getinventoryDetails();
  }

  getinventoryDetails():void{
    this.inventorysService.createInventory().subscribe(
      (res:any) => {
          this.products = res.data.products;
      }
    );

    if(this.inventoryId != undefined){
      this.btnText = "Update";
      this.inventorysService.showInventory(this.inventoryId).subscribe(
        (res:any) => {
            this.inventory = res.data.Inventory;
            this.inventoryForm.patchValue({
              productId: this.inventory.product_id,
              count: this.inventory.available,
            });
        }
      );
    }
  }

  
  createinventoryForm(){
    this.inventoryForm = this.fb.group({
      productId: ['',[Validators.required]],
      available: ['', [Validators.required]],
      count: ['']
    })
  }

  get formValidate(){
    return this.inventoryForm.controls;
  }

  // inventoryFormSubmit(){

  //   if(this.inventoryForm.invalid){
  //     return;
  //   }

  //   if(this.inventoryId == undefined){
  //     this.inventorysService.storeInventory(this.inventoryForm.value).subscribe(
  //       (response)=>{
        
  //          if (response.success == true) {
  //             this.inventoryForm.reset();
  //             this.myForm.resetForm();
  //             this.createinventoryForm();
  //           } 

  //           this.commonService.openAlert(response.message); 
  //       },
  //       (err)=>{ 
  
  //           if (err instanceof HttpErrorResponse) {
  //             if(err.status === 422) {
  //               const validatonErrors = err.error.errors;
  //               Object.keys(validatonErrors).forEach( prop => {
  //                 const formControl = this.inventoryForm.get(prop);
  //                 if(formControl){
  //                   formControl.setErrors({
  //                     serverError: validatonErrors[prop]
  //                   });
  //                 }
  //               });
  //             }
  //           }
  //       }
  //     )

  //   }else{
     
  //     this.inventorysService.updateInventory(this.inventoryId,this.inventoryForm.value).subscribe(
  //       (response)=>{
  //           this.commonService.openAlert(response.message); 
  //           this.cancel();
  //       },
  //       (err)=>{ 
  //           if (err instanceof HttpErrorResponse) {
  //             if(err.status === 422) {
  //               const validatonErrors = err.error.errors;
  //               Object.keys(validatonErrors).forEach( prop => {
  //                 const formControl = this.inventoryForm.get(prop);
  //                 if(formControl){
  //                   formControl.setErrors({
  //                     serverError: validatonErrors[prop]
  //                   });
  //                 }
  //               });
  //             }
  //           }
  //       }
  //     )
  //   }
  // }

  inventoryFormSubmit(){

    if(this.inventoryForm.invalid){
      return;
    }

    if(this.inventoryId == undefined){
      this.inventorysService.storeInventory(this.inventoryForm.value).subscribe(
        (response)=>{
        
           if (response.success == true) {
              this.inventoryForm.reset();
              this.myForm.resetForm();
              this.createinventoryForm();
            } 

            this.commonService.openAlert(response.message); 
        },
        (err)=>{ 
  
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.inventoryForm.get(prop);
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
     
      this.inventorysService.updateInventory(this.inventoryId,this.inventoryForm.value).subscribe(
        (response)=>{
            this.commonService.openAlert(response.message); 
            this.cancel();
        },
        (err)=>{ 
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.inventoryForm.get(prop);
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
