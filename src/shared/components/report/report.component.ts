import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {videoObj} from "../../../app/home/home.component";
import {NgForOf, NgIf} from "@angular/common";
import {Comment} from "../../models/comment";
import {FeedComponent} from "../feed/feed.component";
import {Base64ImagePipe} from "../../pipes/base64-image.pipe";
import {DateFormatPipe} from "../../pipes/date-format.pipe";
import {RowcutPipe} from "../../pipes/rowcut.pipe";
import {SimpleDatePipe} from "../../pipes/simple-date.pipe";
import {MaterialModule} from "../../modules/material/material.module";
import {MatInput} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {MouseEnterDirective} from "../../directives/mouse-enter.directive";
import {NextLinerPipe} from "../../pipes/next-liner.pipe";
import {Title} from "@angular/platform-browser";
import {serverResponse} from "../../../app/app.component";
import {GlobalMessengerService} from "../../services/global-messenger.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ReportService} from "../../services/report.service";
import {VideoService} from "../../services/video.service";
import {CommentsService} from "../../services/comments.service";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NgIf,
    FeedComponent,
    Base64ImagePipe,
    DateFormatPipe,
    RowcutPipe,
    SimpleDatePipe,
    MaterialModule,
    ReactiveFormsModule,
    NgForOf,
    MatInput,
    MatSelect,
    MouseEnterDirective,
    NextLinerPipe
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit, OnDestroy{

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private reportService: ReportService,
              private videoService: VideoService,
              private commentsService: CommentsService,
              private title: Title,
              private global: GlobalMessengerService) {
  }

  type!: string;
  mediaId!: string;
  reportedAccountId!: string;
  prevUrl!: string;
  sub!: Subscription;
  categories: string[] = [];
  reportedVideo!: videoObj;
  reportedComment!: Comment;
  maxLength = 35;
  rowLength = 120;

  reportForm = new FormGroup({
    category: new FormControl<string>('',Validators.required),
    content: new FormControl<string>('',Validators.required),
  })

  sendReport(){
    if(this.reportForm.valid){
      let reportData = [this.mediaId,this.reportForm.controls.category.value!,this.reportForm.controls.content.value!,this.reportedAccountId];
      this.reportService.sendReport(this.type,reportData)
        .subscribe({
          next: value => {
            this.global.toastMessage.next(['alert-primary',value.message])
            this.abort();
          },
          error: err => {
            let ms: serverResponse = err.error;
            this.global.toastMessage.next(['alert-warning',ms.message])
          }
        })
    }


  }

  getCategories() {
    this.reportService.getCategories().subscribe({
      next: value => {
        this.categories = value;
      }
    })
  }




  getMedia(){
    if(this.type === 'video'){
       this.videoService.getVideo(this.mediaId)
         .subscribe({
           next: value => {
             this.reportedVideo = value;
             this.reportedAccountId = value.authorId;
             console.log("Received video: "+this.reportedVideo.name)
           }
         })
    }else{
      this.commentsService.getComment(this.mediaId)
         .subscribe({next: value => {
           this.reportedComment = value;
           this.reportedAccountId = value.authorId;
           console.log("Received comment by: "+this.reportedComment.authorName)
         }});
    }

  }

  abort(){
    this.router.navigateByUrl(this.prevUrl);
  }

  resizeComment(comment: Comment){
    comment.extended = !comment.extended;
  }

  shortenComment(comment: Comment){
    if(!comment.extended){
      return comment.content.slice(0,this.rowLength);
    }
    return comment.content;
  }




  ngOnInit() {
    this.title.setTitle("Report Form")
    this.sub = this.activatedRoute.queryParams.subscribe({
      next: params =>{
        this.type = params['type'];
        this.prevUrl = params['src'];
        this.mediaId = params['id'];
        this.getCategories();
        this.getMedia();

      }
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
