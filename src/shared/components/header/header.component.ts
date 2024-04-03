import {Component, Input} from '@angular/core';
import {MaterialModule} from "../../modules/material/material.module";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MouseEnterDirective} from "../../directives/mouse-enter.directive";
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, NgOptimizedImage, MouseEnterDirective, NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private auth: AuthenticationService,
              private router: Router) {
  }

  @Input()loggedIn!: boolean;

  logout(){
    this.auth.logout();
    this.router.navigate([""]);
  }

  myChannel(){
    this.auth.getUserId().subscribe({
      next: value => {
        this.router.navigate(["/channel"],{queryParams: {id: value.message}})
      }
    })
  }


}
