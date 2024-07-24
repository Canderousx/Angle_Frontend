import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Base64ImagePipe} from "../../../shared/pipes/base64-image.pipe";
import {MatIcon} from "@angular/material/icon";
import {MouseEnterDirective} from "../../../shared/directives/mouse-enter.directive";
import {NgForOf, NgIf} from "@angular/common";
import {SimpleDatePipe} from "../../../shared/pipes/simple-date.pipe";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MatTooltip} from "@angular/material/tooltip";
import {Report} from "../../../shared/models/report";
import {DateFormatPipe} from "../../../shared/pipes/date-format.pipe";
import {ModalService} from "../../../shared/services/modal.service";
import {AdminPanelComponent} from "../admin-panel.component";
import {ModalComponent} from "../../../shared/components/modal/modal.component";
import {Subscription} from "rxjs";
import {ViewReportComponent} from "./view-report/view-report.component";
import {MaterialModule} from "../../../shared/modules/material/material.module";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [
    Base64ImagePipe,
    MatIcon,
    MouseEnterDirective,
    NgForOf,
    NgIf,
    SimpleDatePipe,
    MatTooltip,
    DateFormatPipe,
    ModalComponent,
    ViewReportComponent,
    MaterialModule
  ],
  templateUrl: './report-table.component.html',
  styleUrl: './report-table.component.css'
})
export class ReportTableComponent implements OnInit, OnDestroy{

  constructor(private router: Router,
              private http: HttpClient,
              private modal: ModalService) {
  }

  url!: string;
  @Input()reports!: Report[];
  @Input()allReports!: number;
  @Input()pageSize!: number;
  @Output()changePage: EventEmitter<number[]> = new EventEmitter();
  @Output()changeSortBy = new EventEmitter<string>();
  openModal = false;
  sub!: Subscription;
  reportToView!: Report;

  ngOnInit() {
    this.url = this.router.url;
    this.sub = this.modal.openModal.subscribe({
      next: value => {
        this.openModal = value;
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  pageSwitcher(event: PageEvent){
    this.changePage.emit([event.pageIndex,event.pageSize]);
  }

  changeSort(event: Event){
    const target = event.target as Element;
    const id = target.id;
    const headers = document.querySelectorAll('th');
    headers.forEach(header => {
      header.classList.remove("selected")
    });
    target.classList.add('selected');
    this.changeSortBy.emit(id);
  }

  viewReport(report: Report){
    this.reportToView = report;
    this.modal.openModal.next(true);
  }
  closeView(){
    this.reportToView = {};
    this.modal.openModal.next(false);
  }


}
