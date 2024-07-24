import {Component, Input, OnInit} from '@angular/core';
import {videoObj} from "../../../app/home/home.component";
import {Router} from "@angular/router";
import {Base64ImagePipe} from "../../pipes/base64-image.pipe";
import {NgClass, NgForOf, NgOptimizedImage} from "@angular/common";
import {RowcutPipe} from "../../pipes/rowcut.pipe";
import {DateFormatPipe} from "../../pipes/date-format.pipe";
import {MatTooltip} from "@angular/material/tooltip";
import {SimpleDatePipe} from "../../pipes/simple-date.pipe";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    Base64ImagePipe,
    NgForOf,
    RowcutPipe,
    DateFormatPipe,
    MatTooltip,
    SimpleDatePipe,
    NgClass,
    MatDivider,
    NgOptimizedImage
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {

  constructor(private router: Router) {
  }

  @Input() videosList!: videoObj[];
  @Input() flexDirection!: string;
  @Input() mainClass!:string;

  watch(id: string){
    this.router.navigate(["/watch"],{queryParams: {v: id}})
  }




}
