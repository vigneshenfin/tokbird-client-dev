import {Component, OnInit,Output,ViewContainerRef,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from "app/shared/user";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FacilitatorsService } from 'app/admin/facilitators/facilitators.service';
import { Subscription } from 'rxjs';
declare var $:any;
@Component({
  selector: 'app-facilitators',
  templateUrl: './facilitators.component.html',
  styleUrls: ['./facilitators.component.css'],
  providers : [FacilitatorsService]
})
export class FacilitatorsComponent implements OnInit {
  @ViewChild('j') create_form;
  public userDetails:any ;
  public token:any; 
  public facilitatorsDetails:any;
  public facilitatorSingleData:any;
  public emailErrorMsg = "";
  public errorMsg = "";
  public edit_facilitator_name= "";
  public edit_email = "";
  public facilitator_id:any;
  public limit = 10;
  public offset = 1;
  public keyword = '';
  public search = '';
  p: number = 1;
  busy: Subscription;
  public recordsCount:any = [];
  public SuccessMsg = '';
  constructor(private router:Router, private activatedRoute:ActivatedRoute,private user:User, public toastr: ToastsManager, vcr: ViewContainerRef,private facilitatorsService:FacilitatorsService) {
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
    this.getFacilitators();
  }

  getFacilitators(){

    let params:any =  {};
    params.limit   =  this.limit;
    params.offset  =  this.offset;
    params.token   =  this.token;
    params.keyword =  this.search;
    this.busy = this.facilitatorsService.getFacilitatorDetails(params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              console.log(response.body.facilitators_count)
              this.facilitatorsDetails     = response.body.facilitator_details;
              this.p                       = this.offset;
              this.recordsCount            = response.body.facilitators_count;
            }
          },
          (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/admin/login');
                this.showError(error.message);
              }else{
                this.facilitatorsDetails = [];
                this.recordsCount        = 0;
              }
          }
    );      
    
  }

  pageChanged(event) {
    this.offset = event;
    this.getFacilitators();
  }

  searchFacilitator(event, formInfo:NgForm) {
   // if(formInfo.valid){
      this.offset = 1;
      this.search = formInfo.value.keyword;
      this.getFacilitators();
   // }
  }
  resetSearch(){
    this.search = "";
    this.getFacilitators();
  }
  createFacilitator(event,facilitatorData:NgForm){

      if(facilitatorData.valid){
      let errorCount = 0;
      var re          = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(facilitatorData.value.email){
        if(!re.test(facilitatorData.value.email)){
          this.emailErrorMsg   = 'Enter a valid email Id';
          errorCount++
        }
      }
      let params:any    = {};
      params.token      = this.token;
      params.name       = facilitatorData.value.facilitator_name;
      params.email      = facilitatorData.value.email;
      params.us_role_id = 2;
      if(errorCount == 0){
        this.saveFacilitator(params);
      }
      
    }
   
  }

  editFacilitator(event,facilitatorData:NgForm){

    if(facilitatorData.valid){
      let errorCount = 0;
      var re          = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(facilitatorData.value.edit_email){
        if(!re.test(facilitatorData.value.edit_email)){
          this.emailErrorMsg   = 'Enter a valid email Id';
          errorCount++
        }
      }else{
        this.emailErrorMsg   = '';
      }
      let params:any        = {};
      params.token          = this.token;
      params.name           = facilitatorData.value.edit_facilitator_name;
      params.email          = facilitatorData.value.edit_email;
      params.facilitator_id = this.facilitator_id;
      if(errorCount == 0){
        this.saveFacilitator(params);
        $('#name'+this.facilitator_id).html(params.name);
        $('#email'+this.facilitator_id).html(params.email);

      }
    }

}
 

   saveFacilitator(params){
      this.facilitatorsService.SaveFacilitator(params)
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
                    newData.us_status  = 1;
                    this.facilitatorsDetails.push(newData);
                    //console.log(this.facilitatorsDetails)
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


   getFacilitator(userId){
      this.facilitator_id = userId;
      let params:any = {};
      params.token   = this.token;
      params.id      = userId;
      this.facilitatorsService.getFacilitator(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.facilitatorSingleData      = response.body;
                this.edit_facilitator_name      = this.facilitatorSingleData.us_name;
                this.edit_email                 = this.facilitatorSingleData.us_email;
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
      this.facilitator_id   = userId;
      let params:any        = {};
      params.token          = this.token;
      params.facilitator_id = userId;
      let statusValue       = 0 ;
      if(status == 'enable'){
        statusValue = 1;
      }else if(status == "disable"){
        $('#disable_facilitator').modal('hide');
        statusValue = 2;
      }else{
        statusValue = 3;
        $('#delete_facilitator').modal('hide');
         $('#row'+this.facilitator_id).remove();
      }
      params.status         = statusValue;
      this.facilitatorsService.changeStatus(params)
              .subscribe(
              (response:any) => {
                response   = JSON.parse(response['_body']);
                if(response.success == 1){
                  if(statusValue == 1){
                    response.message = "Facilitator enabled successfully";
                  }else if(statusValue == 2){
                    response.message = "Facilitator disabled successfully.";
                  }else{
                    response.message = "Facilitator deleted successfully";
                  }

                  this.showSuccess(response.message);
                  this.errorMsg = "";
                  for(let i=0; i<this.facilitatorsDetails.length; i++){
                    if(this.facilitatorsDetails[i]['id'] == userId){
                      this.facilitatorsDetails[i]['us_status'] = statusValue;
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

    deleteFacilitator(userId){
      this.facilitator_id = userId;
    }

    disableFacilitator(userId){
      this.facilitator_id = userId;
    }

    openCreateFacilitator(){
      this.errorMsg = "";
      this.emailErrorMsg   = "";
      this.create_form.resetForm();
    }
   
}

