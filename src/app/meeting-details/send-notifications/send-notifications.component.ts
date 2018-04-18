import { Component, OnInit, Output, ViewContainerRef} from '@angular/core';
import { User } from 'app/shared/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { NgForm } from '@angular/forms';
import { StorageService } from "app/shared/storage.service";
import { SendNotificationsService } from 'app/meeting-details/send-notifications/send-notifications.service';

declare var $:any;

@Component({
  selector: 'app-send-notifications',
  templateUrl: './send-notifications.component.html',
  styleUrls: ['./send-notifications.component.css'],
  providers: [MeetingDetailsService, SendNotificationsService]
})

export class SendNotificationsComponent implements OnInit {

  public meetingStatus;
  errorMsg          = '';
  successMsg        = '';
  content_error     = false;
  status_error      = false;
  mail_content      = "";
  isError           = false;
  meetingId         = "";
  invitee_status:number;
  public userDetails;
  public userRoleId;
  public urlPrefix = '';
  public isRescheduled:boolean = false;

  constructor(private user: User, private activatedRoute:ActivatedRoute, private meetingDetailsService: MeetingDetailsService, private router:Router, private sendNotificationsService:SendNotificationsService, public toastr: ToastsManager, vcr: ViewContainerRef) {
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
    });
    this.getMeetingStatus();
    if(this.meetingStatus == 1){
      this.invitee_status    = 1;
    }else{
      this.invitee_status    = 3;
    }
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
   * Send notifications
   * @param event 
   * @param formData 
   */
  onSubmit(event,formData:NgForm){
    // console.log(formData.value)
    this.content_error = false; 
    this.status_error  = false;
    this.isError       = false;
    if(formData.valid){
      if(formData.value.mail_content == ""){
          this.content_error = true; 
          this.isError       = true;
      }
      if(formData.value.invitee_status == ""){
          this.status_error = true;
          this.isError       = true;
      }
      if(!this.isError){ 
         if(this.meetingStatus == 0){
            formData.value.token       = this.userDetails.token;
            formData.value.meeting_id  = this.meetingId;
            this.sendNotificationsService.sendNotification(formData).subscribe(
              (response) => this.processSuccessData(response,formData),
              (error) => this.procesErrorData(error)
            );
         }else{
            formData.value.token       = this.userDetails.token;
            formData.value.meeting_id  = this.meetingId;
            this.sendNotificationsService.sendPastNotification(formData).subscribe(
              (response) => this.processSuccessData(response,formData),
              (error) => this.procesErrorData(error)
            );
         }
      }
    }
  }

  /**
   * Show success message after sent notification
   * @param response 
   * @param formData 
   */
  processSuccessData(response,formData){console.log(response);
    response = JSON.parse(response['_body']);
    this.mail_content = "";
    if(response.success == '1'){ 
        this.successMsg     = 'Notification sent successfully';
        this.showSuccess(this.successMsg);
        
    }
  }

  /**
   * Show error message after sent notification
   * @param response 
   */
  procesErrorData(response){
    response = JSON.parse(response['_body']); 
    this.errorMsg   = response.message.replace(/<\/?[^>]+(>|$)/g, "");
    this.showError(this.errorMsg);
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
          if(this.meetingStatus == 1){
            this.invitee_status    = 1;
          }else{
            this.invitee_status    = 3;
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

}
