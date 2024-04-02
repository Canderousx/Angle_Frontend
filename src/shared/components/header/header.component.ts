import {Component, Input} from '@angular/core';
import {MaterialModule} from "../../modules/material/material.module";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MouseEnterDirective} from "../../directives/mouse-enter.directive";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, NgOptimizedImage, MouseEnterDirective, NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input()loggedIn!: boolean;


}
