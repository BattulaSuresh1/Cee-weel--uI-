import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../auth/services/loader.service';

@Component({
    selector: 'app-table-loader',
    styles:[`
        .forTableLoader{
            display:flex;
            justify-content: center; 
            align-items: start; 
            background: white;
        }
        .forTableLoader img{
            height: 100px;
            width: auto;
        }
      
    `],
    template: `
        <div class="forTableLoader" *ngIf="loading">
           <img src="assets/ajaxloader.gif">
        </div>
    `
})
export class TableLoaderComponent implements OnInit {

    public loading: boolean = true;
    

    constructor(private loaderService: LoaderService) {
      this.loaderService.isTableLoding.subscribe((v) => {
        this.loading = v;
        if(this.loading){
            document.querySelector('.mainLoader').classList.add('forMainLoaderHide');
          }else{
            document.querySelector('.mainLoader').classList.remove('forMainLoaderHide');
          }
      });
    }
    
    ngOnInit(){

    }

}