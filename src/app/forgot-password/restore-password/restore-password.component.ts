import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {serverResponse} from "../../app.component";
import {environment} from "../../../environments/environment.development";
import {GlobalMessengerService} from "../../../shared/services/global-messenger.service";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-restore-password',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './restore-password.component.html',
  styleUrl: './restore-password.component.css'
})
export class RestorePasswordComponent implements OnInit, OnDestroy{

  token!: string;
  sub!: Subscription;
  passwordForm = new FormGroup({
    password: new FormControl("",Validators.compose([Validators.required,Validators.minLength(8)])),
  })

  constructor(private http: HttpClient, private router: Router,
              private activatedRoute: ActivatedRoute,
              private global: GlobalMessengerService) {}

  ngOnInit() {
    this.sub = this.activatedRoute.queryParams
      .subscribe({
        next: value => {
          this.token = value['id'];
        }
      })

  }

  submit(){
    this.http.post<serverResponse>(environment.backendUrl+"/unAuth/restorePassword",
      {newPassword: this.passwordForm.controls.password.value, token: this.token},)
      .subscribe({
        next: value => {
          this.global.toastMessage.next(['alert-primary',value.message])
          this.router.navigate(["/"])
        },
        error: err => {
          let msg: serverResponse = err.error;
          this.global.toastMessage.next(['alert-danger',msg.message])
          this.router.navigate(["/forgotPassword"])
        }
      })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
