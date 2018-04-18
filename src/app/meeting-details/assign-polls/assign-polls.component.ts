import { Component, OnInit, Output, ViewContainerRef} from '@angular/core';
import { User } from 'app/shared/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { NgForm } from '@angular/forms';
import { StorageService } from "app/shared/storage.service";
import { AssignPollsService } from "./assign-polls.service";
import { Subscription } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-assign-polls',
  templateUrl: './assign-polls.component.html',
  styleUrls: ['./assign-polls.component.css'],
  providers : [MeetingDetailsService,AssignPollsService]
})

export class AssignPollsComponent implements OnInit {

  meetingId         = "";
  public userDetails;
  public meetingStatus;
  public userRoleId;
  public urlPrefix = '';
  public pollsDetails:any;
  public pollId:any = "";
  p: number = 1;
  busy: Subscription;
  public offset = 1;
  public polls:any = [];
  public recordsTotal:any = "";
  public limit = 10;
  public pollErrorMsg = "";
  public assignedIds:any = [];
  public routeMeetingId;
  public isRescheduled:boolean = false;

  constructor(private user: User, private activatedRoute:ActivatedRoute, private meetingDetailsService: MeetingDetailsService,private assignPollsService:AssignPollsService, private router:Router, public toastr: ToastsManager, vcr: ViewContainerRef) { 
    this.userDetails   = user.getUser();
    this.userRoleId = this.userDetails.us_role_id;
    if(this.userRoleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.userRoleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
      this.routeMeetingId = params['meetingId'];
    });
    this.getMeetingStatus();
    this.assignedPolls();
    //this.getPolls();
  }

  /**
   * Show success toastr message
   * @param msg 
   */
  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }

  /**
   * Show error toastr message
   * @param msg 
   */
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  /**
   * Show warning toastr message
   * @param msg 
   */
  showWarning(msg) {
    this.toastr.warning(msg, 'Warning!');
  }

  /**
   * Get status of a meeting - past or future
   * 
   * @author
   * @date 2017-10-26
   */
  getMeetingStatus() {
    let params:any = {};
    params.meeting_id   = this.meetingId;
    params.token   = this.userDetails.token;
    this.meetingDetailsService.getStatus(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          let meeting   = response.body.meeting;
          if(meeting.meeting_status == 3){
            // Meeting completed
            this.meetingStatus = 1;
          }else{
            this.meetingStatus = 0;
            if(meeting.is_rescheduled){
              if(meeting.is_rescheduled == 1){
                this.isRescheduled = true;
              }
            }
          }
        }else{
          // this.router.navigateByUrl('/meetings-list');
          if(this.userRoleId == '3'){
            // Registered user
            this.router.navigateByUrl('/meetings-list');
          }else {
            // Admin/Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          // this.router.navigateByUrl('/');
          if(this.userRoleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else{
            this.router.navigateByUrl('/');
          }
        }else{
          // this.router.navigateByUrl('/meetings-list');
          if(this.userRoleId == '3'){// Registered user
            this.router.navigateByUrl('/meetings-list');
          }else {
            // Admin/Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }
      }
    )
  }

  /**
   * Get assigned polls of a meeting
   */
  assignedPolls(){
    let params:any      = {};
    params.meeting_id   = this.meetingId;
    params.token        = this.userDetails.token;
    params.limit        = this.limit;
    params.offset       = this.offset;
    params.route_meeting_id   = this.routeMeetingId;
    this.assignPollsService.getAssignedPolls(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
         this.pollsDetails  = response.body.assigned_polls;
         this.recordsTotal  = response.body.records;
         this.assignedIds   = response.body.assigned_ids;
         this.getPolls();
         this.p             = this.offset;
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          // this.router.navigateByUrl('/');
          if(this.userRoleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else{
            this.router.navigateByUrl('/');
          }
        }else{
          // this.router.navigateByUrl('/meetings-list');
          if(this.userRoleId == '3'){// Registered user
            this.router.navigateByUrl('/meetings-list');
          }else {
            // Admin/Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }
      }
    )

  }

  /**
   * Show assigned poll deelte confirmation modal
   * @param pollId 
   */
  openDeleteModal(pollId){
    this.pollId = pollId;
    $('#delete_poll').modal('show');
  }

  /**
   * Get assigned polls when page changes
   * @param event 
   */
  pageChanged(event) {
    this.offset = event;
    this.assignedPolls();
  }

  /**
   * Delete assigned poll
   */
  deletePoll(){
    let params:any      = {};
    params.meeting_id   = this.meetingId;
    params.poll_id      = this.pollId;
    params.token        = this.userDetails.token;
    this.assignPollsService.deletePoll(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
         $('#delete_poll').modal('hide');
         this.assignedPolls();
         this.pollId = "";
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          // this.router.navigateByUrl('/');
          if(this.userRoleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else if(this.userRoleId == '3'){// Registered user
            this.router.navigateByUrl('/meetings-list');
          }else {
            // Admin/Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }else{
          $('#delete_poll').modal('hide');
          this.showError(error.message);
        }
      }
    )
  }

  /**
   * Get polls
   */
  getPolls() {
    let params:any      = {};
    params.token        = this.userDetails.token;
    params.assigned_ids = this.assignedIds;
    params.route_meeting_id = this.routeMeetingId;
    this.busy = this.assignPollsService.getPolls(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          this.polls = response.body.polls;
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          // this.router.navigateByUrl('/');
          if(this.userRoleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else if(this.userRoleId == '3'){// Registered user
            this.router.navigateByUrl('/meetings-list');
          }else {
            // Admin/Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }
      }
    )
  }

  /**
   * Select poll from the list
   * @param value 
   */
  selectPoll(value){
    if(value != ""){
      this.pollId = value;
      this.pollErrorMsg ="";
    }else{
      this.pollErrorMsg ="Please choose a poll";
    }
  }

  /**
   * Assign poll to a meeting
   */
  addPoll(){
    if(this.pollId != "" && this.pollErrorMsg == ""){
      let params:any      = {};
      params.token        = this.userDetails.token;
      params.poll_id      = this.pollId;
      params.meeting_id   = this.meetingId;
      this.assignPollsService.assignPoll(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
              this.assignedPolls();
              this.pollId = "";
              this.showSuccess(response.message);
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            // this.router.navigateByUrl('/');
            if(this.userRoleId == '1') {
              this.router.navigateByUrl('/admin/login');
            }else{
              this.router.navigateByUrl('/');
            }
          }else{
            this.showError(error.message);
          }
        }
      )
    }else{
      this.pollErrorMsg ="Please choose a poll";
    }
  }

}
