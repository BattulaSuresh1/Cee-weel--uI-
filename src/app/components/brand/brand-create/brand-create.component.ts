import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from '../../../services/roles.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CURRENT_PAGE, GET_ALL } from 'src/app/shared/constants/pagination.contacts';
import { map, startWith } from 'rxjs/operators';
import { UsersService } from '../../../services/users.service';
import { CommonService } from '../../../services/common.service';
import { BrandsService } from 'src/app/services/brands.service';

@Component({
  selector: 'app-brand-create',
  templateUrl: './brand-create.component.html',
  styleUrls: ['./brand-create.component.css']
})
export class BrandCreateComponent implements OnInit {
  @ViewChild('myForm', { static: false }) myForm: NgForm;
  public brandForm: FormGroup;
  public brandId: number;
  public btnText: string = "Create";
  public brand: any;
  public categorys: any[] = [];
  public page_length: number = GET_ALL;
  public current_page: number = CURRENT_PAGE;
  public roles: any;
  public user: any;

  constructor(private dialog: MatDialog,
    private commonService: CommonService,
    private fb: FormBuilder,
    private rolesService: RolesService,
    private brandservice: BrandsService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.brandId = data.id;
  }

  ngOnInit(): void {
    this.createbrandForm();
    this.getUserDetails();
    // this.loadBrandDetails();
  }

  // getUserDetails(): void {
  //   if (this.brandId !== undefined) {
  //       this.btnText = "Update";
  //       this.brandservice.showBrandDetails(this.brandId).subscribe(
  //           (response: any) => {
  //               this.brand = response.data.brand;
  //               this.user = response.data.brand.name;
  //               this.brandForm.patchValue({
  //                   name: response.data.brand.name,
  //                   category: response.data.brand.category 
  //               });

  //               // Loop through categories to set selected property
  //               this.categorys.forEach(category => {
  //                   // Check if the category ID exists in the brand's categories
  //                   category.selected = response.data.brand.category.includes(category.id);
  //               });
  //           }
  //       );
  //   }

  //   this.brandservice.create().subscribe((response: any) => {
  //             if (response.success) {
  //                 this.categorys = response.data.category;

  //                 // Initialize the selected property for each category
  //                 this.categorys.forEach(category => {
  //                   category.selected = false;
  //                 });

  //                 // If brand details are fetched, update the form with category selections
  //                 if (this.brandId !== undefined) {
  //                     this.brandForm.patchValue({
  //                         category: this.categorys.filter(category => category.selected).map(category => category.id)
  //                     });
  //                 }
  //             } else {
  //                 console.error(response.message); // Log error message
  //             }
  //         });
  // }

  getUserDetails(): void {
    if (this.brandId !== undefined) {
        this.btnText = "Update";
        this.brandservice.showBrandDetails(this.brandId).subscribe(
            (response: any) => {
                this.brand = response.data.brand;
                this.user = response.data.brand.name;
                this.brandForm.patchValue({
                    name: response.data.brand.name,
                    category: response.data.brand.category 
                });

                // Loop through categories to set selected property
                this.categorys.forEach(category => {
                    // Check if the category ID exists in the brand's categories
                    category.selected = response.data.brand.category.includes(category.id);
                });
            }
        );
    }

    this.brandservice.create().subscribe((response: any) => {
              if (response.success) {
                  this.categorys = response.data.category;

                  // Initialize the selected property for each category
                  this.categorys.forEach(category => {
                    category.selected = false;
                  });

                  // If brand details are fetched, update the form with category selections
                  if (this.brandId !== undefined) {
                      this.brandForm.patchValue({
                          category: this.categorys.filter(category => category.selected).map(category => category.id)
                      });
                  }
              } else {
                  console.error(response.message); // Log error message
              }
          });
}
  



  createbrandForm() {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required]],
      category: [[]]
    });
  }

  get formValidate() {
    return this.brandForm.controls;
  }

//   brandFormSubmit() {
//     if (this.brandForm.invalid) {
//         return;
//     }

//     // Extract selected category IDs
//     const selectedCategoryIds = this.categorys.filter(category => category.selected)
//                                                .map(category => category.id);

//     // Prepare form data
//     const formData = {
//         name: this.brandForm.value.name,
//         category: selectedCategoryIds
//     };

//     if (this.brandId === undefined) {
//         // Create brand
//         this.brandservice.storeBrand(formData).subscribe(
//             (response) => {
//                 this.commonService.openAlert(response.message);
//                 this.cancel();
//             },
//             (err) => {
//                 this.handleError(err);
//             }
//         );
//     } else {
//         // Update brand
//         this.brandservice.updateBrand(this.brandId, formData).subscribe(
//             (response) => {
//                 this.commonService.openAlert(response.message);
//                 this.cancel();
//             },
//             (err) => {
//                 this.handleError(err);
//             }
//         );
//     }
// }

brandFormSubmit() {
  if (this.brandForm.invalid) {
      return;
  }

  // Extract selected category IDs
  const selectedCategoryIds = this.categorys.filter(category => category.selected)
                                             .map(category => category.id);

  // Prepare form data
  const formData = {
      name: this.brandForm.value.name,
      category: selectedCategoryIds
  };

  if (this.brandId === undefined) {
      // Create brand
      this.brandservice.storeBrand(formData).subscribe(
          (response) => {
              this.commonService.openAlert(response.message);
              this.cancel();
          },
          (err) => {
              this.handleError(err);
          }
      );
  } else {
      // Update brand
      this.brandservice.updateBrand(this.brandId, formData).subscribe(
          (response) => {
              this.commonService.openAlert(response.message);
              this.cancel();
          },
          (err) => {
              this.handleError(err);
          }
      );
  }
}

  handleError(err: any) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 422) {
        const validationErrors = err.error.errors;
        Object.keys(validationErrors).forEach(prop => {
          const formControl = this.brandForm.get(prop);
          if (formControl) {
            formControl.setErrors({
              serverError: validationErrors[prop]
            });
          }
        });
      }
    }
  }

  cancel(): void {
    this.dialog.closeAll();
  }
}
