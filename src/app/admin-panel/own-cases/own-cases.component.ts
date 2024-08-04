import {Component, OnInit} from '@angular/core';
import {Report} from "../../../shared/models/report";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {ReportTableComponent} from "../report-table/report-table.component";

@Component({
  selector: 'app-own-cases',
  standalone: true,
  imports: [
    ReportTableComponent
  ],
  templateUrl: './own-cases.component.html',
  styleUrl: './own-cases.component.css'
})
export class OwnCasesComponent implements OnInit{

  constructor(private http: HttpClient) {
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
    this.http.get<Report[]>(environment.backendUrl+"/report/getMyCases?page="
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
