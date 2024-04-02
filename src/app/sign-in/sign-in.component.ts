import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {fadeInOut} from "../../shared/animations/fadeInOut";
import {ageValidator} from "../../shared/validators/ageValidator";
import {environment} from "../../environments/environment.development";



@Component({
  selector: 'app-sign-in',
  standalone: true,
  animations: [fadeInOut],
  imports: [MaterialModule, MatInput, ReactiveFormsModule, NgIf],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {




}
