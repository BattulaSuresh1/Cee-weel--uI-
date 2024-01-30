import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private authService:AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(this.authService.isLoggedIn()){
        const token = localStorage.getItem('access_token');
        req = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`
          },
        });
    }
    return next.handle(req).pipe(catchError(err => { 
      console.log(`error :: `,err);

      if (err.status === 401) {
          // auto logout if 401 response returned from api
         console.log(`error :: `,err.status);
          this.authService.logout();
      } 
      else if(err.status === 500)
      {
      }
  
      return throwError(err);
  }))
}

  }
