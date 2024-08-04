import {Component, OnInit} from '@angular/core';
import {ReportTableComponent} from "../report-table/report-table.component";
import {MaterialModule} from "../../../shared/modules/material/material.module";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment.development";
import {NgIf} from "@angular/common";
import {Report} from "../../../shared/models/report";
import {MatDialog} from "@angular/material/dialog";
import {ModalService} from "../../../shared/services/modal.service";
import {ModalComponent} from "../../../shared/components/modal/modal.component";

@Component({
  selector: 'app-unresolved',
  standalone: true,
  imports: [
    ReportTableComponent,
    MaterialModule,
    NgIf,
    ModalComponent
  ],
  templateUrl: './unresolved.component.html',
  styleUrl: './unresolved.component.css'
})
export class UnresolvedComponent implements OnInit{

  constructor(private http: HttpClient,
              private router: Router,
              ) {
  }
  reports!: Report[];
  pageSize = 10;
  allReports!: number;
  pageIndex = 0;
  sortBy = 'date_published';
  order = 'descending';

  changePage(page: number[]){
    this.pageIndex=page[0];
    this.pageSize = page[1];
    this.getPage();

  }
  changeSortBy(sortBy: string){
    this.sortBy = sortBy;
    if(this.order.includes('desc')){
      this.order = 'ascending';
    }else{
      this.order = 'descending';
    }

    this.getPage();
  }

  getPage(){
    this.http.get<Report[]>(environment.backendUrl+"/report/getUnresolved?page="
      +this.pageIndex+"&pageSize="+this.pageSize+"&sortBy="+this.sortBy+"&order="+this.order,{observe: "response"})
      .subscribe({
        next: value => {
          let totalReports = value.headers.get("totalReports");
          if (totalReports && value.body){
            this.allReports = +totalReports;
            this.reports = value.body;
          }

        }
      })
  }

  ngOnInit() {
    this.getPage();
  }



}
