import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeterialsModule } from './modules/meterials/meterials.module';
import { LoaderComponent } from './components/loader/loader.component';
import { TableLoaderComponent } from './components/loader/tableLoader.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { PermissionsDirective } from './directive/permissions.directive';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CartItemComponent } from './components/cart/cart-item/cart-item.component';
import { GridProductComponent } from './components/product/grid-product/grid-product.component';


@NgModule({
  declarations: [
    LoaderComponent,
    TableLoaderComponent,
    AlertsComponent,
    ConfirmDialogComponent,
    PermissionsDirective,
    FileUploadComponent,
    ProductComponent,
    CartComponent,
    CartItemComponent,
    GridProductComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MeterialsModule,
    NgbModule,
    ChartsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'TOKEN', // Optionnal, can also be set per map (accessToken input of mgl-map)
      geocoderAccessToken: 'TOKEN' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    })
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MeterialsModule,
    NgbModule,
    ChartsModule,
    NgxMapboxGLModule,
    LoaderComponent,
    TableLoaderComponent,
    AlertsComponent,
    ConfirmDialogComponent,
    PermissionsDirective,
    FileUploadComponent,
    ProductComponent,
    CartComponent,
    CartItemComponent,
    GridProductComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
