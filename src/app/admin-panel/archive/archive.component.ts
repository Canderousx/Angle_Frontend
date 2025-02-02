import { Component } from '@angular/core';
import {ReportTableComponent} from "../report-table/report-table.component";
import {HttpClient} from "@angular/common/http";
import {Report} from "../../../shared/models/report";
import {environment} from "../../../environments/environment.development";
import {ReportService} from "../../../shared/services/report.service";

@Component({
  selector: 'app-archive',
  standalone: true,
    imports: [
        ReportTableComponent
    ],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.css'
})
export class ArchiveComponent {
  constructor(private reportService: ReportService) {
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
      this.reportService.getAllReports(this.pageIndex,this.pageSize,this.sortBy,this.order).subscribe({
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
