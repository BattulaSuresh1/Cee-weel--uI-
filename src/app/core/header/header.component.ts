import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../auth/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public userDetails = this.authenticationService.getUserDetails();

  public totalCartItems:any = 0;

  constructor(private authenticationService:AuthenticationService) { }

  ngOnInit(): void {
     this.authenticationService.getTotalCartItems().subscribe(
      (v:any) => {
        this.totalCartItems = v | 0;
      }
    );
  }
  closeMenu(e) {
    e.target.closest('.dropdown').classList.remove('show');
    e.target.closest('.dropdown .dropdown-menu').classList.remove('show');
  }

  toggleSidebar(event) {
    event.preventDefault();
    if(window.matchMedia('(min-width: 992px)').matches) {
      document.querySelector('body').classList.toggle('az-sidebar-hide');
    } else {
      document.querySelector('body').classList.toggle('az-sidebar-show');
    }
  }

  logout():void{
    this.authenticationService.logout();
  }

}
