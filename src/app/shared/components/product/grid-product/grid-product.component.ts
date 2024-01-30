import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-grid-product',
  templateUrl: './grid-product.component.html',
  styleUrls: ['./grid-product.component.css']
})
export class GridProductComponent implements OnInit {

  public SERVER_PATH = environment.REST_API_URL;
  @Input() product: any;
  @Output() productAdded = new EventEmitter();

  addProductToCart(product) {
    this.productAdded.emit(product);
  }

  ngOnInit(){
    
  }

}
