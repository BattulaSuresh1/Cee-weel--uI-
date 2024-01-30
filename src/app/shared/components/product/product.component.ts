import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  public SERVER_PATH = environment.REST_API_URL;
  @Input() product: any;
  @Output() productAdded = new EventEmitter();

  addProductToCart(product) {
    this.productAdded.emit(product);
  }

  ngOnInit(){
    
  }

}
