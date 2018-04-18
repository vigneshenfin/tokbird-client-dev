import { Component, OnInit,Output,ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from "app/shared/user";
import { StorageService } from "app/shared/storage.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SendNotificationService } from 'app/send-notification/send-notification.service';
declare var $:any;
@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.css'],
  providers : [SendNotificationService]
})
export class SendNotificationComponent implements OnInit {

  
  errorMsg      = '';
  successMsg    = '';
  content_error = false;
  status_error  = false;
  mail_content  = "";
  isError       = false;
  meetingId     = "";
  invitee_status = 3;
  public userDetails;
  constructor(private sendNotificationService:SendNotificationService,private user:User,private router:Router, private activatedRoute:ActivatedRoute, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.userDetails     = user.getUser();
    this.toastr.setRootViewContainerRef(vcr);
   }
  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
  }

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
        formData.value.token       = this.userDetails.token;
        formData.value.meeting_id  = this.meetingId;
        this.sendNotificationService.sendNotification(formData).subscribe(
                (response) => this.processSuccessData(response,formData),
                (error) => this.procesErrorData(error)
              );
      }
      
    }
  }

  processSuccessData(response,formData){console.log(response);
    response = JSON.parse(response['_body']);
    this.mail_content = "";
    if(response.success == '1'){ 
        this.successMsg     = 'Notification sent successfully';
        this.showSuccess(this.successMsg);
        
    }
  }

  procesErrorData(response){
    response = JSON.parse(response['_body']); 
    this.errorMsg   = response.message.replace(/<\/?[^>]+(>|$)/g, "");
    this.showError(this.errorMsg);
  }
  
}
