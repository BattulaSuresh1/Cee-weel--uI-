import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ViewChild, Inject,  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { PrescriptionService } from '../../../services/prescription.service';
import { CommonService } from '../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
  selector: 'app-prescription-create',
  templateUrl: './prescription-create.component.html',
  styleUrls: ['./prescription-create.component.css']
})
export class PrescriptionCreateComponent implements OnInit,AfterViewChecked {
  @ViewChild('myForm', {static: false}) myForm: NgForm;
  
  public selected:number = 0;

  public prescriptionForm:FormGroup;
  public lensForm:FormGroup;
  public measurementsForm:FormGroup;

  public prescritionTypes:string[] = [];
  public power_measurements:string[] = [];
  public prescriptionValidity:string[] = [];
 // types: string[] = [];
 
  public life_styles:string[] = [];
  public lens_recommendeds:string[] = [];
  public tint_types:string[] = [];
  public mirror_coatings:string[] = [];
  public colours:string[] = [];
  public gradients:string[] = [];

  public diameters:string[] = [];
  public base_curves:string[] = [];
  public vertex_distances:string[] = [];
  public pantascopic_angles:string[] = [];
  public frame_wrap_angles:string[] = [];
  public reading_distances:string[] = [];
  public shapes:string[] = [];
  public productId:number = undefined;

  public prescriptionId:number = undefined;

  public errorMsg:string = "This field is required";
  public validation:boolean = false;

  public customerId:string|number = this.authenticationService.getCustomerId()
  
  public buttonText:string = "Create";

  constructor(
    private dialog: MatDialog,
    private fb:FormBuilder,
    private prescriptionService:PrescriptionService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService, 
    private authenticationService: AuthenticationService,
    @Inject (MAT_DIALOG_DATA) public data: any,
   
  ) { 
    // this.productId = data.id
  }

  ngOnInit(): void {

    this.createForm();
    // this.createLensForm();
    // this.createMeasurementsForm();
    this.getDetails();
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
 }

  getDetails():void{
    if(this.productId == undefined){

        this.prescriptionService.createPrescription().subscribe(
        (res:any) => {
          this.prescritionTypes = res.data.prescritionTypes;
          this.power_measurements = res.data.power_measurements;
          this.prescriptionValidity = res.data.prescriptionValidity;
          this.life_styles = res.data.life_styles;
          this.lens_recommendeds = res.data.lens_recommendeds;
          this.tint_types = res.data.tint_types;
          this.mirror_coatings = res.data.mirror_coatings;
          this.colours = res.data.tint_colors;
          this.gradients = res.data.tint_gradients;

          this.diameters = res.data.diameters;
          this.base_curves = res.data.base_curves;
          this.vertex_distances = res.data.vertex_distances;
          this.pantascopic_angles = res.data.pantascopic_angles;
          this.frame_wrap_angles = res.data.frame_wrap_angles;
          this.reading_distances = res.data.reading_distances;
          this.shapes = res.data.shapes;
          //this.types = res.data.type;

          this.copyPrescription();
        },
        (err) => {
          console.log(err);
        }
      )

    }
    else{
      this.buttonText = "Update";
      
    }
  }

  copyPrescription(){
    let prescription = this.data.prescription;
    if(prescription != ''){

      const rightEye = {};
      const leftEye = {};

      const contact_lensrightEye = {};
      const contact_lensleftEye = {} ;

      for(let power of prescription.lenspower){
          if(power.eye_type == "right_eye") {

            if(power.category == "distance") {
              rightEye['distance'] = {
                sphere:  power.sph,
                cylinder:  power.cyl,
                axis:  power.axis,
                prism:  power.prism,
                add:  power.add,
                pd:  power.pd,
              };

            } else if(power.category == "near"){
              rightEye['near'] = {
                sphere:  power.sph,
                cylinder:  power.cyl,
                axis:  power.axis,
                prism:  power.prism,
                add:  power.add,
                pd:  power.pd,
              };
            }

            contact_lensrightEye['bc'] = power.bc;
            contact_lensrightEye['dia'] = power.dia;
            contact_lensrightEye['sph'] = power.sph;
            contact_lensrightEye['cyl'] = power.cyl;
            contact_lensrightEye['axis'] = power.axis;

          }else if(power.eye_type == "left_eye") {

            if(power.category == "distance") {
              leftEye['distance'] = {
                sphere:  power.sph,
                cylinder:  power.cyl,
                axis:  power.axis,
                prism:  power.prism,
                add:  power.add,
                pd:  power.pd,
              };

            } else if(power.category == "near"){
              leftEye['near'] = {
                sphere:  power.sph,
                cylinder:  power.cyl,
                axis:  power.axis,
                prism:  power.prism,
                add:  power.add,
                pd:  power.pd,
              };
            }

            contact_lensleftEye['bc'] = power.bc;
            contact_lensleftEye['dia'] = power.dia;
            contact_lensleftEye['sph'] = power.sph;
            contact_lensleftEye['cyl'] = power.cyl;
            contact_lensleftEye['axis'] = power.axis;

          }
      }

      console.log(leftEye)
      console.log(rightEye)
      console.log(contact_lensrightEye)
      console.log(contact_lensleftEye)

      this.prescriptionForm.patchValue({
        prescritionType: prescription.lens_type,
        prescriptionValidity: prescription.validity,
        prescribed_by: prescription.given_by,
        remarks: prescription.remarks,
        attachment: prescription.attachment,
        ophthalmic_lens: {
          right_eye : rightEye,
          left_eye : leftEye
        },

      // Contact Lens //
        contact_lens: {
          right_eye : contact_lensrightEye,
          left_eye : contact_lensleftEye
        }
      });

      console.log(this.prescriptionForm.value)
    }
  }
 


  createForm():void{
    this.prescriptionForm = this.fb.group({
      prescritionType:["Ophthalmic Lens",[Validators.required]],
      prescriptionValidity: ["",[Validators.required]],
      ophthalmic_lens: this.fb.group({
          right_eye : this.fb.group({
            distance: this.fb.group({
              sphere: [""],
              cylinder: [""],
              axis: [""],
              prism: [""],
              add: [""],
              pd: [""]
            }),
            near: this.fb.group({
              sphere: [""],
              cylinder: [""],
              axis: [""],
              prism: [""],
              add: [""],
              pd: [""]
            }),
          }),
          left_eye: this.fb.group({
            distance: this.fb.group({
              sphere: [""],
              cylinder: [""],
              axis: [""],
              prism: [""],
              add: [""],
              pd: [""]
            }),
            near: this.fb.group({
              sphere: [""],
              cylinder: [""],
              axis: [""],
              prism: [""],
              add: [""],
              pd: [""]
            }),
           })
          
      }),
      contact_lens: this.fb.group({
        right_eye : this.fb.group({
          bc: [""],
          dia: [""],
          sph: [""],
          cyl: [""],
          axis: [""],
        }),
        left_eye: this.fb.group({
          bc: [""],
          dia: [""],
          sph: [""],
          cyl: [""],
          axis: [""],
        })
      }),
      prescribed_by: ["",[Validators.required]],
      attachment: [''],
      remarks: [""]

    });
  }

  get formValidate(){ return this.prescriptionForm.controls; }

  get rightEyeDistanceValidate(){ return this.formValidate.ophthalmic_lens.get("right_eye").get("distance")['controls']; }
  get rightEyeNearValidate(){ return this.formValidate.ophthalmic_lens.get("right_eye").get("near")['controls']; }
  get leftEyeDistanceValidate(){ return this.formValidate.ophthalmic_lens.get("left_eye").get("distance")['controls']; }
  get leftEyeNearValidate(){ return this.formValidate.ophthalmic_lens.get("left_eye").get("near")['controls']; }

  get contactLensRightEyeValidate(){ return this.formValidate.contact_lens.get("right_eye")["controls"]; }
  get contactLensLeftEyeValidate(){ return this.formValidate.contact_lens.get("left_eye")["controls"]; }

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
      reading_distance: ["",[Validators.required]],
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

  get precalRightValuesValidate(){ return this.measurementsFormValidate.precal_values.get("right_value")["controls"]; }
  get precalLeftValuesValidate(){ return this.measurementsFormValidate.precal_values.get("left_value")["controls"]; }

  get centerThicknessValidate(){ return this.measurementsFormValidate.thickness.get("center_thickness")["controls"]; }
  get noseEdgeThicknessValidate(){ return this.measurementsFormValidate.thickness.get("nose_edge_thickness")["controls"]; }
  get templeEdgeThicknessValidate(){ return this.measurementsFormValidate.thickness.get("temple_edge_thickness")["controls"]; }

  get lensSizeValidate(){ return this.measurementsFormValidate.lens_size["controls"]; }
 
  createLensForm():void{
    this.lensForm = this.fb.group({
        life_style: ["",[Validators.required]],
        lens_recommended: ["",[Validators.required]],
        tint_type: ["",[Validators.required]],
        mirror_coating: ["",[Validators.required]],
        colour: ["",[Validators.required]],
        gradient: ["",[Validators.required]],
    });
  }

  get lensFormValidate(){ return this.lensForm.controls; }

  precriptionFormSubmit(){
    if(this.prescriptionForm.invalid || this.isItemTypeValidate()){
      return;
    }

    if(this.prescriptionId == undefined){

      let params = {
        'power_details': this.prescriptionForm.value,
        // 'measurements': this.measurementsForm.value,
        // 'lens': this.lensForm.value,
        'customer_id': this.customerId
      };

      this.prescriptionService.storePrescription(params).subscribe(
        (response)=>{
            // this.prescriptionForm.reset();
            // this.myForm.resetForm();
            // this.commonService.openAlert(response.message); 
            // this.createForm();
            this.commonService.openAlert(response.message); 
            this.cancel();
        },
        (err)=>{ 

            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.prescriptionForm.get(prop);
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
      this.prescriptionService.updatePrescription(this.productId,this.prescriptionForm.value).subscribe(
        (response)=>{
            this.commonService.openAlert(response.message); 
            this.cancel();
        },
        (err)=>{ 
            if (err instanceof HttpErrorResponse) {
              if(err.status === 422) {
                const validatonErrors = err.error.errors;
                Object.keys(validatonErrors).forEach( prop => {
                  const formControl = this.prescriptionForm.get(prop);
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

  prescriptionTypeChange(type:string){
    //  if(type === "Ophthalmic Lens"){
    //   this.prescriptionForm.controls.ophthalmic_lens.enable();
    //   this.prescriptionForm.controls.contact_lens.disable();
    //   this.ophthalmicLensValidation([Validators.required]);
    //   this.contactLensValidations(null);

    // }else{
    //   this.prescriptionForm.controls.contact_lens.enable();
    //   this.prescriptionForm.controls.ophthalmic_lens.disable();
    //   this.ophthalmicLensValidation(null);
    //   this.contactLensValidations([Validators.required]);
      
    // } 
  }

  isItemTypeValidate():boolean {
     this.validation = true;

    if(this.prescriptionForm.value.prescritionType == "Ophthalmic Lens"){

      if(
        this.rightEyeDistanceValidate.sphere.value != "" ||
        this.rightEyeDistanceValidate.cylinder.value != "" ||
        this.rightEyeDistanceValidate.axis.value != "" ||
        this.rightEyeDistanceValidate.prism.value != "" ||
        this.rightEyeDistanceValidate.add.value != "" ||
        this.rightEyeDistanceValidate.pd.value != "" ||

        this.rightEyeNearValidate.sphere.value != "" ||
        this.rightEyeNearValidate.cylinder.value != "" ||
        this.rightEyeNearValidate.axis.value != "" ||
        this.rightEyeNearValidate.prism.value != "" ||
        this.rightEyeNearValidate.add.value != "" ||
        this.rightEyeNearValidate.pd.value != "" ||

        this.leftEyeDistanceValidate.sphere.value != "" ||
        this.leftEyeDistanceValidate.cylinder.value != "" ||
        this.leftEyeDistanceValidate.axis.value != "" ||
        this.leftEyeDistanceValidate.prism.value != "" ||
        this.leftEyeDistanceValidate.add.value != "" ||
        this.leftEyeDistanceValidate.pd.value != "" ||

        this.leftEyeNearValidate.sphere.value != "" ||
        this.leftEyeNearValidate.cylinder.value != "" ||
        this.leftEyeNearValidate.axis.value != "" ||
        this.leftEyeNearValidate.prism.value != "" ||
        this.leftEyeNearValidate.add.value != "" ||
        this.leftEyeNearValidate.pd.value != "" 
      ){
        this.validation = false;
      }

    }else{

      if(
        this.contactLensRightEyeValidate.dia.value != "" ||
        this.contactLensRightEyeValidate.bc.value != "" ||
        this.contactLensRightEyeValidate.sph.value != "" ||
        this.contactLensRightEyeValidate.cyl.value != "" ||
        this.contactLensRightEyeValidate.axis.value != "" ||
        this.contactLensLeftEyeValidate.bc.value != "" ||
        this.contactLensLeftEyeValidate.dia.value != "" ||
        this.contactLensLeftEyeValidate.sph.value != "" ||
        this.contactLensLeftEyeValidate.cyl.value != "" ||
        this.contactLensLeftEyeValidate.axis.value != "" 
        
        ){
          this.validation = false;
        }
    }
    return this.validation;
  }

  private contactLensValidations(validation=null){
    this.contactLensRightEyeValidate.bc.setValidators(validation);
    this.contactLensRightEyeValidate.dia.setValidators(validation);
    this.contactLensRightEyeValidate.sph.setValidators(validation);
    this.contactLensRightEyeValidate.cyl.setValidators(validation);
    this.contactLensRightEyeValidate.axis.setValidators(validation);

    this.contactLensLeftEyeValidate.bc.setValidators(validation);
    this.contactLensLeftEyeValidate.dia.setValidators(validation);
    this.contactLensLeftEyeValidate.sph.setValidators(validation);
    this.contactLensLeftEyeValidate.cyl.setValidators(validation);
    this.contactLensLeftEyeValidate.axis.setValidators(validation);

    this.contactLensRightEyeValidate.bc.updateValueAndValidity();
    this.contactLensRightEyeValidate.dia.updateValueAndValidity();
    this.contactLensRightEyeValidate.sph.updateValueAndValidity();
    this.contactLensRightEyeValidate.cyl.updateValueAndValidity();
    this.contactLensRightEyeValidate.axis.updateValueAndValidity();

    this.contactLensLeftEyeValidate.bc.updateValueAndValidity();
    this.contactLensLeftEyeValidate.dia.updateValueAndValidity();
    this.contactLensLeftEyeValidate.sph.updateValueAndValidity();
    this.contactLensLeftEyeValidate.cyl.updateValueAndValidity();
    this.contactLensLeftEyeValidate.axis.updateValueAndValidity();
  }

  private ophthalmicLensValidation(validation= null){
    this.rightEyeDistanceValidate.sphere.setValidators(validation);
    this.rightEyeDistanceValidate.cylinder.setValidators(validation);
    this.rightEyeDistanceValidate.axis.setValidators(validation);
    this.rightEyeDistanceValidate.prism.setValidators(validation);
    this.rightEyeDistanceValidate.add.setValidators(validation);
    this.rightEyeDistanceValidate.pd.setValidators(validation);

    this.rightEyeNearValidate.sphere.setValidators(validation);
    this.rightEyeNearValidate.cylinder.setValidators(validation);
    this.rightEyeNearValidate.axis.setValidators(validation);
    this.rightEyeNearValidate.prism.setValidators(validation);
    this.rightEyeNearValidate.add.setValidators(validation);
    this.rightEyeNearValidate.pd.setValidators(validation);

    this.leftEyeDistanceValidate.sphere.setValidators(validation);
    this.leftEyeDistanceValidate.cylinder.setValidators(validation);
    this.leftEyeDistanceValidate.axis.setValidators(validation);
    this.leftEyeDistanceValidate.prism.setValidators(validation);
    this.leftEyeDistanceValidate.add.setValidators(validation);
    this.leftEyeDistanceValidate.pd.setValidators(validation);

    this.leftEyeNearValidate.sphere.setValidators(validation);
    this.leftEyeNearValidate.cylinder.setValidators(validation);
    this.leftEyeNearValidate.axis.setValidators(validation);
    this.leftEyeNearValidate.prism.setValidators(validation);
    this.leftEyeNearValidate.add.setValidators(validation);
    this.leftEyeNearValidate.pd.setValidators(validation);

    this.rightEyeDistanceValidate.sphere.updateValueAndValidity();
    this.rightEyeDistanceValidate.cylinder.updateValueAndValidity();
    this.rightEyeDistanceValidate.axis.updateValueAndValidity();
    this.rightEyeDistanceValidate.prism.updateValueAndValidity();
    this.rightEyeDistanceValidate.add.updateValueAndValidity();
    this.rightEyeDistanceValidate.pd.updateValueAndValidity();

    this.rightEyeNearValidate.sphere.updateValueAndValidity();
    this.rightEyeNearValidate.cylinder.updateValueAndValidity();
    this.rightEyeNearValidate.axis.updateValueAndValidity();
    this.rightEyeNearValidate.prism.updateValueAndValidity();
    this.rightEyeNearValidate.add.updateValueAndValidity();
    this.rightEyeNearValidate.pd.updateValueAndValidity();

    this.leftEyeDistanceValidate.sphere.updateValueAndValidity();
    this.leftEyeDistanceValidate.cylinder.updateValueAndValidity();
    this.leftEyeDistanceValidate.axis.updateValueAndValidity();
    this.leftEyeDistanceValidate.prism.updateValueAndValidity();
    this.leftEyeDistanceValidate.add.updateValueAndValidity();
    this.leftEyeDistanceValidate.pd.updateValueAndValidity();

    this.leftEyeNearValidate.sphere.updateValueAndValidity();
    this.leftEyeNearValidate.cylinder.updateValueAndValidity();
    this.leftEyeNearValidate.axis.updateValueAndValidity();
    this.leftEyeNearValidate.prism.updateValueAndValidity();
    this.leftEyeNearValidate.add.updateValueAndValidity();
    this.leftEyeNearValidate.pd.updateValueAndValidity();
  }

  addAttachment(fileName:any){
    this.prescriptionForm.patchValue({attachment: fileName})
  }


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

  cancel():void{
    this.dialog.closeAll();
  }

  tabChange(input:number = 0){
    this.selected = input;
  }

}
