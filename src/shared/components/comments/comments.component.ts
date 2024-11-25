import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Comment} from "../../models/comment";
import {NgForOf, NgIf} from "@angular/common";
import {MaterialModule} from "../../modules/material/material.module";
import {Router, RouterLink} from "@angular/router";
import {accountRes, AuthenticationService} from "../../services/authentication.service";
import {Base64ImagePipe} from "../../pipes/base64-image.pipe";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DateFormatPipe} from "../../pipes/date-format.pipe";
import {SimpleDatePipe} from "../../pipes/simple-date.pipe";
import {MouseEnterDirective} from "../../directives/mouse-enter.directive";
import {NextLinerPipe} from "../../pipes/next-liner.pipe";
import {GlobalMessengerService} from "../../services/global-messenger.service";
import {serverResponse} from "../../../app/app.component";
import {CommentsService} from "../../services/comments.service";

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    NgIf,
    MaterialModule,
    RouterLink,
    Base64ImagePipe,
    ReactiveFormsModule,
    NgForOf,
    DateFormatPipe,
    SimpleDatePipe,
    MouseEnterDirective,
    NextLinerPipe
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, OnChanges{

  constructor(private commentsService: CommentsService,
              private auth: AuthenticationService,
              private router: Router,
              private global: GlobalMessengerService) {
  }

  @Input() videoId!: string;
  user!: accountRes;
  comments: Comment[] = [];
  totalComments = 0;
  page = 0;
  pageSize = 10;
  loggedIn = false;
  maxLength = 35;
  rowLength = 120;

  commentForm = new FormGroup({
    content: new FormControl("",Validators.compose([Validators.required])),
  })

  ngOnChanges(changes: SimpleChanges) {
    if(changes['videoId']){
      this.loadComments();
    }
  }

  delete(id: string | undefined){
    this.commentsService.deleteComment(id!)
      .subscribe({
        next: value => {
          this.global.toastMessage.next(['alert-primary',value.message])
          this.loadComments();
        },
        error: err => {
          let error: serverResponse = err.error;
          this.global.toastMessage.next(['alert-danger',error.message])
        }
      })
  }

  report(id: string | undefined){
    this.router.navigate(["/report"],{queryParams:{id: id,type:"comment",src: this.router.url}})
  }

  signin(){
    localStorage.setItem("prevURL",this.router.url);
    this.router.navigate(['signin'])
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


  addComment(){
    this.page = 0;
    if(this.commentForm.controls.content.value && this.user!==null){
      let comment: Comment = {
        authorAvatar: this.user.avatar,
        content: this.commentForm.controls.content.value,
        authorId: this.user.id,
        authorName: this.user.username,
        videoId: this.videoId,
        likes: 0,
        dislikes: 0,
      }
      this.commentForm.controls.content.reset();
      this.commentsService.addComment(comment)
        .subscribe({
          next: value => {
            const totalComments = value.headers.get("totalComments");
            if(totalComments){
              this.totalComments = +totalComments;
            }
            if(value.body){
              this.comments = value.body;
            }
          }
        })
    }
  }


  loadComments(){
    this.comments = [];

    this.commentsService.loadComments(this.videoId,this.page,this.pageSize)
      .subscribe({
        next: value => {
          console.log(value)
          const totalComments = value.headers.get("totalComments");
          console.log("TOTAL COMMENTS: "+totalComments)
          if(totalComments){
            this.totalComments = +totalComments;
          }
          if(value.body){
            this.comments = value.body.content;
          }
          console.log("COMMENTS: "+this.comments.length);
        }
      })
  }

  moreComments(){
    this.page++;
    console.log("Comments page: "+this.page)
    this.commentsService.loadComments(this.videoId,this.page,this.pageSize)
      .subscribe({
        next: value => {
          if(value.body){
            console.log("MORE COMMENTS: "+value.body.content.length)
            this.comments = this.comments.concat(value.body.content);
          }

        }
      })
  }

  ngOnInit() {
    this.loadComments();
    this.checkLogin();
    this.auth.getCurrentUser();
    this.auth.currentUser.subscribe({
      next: value => {
        if(value){
          this.user = value;
          console.log("CURRENT USER: "+this.user.username);
        }
      }
    })


  }

  checkLogin(){
    this.loggedIn = !!localStorage.getItem("authToken");
  }




}
