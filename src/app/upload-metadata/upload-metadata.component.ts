import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment.development";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {MatInput} from "@angular/material/input";
import {serverResponse} from "../app.component";


export interface thumbnail{
  content: string;
}
export interface tag{
  name: string
}
export interface videoDetails{
  name: string,
  description: string,
  tags: Set<tag>,
  thumbnail: string,

}
@Component({
  selector: 'app-upload-metadata',
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinner,
    NgForOf,
    NgOptimizedImage,
    Base64ImagePipe,
    ReactiveFormsModule,
    MaterialModule,
    MatInput,
    NgClass
  ],
  templateUrl: './upload-metadata.component.html',
  styleUrl: './upload-metadata.component.css'
})
export class UploadMetadataComponent implements OnInit, OnDestroy{

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private global: GlobalMessengerService) {
  }

  videoId!: string;
  sub!: Subscription;
  fullH1 = "Now it's time for some metadata :)";
  partialH1 = '';
  index = 0;
  thumbnails: thumbnail[] = [];
  metaData = new FormGroup({
    name: new FormControl("",{
      validators: Validators.required,
    }),
    description: new FormControl(""),
    thumbnail: new FormControl("",{
      validators: Validators.required
    }),
    tags: new FormControl("",{
      validators: Validators.required
    })
  })

  selectThumbnail(content: string){
    console.log("Thumbnail clicked")
    this.metaData.controls.thumbnail.setValue(content);

  }

  submit(){
      let tagsNames = this.metaData.controls.tags.value?.split(",");
      let tags: tag[] = [];
      tagsNames!.forEach(tag =>{tags.push({name: tag.trim()})})
      console.log("Tags size: "+tags.length)

      let video = {
        name: this.metaData.controls.name.value,
        description: this.metaData.controls.description.value,
        tags: tags!,
        thumbnail: this.metaData.controls.thumbnail.value
      }
      this.http.post<serverResponse>(environment.backendUrl+"/auth/upload/setMetadata?id="+this.videoId,video)
        .subscribe({
          next: value => {
            this.global.toastMessage.next(['alert-success','Your video has been saved!'])
            this.router.navigate([''])
          },
          error: err => {
            let sR: serverResponse = err.error;
            this.global.toastMessage.next(['alert-warning',sR.message])
          }
        })
    }


  ngOnInit() {
    this.sub = this.activatedRoute.queryParams.subscribe({
      next: value => {
        this.videoId = value['v'];
        console.log("Video ID: "+this.videoId);
      }
    })
    this.http.get<thumbnail[]>(environment.backendUrl+"/auth/upload/getThumbnails?v="+this.videoId)
      .subscribe({
        next: value => {
          this.thumbnails = value;
          this.animateText();
          console.log("Received thumbnails: "+this.thumbnails.length)

        },
        error: err => {
          this.global.toastMessage.next(["alert-warning","An error occured during video processing...."])
        }
      })

  }

  animateText() {
    if (this.index < this.fullH1.length) {
      this.partialH1 += this.fullH1.charAt(this.index);
      this.index++;
      setTimeout(() => this.animateText(), 100);
    } else {
      setTimeout(() => this.resetText(), 2000);
    }
  }

  resetText() {
    this.partialH1 = '';
    this.index = 0;
    setTimeout(() => this.animateText(), 100);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
