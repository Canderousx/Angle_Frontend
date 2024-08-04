import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
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
import {F} from "@angular/cdk/keycodes";
import {videoObj} from "../home/home.component";


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
    NgClass,
    MaterialModule
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
  index = 0;
  thumbnails: thumbnail[] = [];
  existingVideo = false;

  metaName = new FormGroup({
    name: new FormControl("",{validators: Validators.required})
  })
  metaDesc = new FormGroup({
    description: new FormControl("",{validators: Validators.required})
  })
  metaTags = new FormGroup({
    tags: new FormControl("",{validators: Validators.required})
  })
  metaThumbnail = new FormGroup({
    thumbnail: new FormControl("",{validators: Validators.required})
  })

  selectThumbnail(content: string){
    console.log("Thumbnail clicked")
    this.metaThumbnail.controls.thumbnail.setValue(content);

  }

  submit(){
    let tagsNames = this.metaTags.controls.tags.value?.split(",");
    let tags: tag[] = [];
    tagsNames!.forEach(tag =>{
      if(tag.length > 0){
        tags.push({name: tag.trim()})
      }
      })
    console.log("Tags size: "+tags.length)

    let video = {
      name: this.metaName.controls.name.value,
      description: this.metaDesc.controls.description.value,
      tags: tags!,
      thumbnail: this.metaThumbnail.controls.thumbnail.value
    }
    this.http.post<serverResponse>(environment.backendUrl+"/upload/setMetadata?id="+this.videoId,video)
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

  setExistingVideo(){
    this.http.get<videoObj>(environment.backendUrl+"/unAuth/videos/getVideo?id="+this.videoId)
      .subscribe({
        next: value => {
          this.metaName.controls.name.setValue(value.name);
          this.metaDesc.controls.description.setValue(value.description);
          let tags = "";
          value.tags.forEach(tag =>{
            console.log(tag.name)
            tags += tag.name+","
          })
          this.metaTags.controls.tags.setValue(tags);
        }
      })
  }


  ngOnInit() {
    this.sub = this.activatedRoute.queryParams.subscribe({
      next: value => {
        this.videoId = value['v'];
        console.log("Video ID: "+this.videoId);
        if(value['existing']){
          console.log("Existing video: true")
          this.existingVideo = true;
          this.setExistingVideo();
        }
      }
    })
    this.http.get<thumbnail[]>(environment.backendUrl+"/upload/getThumbnails?v="+this.videoId)
      .subscribe({
        next: value => {
          this.thumbnails = value;
          console.log("Received thumbnails: "+this.thumbnails.length)

        },
        error: (err : HttpErrorResponse) => {
          if(err.status === 400){
            this.global.toastMessage.next(["alert-warning","Unauthorized!"])
            this.router.navigate([""])
          }else{
            this.global.toastMessage.next(["alert-warning","An error occured during video processing...."])
          }
        }
      })

  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
