import {Component, OnInit,Output,ViewContainerRef,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from "app/shared/user";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs';
import { LogsService } from 'app/admin/logs/logs.service';
declare var $:any;
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
  providers :[LogsService]
})
export class LogsComponent implements OnInit {
  public userDetails:any ;
  public token:any; 
  public logsDetails:any;
  public userSingleData:any;
  public emailErrorMsg = "";
  public errorMsg = "";
  public edit_user_name= "";
  public edit_email = "";
  public user_id:any;
  public limit = 10;
  public offset = 1;
  public keyword = '';
  public search = '';
  p: number = 1;
  busy: Subscription;
  public recordsTotal:any = [];
  constructor(private router:Router, private activatedRoute:ActivatedRoute,private user:User, public toastr: ToastsManager, vcr: ViewContainerRef,private usersService:LogsService) {
    this.userDetails   = user.getUser();
    this.token         = this.userDetails.token;
    this.toastr.setRootViewContainerRef(vcr);
    
   }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }
  ngOnInit() {
    this.getLogs();
  }

  getLogs(){

    let params:any =  {};
    params.limit   =  this.limit;
    params.offset  =  this.offset;
    params.token   =  this.token;
    params.keyword =  this.search;
    this.busy      = this.usersService.getLogsDetails(params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.logsDetails             = response.body.logs_details;
              this.p                       = this.offset;
              this.recordsTotal           = response.body.logs_count;
            }
          },
          (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/admin/login');
                this.showError(error.message);
              }else{
                this.logsDetails            = [];
                this.recordsTotal           = 0;
              }
          }
    );      
    
  }

  pageChanged(event) {
    this.offset = event;
    this.getLogs();
  }

  searchUsers(event, formInfo:NgForm) {
    //if(formInfo.valid){
      this.offset = 1;
      this.search = formInfo.value.keyword;
      this.getLogs();
   // }
  }

  resetSearch(){
    this.search = "";
    this.getLogs();
  }

}

