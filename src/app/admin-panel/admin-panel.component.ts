import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {NgOptimizedImage} from "@angular/common";
import {serverResponse} from "../app.component";
import {ReportService} from "../../shared/services/report.service";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit{

  constructor(private router: Router,
              private reportService: ReportService,
              private authenticationService: AuthenticationService,) {
  }

  newReports = 0;

  checkNewReports(){
      this.reportService.howManyUnresolved().subscribe({
        next: value => {
          this.newReports = value;
        }
      })
  }

  ngOnInit() {
    this.authenticationService.isAdmin().subscribe({
        next: value => {
          console.log("IS ADMIN: "+value);
          if(!value){
            console.log("Access denied!")
            this.router.navigate(["pageNotFound"])
          }else{
            console.log("Access granted!")
            this.checkNewReports();
            this.router.navigate(['admin/summary'])
          }

        },
        error: error =>{
          this.router.navigate(["pageNotFound"])
        }
      })

  }

}
