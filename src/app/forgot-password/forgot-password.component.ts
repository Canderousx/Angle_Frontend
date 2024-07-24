import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {serverResponse} from "../app.component";
import {environment} from "../../environments/environment.development";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    NgIf,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(private http: HttpClient,
              private global: GlobalMessengerService) {}

  emailForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,Validators.email])),
  })

  submit(){
    this.http.post<serverResponse>(environment.backendUrl+"/unAuth/passwordRecovery",
      this.emailForm.controls.email.value).subscribe({
      next: value => {
        this.global.toastMessage.next(['alert-primary',value.message])
      }
    })
  }



}
