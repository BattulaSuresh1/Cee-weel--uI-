import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from '../../auth/services/authentication.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  public userDetails = this.authenticationService.getUserDetails();
  
  public parentId = "";
  public scrollbarConfig: PerfectScrollbarConfigInterface;

  public ROLE_ID:string = this.authenticationService.getRoleId();
  public MENU_PERMISSIONS:any = this.authenticationService.getMenuPermissions();

   /*  public MENU_PERMISSIONS:any  = {
      'ROLE_MENUS': ['ROLE_CREATE','ROLE_UPDATE','ROLE_DELETE','ROLE_VIEW','ROLE_LIST'], 
      'USER_MENUS': ['USER_CREATE','USER_UPDATE','USER_DELETE','USER_VIEW','USER_LIST'], 
      'CUSTOMER_MENUS': ['CUSTOMER_CREATE','CUSTOMER_UPDATE','CUSTOMER_DELETE','CUSTOMER_VIEW','CUSTOMER_LIST'], 
      'PRODUCT_MENUS': ['PRODUCT_CREATE','PRODUCT_UPDATE','PRODUCT_DELETE','PRODUCT_VIEW','PRODUCT_LIST'], 
      'SUPPLIER_MENUS': ['SUPPLIER_CREATE','SUPPLIER_UPDATE','SUPPLIER_DELETE','SUPPLIER_VIEW','SUPPLIER_LIST'], 
    } */


  clickedMenu(event) {
    var target = event.currentTarget;
    let parentId = target.id;
    if (parentId == this.parentId) {
      this.parentId = "";
    } else {
      this.parentId = target.id;
    }
  }

  constructor(private authenticationService:AuthenticationService) { }

  ngOnInit() {
    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}
