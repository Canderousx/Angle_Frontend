import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {ageValidator} from "../../shared/validators/ageValidator";
import {fadeInOut} from "../../shared/animations/fadeInOut";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {HttpClient} from "@angular/common/http";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../app.component";
import {Router} from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {UsernameValidatorService} from "../../shared/validators/UsernameValidatorService";

export interface signUpReq{
  username: string,
  password: string,
  email: string;
  birthDate: Date,
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  animations: [fadeInOut],
  imports: [
    FormsModule,
    MatInput,
    NgIf,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  constructor(private http: HttpClient,
              private global: GlobalMessengerService,
              private router: Router,
              private usernameValidator: UsernameValidatorService) {
  }

  signForm = new FormGroup({
    username: new FormControl("", {
      validators: [Validators.required, Validators.minLength(4)],
      asyncValidators: [this.usernameValidator.usernameExists()],
      updateOn: 'blur'
    }),
    password: new FormControl("",Validators.compose([Validators.required,Validators.minLength(8)])),
    email: new FormControl("",{
      validators: [Validators.required,Validators.email],
      asyncValidators: [this.usernameValidator.emailExists()],
      updateOn: 'blur'
    }),
    birthDate: new FormControl("",Validators.compose([Validators.required,ageValidator]))
  })

  submit(){
    let account = {username: this.signForm.controls.username.value,
    password: this.signForm.controls.password.value,
    email: this.signForm.controls.email.value,
    birthDate: this.signForm.controls.birthDate.value?.toString()}
    this.http.post<serverResponse>(environment.backendUrl+"/unAuth/signup",account)
      .subscribe({
        next: value => {
          this.global.toastMessage.next(["alert-success",value.message])
          this.router.navigate([""]);
        },
        error: err => {
          let errMsg: string  = err.error();
          this.global.toastMessage.next(["alert-danger",errMsg])
        }
      })

  }

}
