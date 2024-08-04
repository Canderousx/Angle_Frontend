import {Component, Input, OnInit} from '@angular/core';
import {MaterialModule} from "../../modules/material/material.module";
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MouseEnterDirective} from "../../directives/mouse-enter.directive";
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable, of, startWith, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {SearchService} from "../../services/search.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, NgOptimizedImage, MouseEnterDirective, NgIf, RouterLink, ReactiveFormsModule, AsyncPipe, NgForOf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  constructor(private auth: AuthenticationService,
              private router: Router,
              private searchService: SearchService,) {
  }

  @Input()loggedIn!: boolean;
  filteredOptions!: Observable<string[]>;

  search = new FormGroup({
    query: new FormControl("",Validators.required)
  })

  ngOnInit() {
    this.filteredOptions = this.search.controls.query.valueChanges.pipe(
      startWith(''),
      switchMap(value => value ? this._filter(value) : of([]))
    );
  }

  private _filter(value: string): Observable<string[]> {
    return this.searchService.searchHelper(this.search.controls.query.value!);
  }

  onOptionSelected(event: any) {
    console.log(event.option.value);
    this.submitSearch();
  }



  submitSearch(){
    let q = this.search.controls.query.value;
    this.search.controls.query.reset();
    this.router.navigate(["/search"],{queryParams:{q:q}})
  }

  logout(){
    this.auth.logout();
    this.router.navigate([""]);
  }

  signin(){
    localStorage.setItem("prevURL",this.router.url);
    this.router.navigate(['signin'])
  }

  myChannel(){
    this.auth.getUserId().subscribe({
      next: value => {
        this.router.navigate(["/channel"],{queryParams: {id: value.message}})
      }
    })
  }


}
