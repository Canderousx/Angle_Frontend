import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {catchError} from "rxjs";
import {GlobalMessengerService} from "../services/global-messenger.service";

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  let authService = inject(AuthenticationService);
  let global = inject(GlobalMessengerService);
  let loggedIn = !!sessionStorage.getItem("authToken");
  if(loggedIn) {
    const authToken = sessionStorage.getItem("authToken");
    const authReq = req.clone({
      headers: req.headers.set('Authentication', 'Bearer ' + authToken)
    });
    return next(authReq).pipe(
      catchError((err: HttpErrorResponse) =>{
        if(err.status === 666){
          authService.loggedIn.next(false);
          global.toastMessage.next(['alert-warning',"Your session has expired. Please sign in"])

        }
        throw err;
      })
    );
  }
  return next(req);
};
