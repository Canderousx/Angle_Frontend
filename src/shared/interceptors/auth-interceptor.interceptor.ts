import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {catchError} from "rxjs";
import {GlobalMessengerService} from "../services/global-messenger.service";
import {ActivatedRoute, Router} from "@angular/router";

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  let authService = inject(AuthenticationService);
  let global = inject(GlobalMessengerService);
  let loggedIn = !!sessionStorage.getItem("authToken");
  let router = inject(Router)
  if(loggedIn) {
    const authToken = sessionStorage.getItem("authToken");
    const authReq = req.clone({
      headers: req.headers.set('Authentication', 'Bearer ' + authToken)
    });
    return next(authReq).pipe(
      catchError((err: HttpErrorResponse) =>{
        console.log("CAUGHT ERROR: "+err.status)
        if(err.status === 401){
          sessionStorage.removeItem("authToken");
          authService.loggedIn.next(false);
          global.toastMessage.next(['alert-primary',"Your session has expired. Please sign in!"])
          sessionStorage.setItem("prevURL",router.url)
          router.navigate(["/signin"])

        }
        throw err;
      })
    );
  }
  return next(req);
};
