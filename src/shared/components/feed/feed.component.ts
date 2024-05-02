import {Component, Input, OnInit} from '@angular/core';
import {videoObj} from "../../../app/home/home.component";
import {Router} from "@angular/router";
import {Base64ImagePipe} from "../../pipes/base64-image.pipe";
import {NgForOf} from "@angular/common";
import {RowcutPipe} from "../../pipes/rowcut.pipe";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    Base64ImagePipe,
    NgForOf,
    RowcutPipe
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {

  constructor(private router: Router) {
  }

  @Input() videosList!: videoObj[];

  watch(id: string){
    this.router.navigate(["/watch"],{queryParams: {v: id}})
  }




}
