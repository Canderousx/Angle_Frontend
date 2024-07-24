import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {videoObj} from "../home/home.component";
import {environment} from "../../environments/environment.development";
import {FeedComponent} from "../../shared/components/feed/feed.component";
import {NgForOf} from "@angular/common";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {SimpleDatePipe} from "../../shared/pipes/simple-date.pipe";
import {MouseEnterDirective} from "../../shared/directives/mouse-enter.directive";
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FeedComponent,
    NgForOf,
    Base64ImagePipe,
    SimpleDatePipe,
    MouseEnterDirective
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{

  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router) {

  }

  query!: string;
  page = 0;
  results!: videoObj[];



  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: value => {
        if(value['q']){
          this.query = value['q'];
          this.results = [];
          this.search();
        }
      }
    })

  }

  search(){
    console.log("SEARCHING")
    if(this.query){
      this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/search?q="+this.query+"&page="+this.page)
        .subscribe({
          next: value => {
            this.results = value;
          }
        })
    }
  }

  watch(id: string){
    this.router.navigate(["/watch"],{queryParams: {v: id}})
  }


}
