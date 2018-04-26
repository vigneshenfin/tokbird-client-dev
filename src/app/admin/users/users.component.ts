import {Component, OnInit,Output,ViewContainerRef,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Config } from "app/config/config";
import { User } from "app/shared/user";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs';
import { UsersService } from 'app/admin/users/users.service';
declare var $:any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers :[UsersService]
})
export class UsersComponent implements OnInit {
  public userDetails:any ;
  public token:any; 
  public usersDetails:any;
  public userSingleData:any;
  public emailErrorMsg    = "";
  public errorMsg         = "";
  public edit_user_name   = "";
  public edit_email       = "";
  public user_id:any;
  public limit            = 10;
  public offset           = 1;
  public keyword          = '';
  public search           = '';
  p: number               = 1;
  busy: Subscription;
  public recordsTotal:any = [];
  public sortDir = 1; // Asc, 2-Desc
  public sortColumn = 1; // Name
  // Added - 23/04/2018
  public subscriptionPlans:any = [{"id":'', "value": "All Plans"}, {"id":1, "value": "Free"}, {"id":2, "value":"Basic"}, {"id":3, "value":"Plus"}, {"id":4, "value":"Corporate"}];
  public planId = '';

  constructor(private router:Router, private activatedRoute:ActivatedRoute,private user:User, public toastr: ToastsManager, vcr: ViewContainerRef,private usersService:UsersService) {
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
    this.getUsers();
  }

  getUsers(){

    let params:any =  {};
    params.limit   =  this.limit;
    params.offset  =  this.offset;
    params.token   =  this.token;
    params.keyword =  this.search;
    params.sort_column = this.sortColumn;
    params.sort_dir = this.sortDir;
    // Added - 23/04/2018
    params.plan_id = this.planId;
    this.busy = this.usersService.getUsersDetails(params)
          .subscribe(
          (response:any) => {
            // if(this.sortDir == 1){
            //   this.sortDir = 2; // Desc
            // }else{
            //   this.sortDir = 1; // Asc
            // }
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.usersDetails            = response.body.users_details;
              this.p                       = this.offset;
              this.recordsTotal            = response.body.users_count;
            }
          },
          (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/admin/login');
                this.showError(error.message);
              }else{
                this.usersDetails            = [];
                this.recordsTotal            = 0;
              }
          }
    );      
    
  }

  pageChanged(event) {
    this.offset = event;
    this.getUsers();
  }

  searchUsers(event, formInfo:NgForm) {
    //if(formInfo.valid){
      this.offset = 1;
      this.search = formInfo.value.keyword;
      this.getUsers();
   // }
  }

  resetSearch(){
    this.search = "";
    this.getUsers();
  }

  /**
   * Filter accounts by plan id
   * @param planId 
   */
  selectPlan(planId = ''){
    this.getUsers();
  }

  saveUser(params){
      this.usersService.SaveUser(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess(response.message);
                this.errorMsg = "";
                if(!params.facilitator_id){
                     let newData:any = {};
                    newData.id         = response.facilitator_id;
                    newData.us_name    = params.name;
                    newData.us_email   = params.email;
                    this.usersDetails.push(newData);
                    //console.log(this.usersDetails)
                    $('#create_facilitator').modal('hide');
                }else{
                    $('#edit_facilitator').modal('hide');
                    
                }
               
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/admin/login');
                  this.showError(error.message);
                }else{
                  this.errorMsg = error.message;
                }
            }
      );  
   }


   getUser(userId){
      this.user_id = userId;
      let params:any = {};
      params.token   = this.token;
      params.id      = userId;
      this.usersService.getUser(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.userSingleData      = response.body;
                this.edit_user_name      = this.userSingleData.us_name;
                this.edit_email          = this.userSingleData.us_email;
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/admin/login');
                  this.showError(error.message);
                }else{
                  this.errorMsg = error.message;
                }
            }
      );  
   }

   changeStatus(userId,status){
      this.user_id         = userId;
      let params:any       = {};
      params.token         = this.token;
      params.user_id       = userId;
      let statusValue      = 0 ;
      if(status == 'enable'){
        statusValue = 1;
      }else if(status == "disable"){
        statusValue = 2;
      }else{
        statusValue = 3;
        $('#delete_user').modal('hide');
         $('#row'+this.user_id).remove();
      }
      params.status         = statusValue;
      this.usersService.changeStatus(params)
              .subscribe(
              (response:any) => {
                response   = JSON.parse(response['_body']);
                if(response.success == 1){
                  if(statusValue == 1){
                    response.message = "User enabled successfully";
                  }else if(statusValue == 2){
                    response.message = "User disabled successfully";
                  }else{
                    response.message = "User deleted successfully";
                  }

                  this.showSuccess(response.message);
                  this.errorMsg = "";
                  for(let i=0; i<this.usersDetails.length; i++){
                    if(this.usersDetails[i]['id'] == userId){
                      this.usersDetails[i]['us_status'] = statusValue;
                    }
                  }
                  
              }
              },
              (error) => {
                  error = JSON.parse(error['_body']);
                  if(error.message == "Login failed"){
                    this.user.logOut();
                    this.router.navigateByUrl('/admin/login');
                    this.showError(error.message);
                  }else{
                    this.errorMsg = error.message;
                  }
              }
        );  
    }

    deleteUser(userId){
      this.user_id = userId;
    }

    resetPassword(userId){
      let params:any = {};
      params.token   = this.token;
      params.id      = userId;
      this.usersService.resetPassword(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess('An auto generated password email has been sent to this user');
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/admin/login');
                  this.showError(error.message);
                }else{
                  this.errorMsg = error.message;
                }
            }
      );  
    }

    /**
     * Sort users table
     * @param column 
     */
    sortTable(column) {
      this.sortColumn = column;
      if(this.sortDir == 1){
        this.sortDir = 2; // Desc
      }else{
        this.sortDir = 1; // Asc
      }
      this.getUsers();
    }


    /**
     * Enter to the users account
     * @param userId 
     */
    enterAccount(meetingId = ''){
      if(meetingId && meetingId!= ''){
        let redirectUrl = Config.APP_URL + 'admin/meetings/list/' + meetingId;
        window.open(redirectUrl, '_blank');
      }else{
        this.showError('No events created');
      }
      // if(userId != ''){
        // for(let i=0; i<this.usersDetails.length; i++){
          // if(this.usersDetails[i].id == userId){
            // if(this.usersDetails[i].meeting_id){
              // let redirectUrl = Config.APP_URL + 'admin/meetings/' + this.usersDetails[i].meeting_id;
              // window.open(redirectUrl, '_blank');
            // }else{
              // this.showError('No events created');
            // }
      //     }
      //   }
      // }
    }

}
