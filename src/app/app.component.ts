import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public layoutOption: string;
  showHeader:boolean = true;
  showFooter:boolean = true;

  constructor(private router: Router) {
    // Removing Sidebar, Navbar, Footer for Documentation, Error and Auth pages
    router.events.forEach((event) => { 
      if(event instanceof NavigationStart) {
        // alert(event['url']);
        if((event['url'] == '/') || (event['url'] == '/login') || (event['url'] == '/general-pages/signup') || (event['url'] == '/general-pages/page-404') ) {
          this.showHeader = false;
          this.showFooter = false;
        } else {
          this.showHeader = true;
          this.showFooter = true;
        }

        if(window.matchMedia('(max-width: 991px)').matches) {
          document.querySelector('body').classList.remove('az-sidebar-show');
        }
      }
    });
  }

  ngOnInit() {

    // navbar backdrop for mobile only
    const navbarBackdrop = document.createElement('div');
    navbarBackdrop.classList.add('az-navbar-backdrop');
    document.querySelector('body').appendChild(navbarBackdrop);
    navbarBackdrop.addEventListener('click', () => {
      document.querySelector('body').classList.toggle('az-sidebar-show');
    });
  }
}
