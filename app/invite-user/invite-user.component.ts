import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { InviteUserService } from 'app/invite-user/invite-user.service';
import { User } from 'app/shared/user';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Config } from 'app/config/config';
declare var $:any;
@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css'],
  providers: [InviteUserService]
})
export class InviteUserComponent implements OnInit {
  meetingId = '';
  public userRoles = [{'name': 'Attendee', 'value': '1'}, {'name': 'Presenter', 'value': '2'}, {'name': 'Expert', 'value': '3'}];
  public selectedRole = '';
  public invitationParams:any = {};
  public userDetails;
  public invitationContent = '';
  public roleId = '';
  public selectedUserRole = '';
  public selectedUserRoleName = '';
  public invitationDetails:any = {};
  public userEmails = '';
  public details:any = {};
  public file = '';
  public fileExists = 0;
  public uploadPath = '';
  public invitationContentError = 0;
  public invitationEmailsError = 0;
  public invitationCsvError = 0;
  public csvFilename = '';
  public invitationParamsError = 0;
  constructor(private router:Router, private activatedRoute:ActivatedRoute, private inviteUserService:InviteUserService, private user:User, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.userDetails   = user.getUser();
    this.toastr.setRootViewContainerRef(vcr);
    this.uploadPath = Config.UPLOAD_PATH;
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

  getInvitationContent(event, roleId, roleName) {
    this.invitationContentError = 0;
    this.selectedRole = roleName;
    this.roleId = roleId;
    this.invitationParams.token = this.userDetails.token;
    this.invitationParams.meeting_id = this.meetingId;
    this.invitationParams.meeting_role_id = roleId;
    this.inviteUserService.getInvitationContent(this.invitationParams).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success==1){
          if((response.body.invitation_content).length > 0){
            this.invitationContent = response.body.invitation_content[0]['content'];
          }else{
            this.invitationContent = '';
          }
        }
      },
      (error) => {
        // console.log(error)
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          // this.socialLoginComponent.logout();
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  saveInvitationContent(event, invitationContentInfo:NgForm) {
    if(this.roleId != ''){
      if(invitationContentInfo.value.invitationContent != ''){
        this.invitationParams.email_content = invitationContentInfo.value.invitationContent;
        this.invitationParams.token = this.userDetails.token;
        this.inviteUserService.saveInvitationContent(this.invitationParams).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.invitationContentError = 0;
              this.showSuccess('Invitation content updated successfully');
            }
          },
          (error) => { 
            console.log(error);
            error = JSON.parse(error['_body']);
            this.showError(error.message);
            // console.log(error)
            if(error.message == 'Login failed'){
              // this.socialLoginComponent.logout();
              this.user.logOut();
              this.router.navigateByUrl('/');
            }
          }
        );
      }else{
        this.invitationContentError = 1;
      }
    }
  }

  selectUserRole(event, roleId, roleName) {
    this.selectedUserRole   = roleId;
    this.selectedUserRoleName = roleName;
    this.invitationCsvError = 0;
    this.invitationEmailsError = 0;
    this.invitationParamsError = 0;
  }

  files : FileList; 
  getFiles(event){ 
    if(event.target.files && event.target.files[0]) {
      if((event.target.files[0].type == "application/vnd.ms-excel") || (event.target.files[0].type == "text/csv") || (event.target.files[0].type == "application/csv") || (event.target.files[0].type == "text/comma-separated-values")){
          this.files = event.target.files;
          this.fileExists = 1;
          let csvName = this.files[0].name;
          this.csvFilename = csvName;
          this.invitationCsvError = 0;
      }else{
        this.invitationCsvError = 1;
        this.csvFilename = '';
      }
    }else{
      this.fileExists =0;
      this.invitationCsvError = 0;
      this.csvFilename = '';
      $("#invitaionFile").value = "";
    }
  } 

  sendInvitation(event, invitation:NgForm) {
    if(invitation.valid) {
      // console.log(this.files[0]);
      if(this.selectedUserRole != '') {
        let formData:FormData = new FormData();
        this.details.token = this.userDetails.token;
        this.details.meeting_id = this.meetingId;
        this.details.meeting_role_id = this.selectedUserRole;
        this.details.user_emails = invitation.value.userEmails;
        
        // if(this.details.user_emails == ''){
        if(!this.details.user_emails){
          this.invitationEmailsError = 1;
        }else{
          this.invitationEmailsError = 0;
        }

        if(this.fileExists == 1){
          if(this.invitationCsvError == 1){
            this.invitationParamsError = 1;
          }else{
            this.invitationParamsError = 0;
          }
        }else{
          if(this.invitationEmailsError == 1){
            this.invitationParamsError = 1;
          }else{
            this.invitationParamsError = 0;
          }
        }

        // if(this.invitationEmailsError == 1 && this.invitationCsvError == 1){
        //   this.invitationParamsError = 1;
        // }else{
        //   this.invitationParamsError = 0;
        // }

        if(this.invitationParamsError == 0){
          formData.append('details', JSON.stringify(this.details));
          if(this.files){
            formData.append('file', this.files[0]); 
          }
          this.inviteUserService.sendInvitation(formData).subscribe(
            (response:any) => {
              response = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess(response.message);
                // invitation.resetForm();
                this.csvFilename = '';
                this.fileExists = 0;
                // this.invitationCsvError = 0;
                // this.csvFilename = '';
                // $("#invitaionFile").value = "";
                $('input[type="file"]').value = "";
              }
            },
            (error) => { 
              error = JSON.parse(error['_body']);
              // this.showError($(error.message).text());
              // this.showError(error.message);
              if(error.message == 'Login failed'){
                // this.socialLoginComponent.logout();
                this.user.logOut();
                this.router.navigateByUrl('/');
              }else{
                this.showError(error.message);
              }
            }
          );
        }

      
      }
    }
  }

  removeTags(myString) {
    myString.replace(/<(?:.|\n)*?>/gm, '');
  }

}
