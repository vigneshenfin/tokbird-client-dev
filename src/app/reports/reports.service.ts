import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from 'app/config/config';
import { ResponseContentType } from '@angular/http';

@Injectable()
export class ReportsService {

  constructor(private http: Http) { }

  meetings(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'reports/meetings', JSON.stringify(params)); 
  }

  getDashboard(params){
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'reports/dashboard_details', JSON.stringify(params)); 
  }

  meetingsPdf(params) {
    params.export_type = "pdf";
    return this.http.post(Config.BASE_API_URL+'reports/export_meetings', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' })
    })
  }

  meetingsExport(params) {
    return this.http.post(Config.BASE_API_URL+'reports/export_meetings', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
      if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  attendance(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'reports/attendance', JSON.stringify(params)); 
  }

  dashboardExport(params) {
    return this.http.post(Config.BASE_API_URL+'reports/export_dashboard', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
       if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  meetingsCsv(params) {
    params.export_type = "csv";
    return this.http.post(Config.BASE_API_URL+'reports/export_meetings', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
        return new Blob([res.blob()], { type: 'text/csv' });
    })
  }


  locations(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'reports/locations', JSON.stringify(params)); 
  }

  locationPdf(params) {
    params.export_type = "pdf";
    return this.http.post(Config.BASE_API_URL+'reports/export_locations', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' })
    })
  }

  locationCsv(params) {
    params.export_type = "csv";
    return this.http.post(Config.BASE_API_URL+'reports/export_locations', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
        return new Blob([res.blob()], { type: 'text/csv' });
    })
  }

  locationsExport(params) {
    return this.http.post(Config.BASE_API_URL+'reports/export_locations', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
      if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  attendanceExport(params) {
    return this.http.post(Config.BASE_API_URL+'reports/export_attendance', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
      if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

  checkAccess(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'reports/index', JSON.stringify(params)); 
  }

  getQuestionsCount(params) {
    let mId = params['mId'];
    let scheduleId = false;
    if(params['scheduleId']){
      if(params['scheduleId'] != ''){
        scheduleId = params['scheduleId'];
      }
    }
    return this.http.get(Config.CONFERENCE_API_URL+'get-questions-count/'+ mId + '/' + scheduleId);
  }

  areYouThere(params) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: 'post'});
    return this.http.post(Config.BASE_API_URL+'meeting_reports/are_you_there', JSON.stringify(params)); 
  }

  areYouThereExport(params){
    return this.http.post(Config.BASE_API_URL+'meeting_reports/export_are_you_there', JSON.stringify(params), { responseType: ResponseContentType.Blob }).map(
    (res) => {
      if(params.export_type == "pdf"){
        return new Blob([res.blob()], { type: 'application/pdf' })
      }else if(params.export_type == "csv") {
        return new Blob([res.blob()], { type: 'text/csv' });
      }
    })
  }

}
