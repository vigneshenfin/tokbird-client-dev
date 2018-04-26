import { Component, OnInit , Input, Output,EventEmitter} from '@angular/core';
import { EventsCalendarService } from 'app/admin/events-calendar/events-calendar.service';
import { FacilitatorRequestsService } from 'app/admin/events-calendar/facilitator-requests/facilitator-requests.service';
import { ToastrService } from 'toastr-ng2';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/shared/user';
import { Subscription } from 'rxjs';
import _ from "lodash";

declare var $:any;
declare var moment:any;
@Component({
  selector: 'app-facilitator-requests',
  templateUrl: './facilitator-requests.component.html',
  styleUrls: ['./facilitator-requests.component.css'],
  providers : [FacilitatorRequestsService]
})
export class FacilitatorRequestsComponent implements OnInit {

    events:any = [];
    public userDetails:any;
    public token:any;
    public requestsDetails:any = [];
    public roleId;
    public urlPrefix = '';
    public pageLimit = 10;
    public offset = 1;
    public records:any = [];
    public keyword = '';
    public facilitators_keyword = '';
    public search = '';
    page: number = 1;
    loader: Subscription;
    public facilitators:any;
    public currentFacilitator:any;
    public meetingId = "";
    public facilitator_name:any = "";
    public pendingRequests:any = 0;
    public assignType:any = "";
    public errorMsg:any   = "";
    public facilitatorRecords:any = [];
    @Output() countChanged = new EventEmitter();
    constructor(private router:Router,private user: User, public eventsCalendarService: EventsCalendarService, private toastrService: ToastrService, private facilitatorRequestsService: FacilitatorRequestsService) { 
          this.userDetails   = user.getUser();
          this.token         = this.userDetails.token;
          this.roleId        = this.userDetails.us_role_id;
          if(this.roleId == '1'){
            // Admin
            this.urlPrefix = '/admin';
          }else if(this.roleId == '2'){
            this.urlPrefix = '/facilitator';
          }
    }

    showError(msg) {
      this.toastrService.error(msg, 'Failure!');
    }

    showSuccess(msg) {
      this.toastrService.success(msg, 'Success!');
    }
    ngOnInit() {
      this.getFacilitatorRequests();
    }

  
    getFacilitatorRequests(){
      // console.log(this.keyword )
      let params:any        =  {};
      params.limit          =  this.pageLimit;
      params.offset         =  this.offset;
      params.token          =  this.token;
      params.keyword        =  this.keyword;
      params.meeting_status =  "future";
      
      this.loader = this.facilitatorRequestsService.getRequestsDetails(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                // console.log(response.body.total_count)
                this.requestsDetails         = response.body.requests_details;
                this.pendingRequests         = response.body.pending_count;
                this.countChanged.emit(this.pendingRequests);
                this.page                    = this.offset;
                this.records                 = response.body.total_count;
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/admin/login');
                  this.showError(error.message);
                }else{
                  this.requestsDetails   = [];
                  this.records           = this.requestsDetails.length;
                }
            }
      );      
      
    }

    requestsPageChanged(event) {
      this.offset = event;
      console.log('page_changed')
      this.getFacilitatorRequests();
    }

    searchUsers(event, formInfo:NgForm) {
        this.search = formInfo.value.keyword;
        this.getFacilitatorRequests();
    }

    resetSearch(){
      this.search = "";
      this.getFacilitatorRequests();
    }

    getFacilitators(meetingId,facilitatorId,type){
      this.facilitators_keyword= "";
      this.errorMsg            = "";
      this.currentFacilitator  = facilitatorId;
      this.meetingId           = meetingId;
      this.assignType          = type;
      this.getFacilitatorsList();
    }

    

    getFacilitatorsList(){
      
      let params:any    =  {};
      // Commented for list all facilitators - 07/03/2018 - Paul
      // params.limit      =  5;
      // params.offset     =  1;
      params.token      =  this.token;
      params.keyword    =  this.facilitators_keyword;
      params.meetingId  =  this.meetingId;
      this.facilitatorRequestsService.getFacilitatorDetails(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.facilitators       = response.body.facilitator_details;
                this.currentFacilitator = response.body.current_facilitator;
                this.page               = this.offset;
                this.facilitatorRecords = this.facilitators.length;
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/admin/login');
                  this.showError(error.message);
                }else{
                  this.facilitators       = [];
                  this.facilitatorRecords = this.facilitators.length;
                }
            }
      );     
    }

  selectedFacilitator(id: number) {
    $('input').not('#assign'+id).prop('checked', false);
    this.currentFacilitator =  id;
    this.facilitator_name   = $('#facilitator'+id).text();
    console.log(this.facilitator_name)

  }

  clickedAction(){
  // this.currentFacilitator = "";
  }

  clickedRemove(id){
    this.meetingId =  id;
  }

  assignFacilitator($event,formInfo:NgForm){
   // console.log('facilitator'+this.currentFacilitator)
  /* for(var obj in formInfo.value){
      if(formInfo.value[obj] == true ) {
          this.currentFacilitator = obj.replace('assign','');
      }
    } */
    if(this.currentFacilitator != '0'){
      this.errorMsg         = "";
      let params:any        =  {};
      params.token          =  this.token;
      params.facilitator_id =  this.currentFacilitator;
      params.meeting_id     =  this.meetingId;

      this.facilitatorRequestsService.assignFacilitator(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess('Facilitator assigned successfully');
                $('#assign_facilitator').modal('hide');
                if(this.assignType == "assign"){
                  this.pendingRequests--;
                  this.countChanged.emit(this.pendingRequests);
                }
                //$('#meeting_facilitator'+this.meetingId).html(this.facilitator_name);
                // for(let i=0; i<this.requestsDetails.length; i++){
                //   if(this.requestsDetails[i]['id'] == this.meetingId){
                //     this.requestsDetails[i]['facilitator_id'] = this.currentFacilitator;
                //     this.requestsDetails[i]['facilitator']    = this.facilitator_name;
                //   }
                // }
                 this.getFacilitatorRequests();
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.router.navigateByUrl('/admin/login');
                  this.showError(error.message);
                }
            }
      );     
            
    }else{
      this.errorMsg = "Please choose a facilitator";
    }
      
  }

  removeFacilitator(){

      let params:any        =  {};
      params.token          =  this.token;
      params.facilitator_id =  "";
      params.meeting_id     =  this.meetingId;
      this.facilitatorRequestsService.removeFacilitator(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess('Facilitator removed successfully');
                this.pendingRequests++;
                this.countChanged.emit(this.pendingRequests);
                $('#remove_facilitator').modal('hide');
                $('#meeting_facilitator'+this.meetingId).html('Not Assigned');
                for(let i=0; i<this.requestsDetails.length; i++){
                  if(this.requestsDetails[i]['id'] == this.meetingId){
                    this.requestsDetails[i]['facilitator_id'] = "";
                    this.requestsDetails[i]['facilitator']    = "";
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
                }
            }
      );
  }


}
