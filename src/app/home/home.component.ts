import {Component, HostListener, OnInit} from '@angular/core';
import {tag} from "../upload-metadata/upload-metadata.component";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {NgForOf, NgIf} from "@angular/common";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {RouterLink} from "@angular/router";
import {FeedComponent} from "../../shared/components/feed/feed.component";
import {MatDivider} from "@angular/material/divider";
import {Title} from "@angular/platform-browser";
import {VideoService} from "../../shared/services/video.service";

export interface videoObj{
  id: string,
  name: string,
  datePublished: Date,
  tags: tag[],
  description: string,
  views: number,
  likes: number,
  dislikes: number,
  authorId: string,
  hlsPath: string,
  thumbnail: string,
  isBanned: boolean,
  authorAvatar: string,
  processing: boolean,
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    Base64ImagePipe,
    RouterLink,
    FeedComponent,
    MatDivider
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private videoService: VideoService,
              private global: GlobalMessengerService,
              private titleService: Title) {
  }

  latestVideos: videoObj[] = [];
  mostPopular: videoObj[] = [];
  loaded = false;
  fromSubsVideos: videoObj[] = [];
  pageNum = 0;
  subPageNum = 0;
  loggedIn!: boolean;

  loadLatest(){
    this.videoService.getLatestVideos(this.pageNum).subscribe({
        next: value => {
          this.latestVideos = this.latestVideos.concat(value.content);
          console.log("Videos received: "+this.latestVideos.length)
          this.loaded = true;
        },
        error: err => {
          console.log(err.error)
          this.global.toastMessage.next(["alert-warning","Internal Server Error. Please try again later"])
        }
      })
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.pageNum+=1;

      this.loadLatest();
    }
  }




  ngOnInit() {
    this.loggedIn = !!localStorage.getItem("authToken");
    this.loaded = false;
    this.titleService.setTitle("Angle")


    this.videoService.getMostPopular().subscribe({
        next: value => {
          console.log("Popular received: "+value.length)
          this.mostPopular = value;
        }
      })

    this.loadLatest();
        this.videoService.getBySubscribers(this.subPageNum).subscribe({
        next: value => {
          console.log("Subs videos received: "+value.content.length)
          this.fromSubsVideos = value.content;
        }
      })

  }

}
