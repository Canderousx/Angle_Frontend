import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {fadeInOut} from "../../shared/animations/fadeInOut";
import {ageValidator} from "../../shared/validators/ageValidator";
import {environment} from "../../environments/environment.development";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {Router, RouterLink} from "@angular/router";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {HttpErrorResponse} from "@angular/common/http";
import {serverResponse} from "../app.component";
import {Title} from "@angular/platform-browser";

export interface authRes{
  authToken: string;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  animations: [fadeInOut],
  imports: [MaterialModule, MatInput, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit{

  constructor(private authService: AuthenticationService,
              private router: Router,
              private global: GlobalMessengerService,
              private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle("Angle: Sign In")
    this.authService.logout();
  }

  signForm = new FormGroup({
    email: new FormControl("",Validators.compose([Validators.required,Validators.email])),
    password: new FormControl("",Validators.required)
  })

  submit(){
    this.authService.authenticate({email:this.signForm.controls.email.value!,
    password:this.signForm.controls.password.value!})
      .subscribe({
        next: value => {
          localStorage.setItem("authToken",value.authToken)
          this.authService.loggedIn.next(true);
          this.authService.getCurrentUser();
          this.global.toastMessage.next(["alert-primary","You've been logged in! Welcome to the Angle!"])
          if(!!localStorage.getItem("prevURL")){
            let url = localStorage.getItem("prevURL") as string;
            localStorage.removeItem("prevURL")
            this.router.navigateByUrl(url);
          }else{
            this.router.navigate([''])
          }

        },
        error: err =>{
          let error: serverResponse = err.error;
          this.global.toastMessage.next(["alert-danger",error.message])
        }
      })

  }




}
