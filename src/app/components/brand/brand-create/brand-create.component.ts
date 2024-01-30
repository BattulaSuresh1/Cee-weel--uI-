import { Component, OnInit, ViewChild, Inject } from '@angular/core';
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
  /** USING THIS TO RESET FORM  WITH OUT SHOWING FORMVALIDAITON ERRORS**/
  @ViewChild('myForm', { static: false }) myForm: NgForm;
  public brandForm: FormGroup;

  public brandId: number = undefined;

  public btnText: string = "Create";
  public brand: any;
  public page_length: number = GET_ALL;
  public current_page: number = CURRENT_PAGE;
  public roles: any;
  public user: any;
  constructor(private dialog: MatDialog,
    private commonService: CommonService,
    private fb: FormBuilder,
    private rolesService: RolesService,
    private brandservice: BrandsService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.brandId = data.id;
  }

  name!: string
  // email!: string
  // password!: string
  // errors: any = [];

  ngOnInit(): void {
    this.createbrandForm();
    // this.getRoles(this.current_page, this.page_length);
    this.getUserDetails();
  }

  getUserDetails(): void {
    if (this.brandId != undefined) {
      this.btnText = "Update";
      this.brandservice.showBrandDetails(this.brandId).subscribe(
        (response: any) => {
          console.log(response);
           this.brand = response.data.brand;
           this.user = response.data.brand.name;
          this.brandForm.patchValue({
            name: response.data.brand.name,
            // employe_code: this.user.employe_code,
            // phone: this.user.phone,
            // email: this.sales.email,
            // password: this.sales.password,
          });
        }
      );
    }
  }

  createbrandForm() {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required]],
      // employe_code: ['', [Validators.required]],
      // // phone: ['',[Validators.required]],
    })
  }

  get formValidate() {
    return this.brandForm.controls;
  }

  brandFormSubmit() {

    if (this.brandForm.invalid) {
      return;
    }

    if (this.brandId == undefined) {
      console.log(this.brandForm.value);
      this.brandservice.storeBrand(this.brandForm.value).subscribe(
        (response) => {
          this.brandForm.reset();
          this.myForm.resetForm();
          this.commonService.openAlert(response.message);
          this.cancel();
        },
        (err) => {

          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              const validatonErrors = err.error.errors;
              Object.keys(validatonErrors).forEach(prop => {
                const formControl = this.brandForm.get(prop);
                if (formControl) {
                  formControl.setErrors({
                    serverError: validatonErrors[prop]
                  });
                }
              });
            }
          }
        }
      )

    } else {

      this.brandservice.updateBrand(this.brandId, this.brandForm.value).subscribe(
        (response) => {
          this.commonService.openAlert(response.message);
          this.cancel();
        },
        (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              const validatonErrors = err.error.errors;
              Object.keys(validatonErrors).forEach(prop => {
                const formControl = this.brandForm.get(prop);
                if (formControl) {
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

  cancel(): void {
    this.dialog.closeAll();
  }


}