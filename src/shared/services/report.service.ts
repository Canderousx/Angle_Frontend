import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Report} from "../models/report";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getAllReports(pageIndex: number,pageSize: number,sortBy: string, order: string) {
    return this.http.get<Report[]>(environment.backendUrl+"/report/getResolved?page="
      +pageIndex+"&pageSize="+pageSize+"&sortBy="+sortBy+"&order="+order,{observe: "response"})
  }

  getMyCases(pageIndex: number, pageSize: number, sortBy: string, order: string) {
    return this.http.get<Report[]>(environment.backendUrl+"/report/getMyCases?page="
      +pageIndex+"&pageSize="+pageSize+"&sortBy="+sortBy+"&order="+order,{observe: "response"})
  }

  howManyUnresolved(){
    return this.http.get<number>(environment.backendUrl+"/report/howManyUnresolved")
  }

  getCategories(){
    return this.http.get<string[]>(environment.backendUrl+"/report/getCategories")
  }

  sendReport(type: string, reportData: string[]){
    return this.http.post<serverResponse>(environment.backendUrl+"/report/"+type,reportData)
  }



}
