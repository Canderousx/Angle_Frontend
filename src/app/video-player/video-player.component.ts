import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";
import {VgControlsModule} from "@videogular/ngx-videogular/controls";
import {BitrateOptions, VgApiService, VgCoreModule} from "@videogular/ngx-videogular/core";
import {VgOverlayPlayModule} from "@videogular/ngx-videogular/overlay-play";
import {VgBufferingModule} from "@videogular/ngx-videogular/buffering";
import Hls from 'hls.js';
import {VgStreamingModule} from "@videogular/ngx-videogular/streaming";
import {MaterialModule} from "../../shared/modules/material/material.module";


@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    NgIf,
    VgControlsModule,
    VgCoreModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    MaterialModule
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges{

  constructor(private global: GlobalMessengerService,
              private activatedRoute: ActivatedRoute) {


  }
  @Input()videoId!: string;
  @Input()videoURL!: string;
  showPlayer = true;
  api: VgApiService = new VgApiService();
  qualities: BitrateOptions[] = [];
  @ViewChild('media') media: any;

  onPlayerReady(source: VgApiService){
    this.api = source;
    console.log("On Player Ready");
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(
      this.autoplay.bind(this)
    )
    if(localStorage.getItem("volume")){
      this.api.volume = +localStorage.getItem("volume")!;
    }
    this.api.getDefaultMedia().subscriptions.volumeChange.subscribe(
      this.onVolumeChange.bind(this)
    );
  }

  onVolumeChange(event: any) {
    console.log("Volume changed!");
    localStorage.setItem("volume",this.api.volume);
  }


  ngOnChanges(changes: SimpleChanges) {
    if(changes['videoId'] && !changes['videoId'].isFirstChange()){
      this.setBitrates();
      this.reloadPlayer();
    }

  }

  reloadPlayer(){
    this.showPlayer = false;
    setTimeout(() => {
      this.showPlayer = true;
    }, 50);

  }


  autoplay(){
    console.log("play")
    this.api.play();
    this.setBitrates();
  }

  setBitrates(){
    if(this.qualities.length === 0){
      console.log("Error: Couldn't set Bitrates, as qualities is null!")
      return
    }
    console.log("Qualities loaded")
    for(let bitrate of this.qualities){
      switch (bitrate.label){
        case "1681":
          bitrate.label = "480p";
          break;
        case "3291":
          bitrate.label = "720p";
          break;
        case "5711":
          bitrate.label = "1080p";
          break;
      }
    }
  }

  ngAfterViewInit() {
    this.setBitrates();
  }

  ngOnInit() {
  }



  ngOnDestroy() {
  }

}
