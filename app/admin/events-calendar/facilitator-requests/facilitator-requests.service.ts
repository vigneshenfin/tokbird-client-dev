import { Injectable } from '@angular/core';
import { Http, Headers ,RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/forms';
import { Config } from "app/config/config";

@Injectable()
export class FacilitatorRequestsService {

  constructor(private http: Http) { }

  getRequestsDetails(params){
    let headers = new Headers({'Content-Type' :'application/json'});
    let options = new RequestOptions ({ headers : headers ,method : 'post'});
    return this.http.post(Config.BASE_API_URL+'meetings/get_facilitator_requests' ,params,options);
  }

  getFacilitatorDetails(params){
      let headers = new Headers({'Content-Type' :'application/json'});
      let options = new RequestOptions ({ headers : headers ,method : 'post'});
      return this.http.post(Config.BASE_API_URL+'facilitators/get_facilitators_list' ,params,options);
  } 

  assignFacilitator(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/assign_facilitator' ,params,options);
  }

  removeFacilitator(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'meetings/assign_facilitator' ,params,options);
  }

  saveFacilitatorPayment(params){
        let headers = new Headers({'Content-Type' :'application/json'});
        let options = new RequestOptions ({ headers : headers ,method : 'post'});
        return this.http.post(Config.BASE_API_URL+'facilitators/save_facilitator_payment' ,params,options);
  }

}
