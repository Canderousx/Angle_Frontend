import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {catchError, map, Observable, of} from "rxjs";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Injectable({ providedIn: 'root' })
export class UsernameValidatorService {
  constructor(private http: HttpClient) {}

  // Metoda zwracająca funkcję spełniającą AsyncValidatorFn
  usernameExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>{
      if (!control.value) {
        return of(null);
      }
      return this.http.post<serverResponse>(`${environment.backendUrl}/unAuth/signup/checkUsername`,control.value, {observe: "response"})
        .pipe(
          map(response =>{
            if(response.status === 200){
              return null;
            }
            return {usernameExists: true}
          }),
          catchError(error => {
            if (error.status === 400 || error.status === 409) {
              return of({ usernameExists: true });
            }
            return of(null);
          })
        )
    };
  }

  emailExists(): AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.http.post<serverResponse>(`${environment.backendUrl}/unAuth/signup/checkEmail`,control.value,{observe: "response"})
        .pipe(
          map( response =>{
            if(response.status === 200){
              return null;
            }
            return {emailExists: true};
          }),
          catchError(error =>{
            return of({emailExists:true});
          })
        )

    };
  }





}
