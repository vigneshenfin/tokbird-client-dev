import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { InviteUsersService } from 'app/meeting-details/invite-users/invite-users.service';
import { User } from 'app/shared/user';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Config } from 'app/config/config';
import { StaticService } from 'app/shared/staticdata';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';

import { FileUtil } from 'app/meeting-details/invite-users/file.util';
import { Constants } from 'app/meeting-details/invite-users/test.constants';

declare var $:any;
declare var tinymce: any;

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.css'],
  providers: [InviteUsersService, MeetingDetailsService,StaticService, FileUtil]
})

export class InviteUsersComponent implements OnInit {

  meetingId = '';
  public userRoles = [{'name': 'Attendee', 'value': '1'}, {'name': 'Presenter', 'value': '2'}, {'name': 'Expert', 'value': '3'}];
  public selectedRole = '';
  public timeZones;
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
  public meetingStatus;
  public userRoleId;
  public urlPrefix = '';
  files : FileList;
  public disableSubmit:boolean = false;
  public isRescheduled:boolean = false;

  @ViewChild('fileImportInput')
  fileImportInput: any;
  csvRecords = [];

  constructor(private staticService:StaticService,private router:Router, private activatedRoute:ActivatedRoute, private inviteUsersService:InviteUsersService, private user:User, public toastr: ToastsManager, vcr: ViewContainerRef, private meetingDetailsService: MeetingDetailsService, private _fileUtil: FileUtil) {
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
    this.uploadPath = Config.UPLOADS_PATH;
    this.timeZones     = this.staticService.getTimezones();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    this.getMeetingStatus();
  }

  /**
   * Show toastr success message
   * @param msg 
   */
  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }

  /**
   * Show toatr error message
   * @param msg 
   */
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  /**
   * Get invitation content based on role(Attendee, Presenter, Expert)
   * @param event 
   * @param roleId 
   * @param roleName 
   */
  getInvitationContent(event, roleId, roleName) {
    this.invitationContentError = 0;
    this.selectedRole = roleName;
    this.roleId = roleId;
    this.invitationParams.token = this.userDetails.token;
    this.invitationParams.meeting_id = this.meetingId;
    this.invitationParams.meeting_role_id = roleId;
    this.inviteUsersService.getInvitationContent(this.invitationParams).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success==1){
          if((response.body.invitation_content).length > 0){
            this.invitationContent = response.body.invitation_content[0]['content'];
            if (tinymce.activeEditor) {
              tinymce.activeEditor.setContent(this.invitationContent, { format: 'raw' });
            }
          }else{
            this.invitationContent = '';
          }
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          if(this.userRoleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else{
            this.router.navigateByUrl('/');
          }
        }
      }
    );
  }

  /**
   * Save invitation content of a role(Attendee, Presenter, Expert)
   * @param event 
   * @param invitationContentInfo 
   */
  saveInvitationContent(event, invitationContentInfo:NgForm) { // NOT USING
    if(this.roleId != ''){
      if(invitationContentInfo.value.invitationContent != ''){
        this.invitationParams.email_content = invitationContentInfo.value.invitationContent;
        this.invitationParams.token = this.userDetails.token;
        this.inviteUsersService.saveInvitationContent(this.invitationParams).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.invitationContentError = 0;
              this.showSuccess('Invitation content updated successfully');
            }
          },
          (error) => { 
            error = JSON.parse(error['_body']);
            this.showError(error.message);
            if(error.message == 'Login failed'){
              this.user.logOut();
              if(this.userRoleId == '1') {
                this.router.navigateByUrl('/admin/login');
              }else{
                this.router.navigateByUrl('/');
              }
            }
          }
        );
      }else{
        this.invitationContentError = 1;
      }
    }
  }

  /**
   * Select user role
   * @param event 
   * @param roleId 
   * @param roleName 
   */
  selectUserRole(event, roleId, roleName) { // NOT USING
    this.selectedUserRole   = roleId;
    this.selectedUserRoleName = roleName;
    this.invitationCsvError = 0;
    this.invitationEmailsError = 0;
    this.invitationParamsError = 0;
  }

  /**
   * Invitation file input change
   * @param event 
   */
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

  /**
   * Invite users
   * 
   * @param event 
   * @param invitation 
   */
  meetingInviteUsers(event, invitation:NgForm) {
    let errors = 0;
    if(this.roleId != ''){
      if(this.invitationContent != ''){
        this.invitationContentError = 0;
      }else{
        errors++;
        this.invitationContentError = 1;
      }
    }else{
      errors++;
    }
    if(errors > 0){
    }else{
      let formData:FormData = new FormData();
      let params:any = {};
      params.token            = this.userDetails.token;
      params.meeting_id       = this.meetingId;
      params.meeting_role_id  = this.roleId;
      params.user_emails      = invitation.value.userEmails;
      params.invitation_content = invitation.value.invitationContent;
      if(!params.user_emails){
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
      if(this.invitationParamsError == 0){
        this.disableSubmit = true;
        formData.append('details', JSON.stringify(params));
        if(this.files){
          formData.append('file', this.files[0]); 
        }
        this.inviteUsersService.meetingInviteUsers(formData).subscribe(
          (response:any) => {
            this.disableSubmit = false;
            response = JSON.parse(response['_body']);
            if(response.success == 1){
              this.showSuccess(response.message);
              this.csvFilename = '';
              this.fileExists = 0;
              $('input[type="file"]').value = "";
              this.selectedRole = '';
              invitation.resetForm();
            }
          },
          (error) => { 
            this.disableSubmit = false;
            error = JSON.parse(error['_body']);
            this.showError(error.message);
            if(error.message == 'Login failed'){
              this.user.logOut();
              if(this.userRoleId == '1') {
                this.router.navigateByUrl('/admin/login');
              }else{
                this.router.navigateByUrl('/');
              }
            }
          }
        );
      }
    }

  }

  /**
   * Send invitation to email addresses
   * @param event 
   * @param invitation 
   */
  sendInvitation(event, invitation:NgForm) { // NOT USING
    this.disableSubmit = true;
    if(invitation.valid) {
      if(this.selectedUserRole != '') {
        let formData:FormData = new FormData();
        this.details.token = this.userDetails.token;
        this.details.meeting_id = this.meetingId;
        this.details.meeting_role_id = this.selectedUserRole;
        this.details.user_emails = invitation.value.userEmails;
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
        if(this.invitationParamsError == 0){
          formData.append('details', JSON.stringify(this.details));
          if(this.files){
            formData.append('file', this.files[0]); 
          }
          this.inviteUsersService.sendInvitation(formData).subscribe(
            (response:any) => {
              this.disableSubmit = false;
              response = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess(response.message);
                this.csvFilename = '';
                this.fileExists = 0;
                $('input[type="file"]').value = "";
              }
            },
            (error) => { 
              this.disableSubmit = false;
              error = JSON.parse(error['_body']);
              this.showError(error.message);
              if(error.message == 'Login failed'){
                this.user.logOut();
                if(this.userRoleId == '1') {
                  this.router.navigateByUrl('/admin/login');
                }else{
                  this.router.navigateByUrl('/');
                }
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
          if(meeting.meeting_status != 3){
            this.meetingStatus = 0;
            if(meeting.is_rescheduled){
              if(meeting.is_rescheduled == 1){
                this.isRescheduled = true;
              }
            }
          }else{
            if(this.userRoleId == '3'){
              // Registered user
              this.router.navigateByUrl('/meetings-list');
            }else if(this.userRoleId == '2'){
              // Facilitator
              this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
            }else if(this.userRoleId == '1'){
              // Admin
              this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
            }
          }
        }else{
          if(this.userRoleId == '3'){
            // Registered user
            this.router.navigateByUrl('/meetings-list');
          }else if(this.userRoleId == '2'){
            // Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }else if(this.userRoleId == '1'){
            // Admin
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          if(this.userRoleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else{
            this.router.navigateByUrl('/');
          }
        }else{
          if(this.userRoleId == '3'){
            // Registered user
            this.router.navigateByUrl('/meetings-list');
          }else if(this.userRoleId == '2'){
            // Facilitator
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }else if(this.userRoleId == '1'){
            // Admin
            this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
          }
        }
      }
    )
  }

  /**
   * Get meeting details
   */
  getUserMeeting(){
    if(this.meetingId != ''){
       let params:any = {};
       params.meeting_id = this.meetingId;
       params.token = this.userDetails.token;
       params.route_meeting_id = this.meetingId;
       this.inviteUsersService.getUserMeeting(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.body.meeting){
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            if(this.userRoleId == '1') {
              this.router.navigateByUrl('/admin/login');
            }else{
              this.router.navigateByUrl('/');
            }
          }else {
            if(this.roleId == '3'){
              // Registered user
              this.router.navigateByUrl('/meetings-list');
            }else {
              // Admin/Facilitator
              this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
            }
          }
        }
      );
    }
  }

  /**
   * Get invitation content and invited users based on role - new requirement
   * @param event 
   * @param roleId 
   * @param roleName 
   * @date 2018-02-01
   */
  getInvitationDetails(event, roleId, roleName) {
    this.invitationContentError = 0;
    this.selectedRole = roleName;
    this.roleId = roleId;
    this.invitationParams.token = this.userDetails.token;
    this.invitationParams.meeting_id = this.meetingId;
    this.invitationParams.meeting_role_id = roleId;
    this.inviteUsersService.getInvitationDetails(this.invitationParams).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success==1){
          if(response.body.invitation_content != ''){
            this.invitationContent = response.body.invitation_content;
            if (tinymce.activeEditor) {
              tinymce.activeEditor.setContent(this.invitationContent, { format: 'raw' });
            }
          }else{
            this.invitationContent = '';
          }
          if(!response.body.invited_users){
            this.userEmails = '';
          }else{
            this.userEmails = response.body.invited_users;
          }
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          if(this.userRoleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else{
            this.router.navigateByUrl('/');
          }
        }
      }
    );
  }

  // METHOD CALLED WHEN CSV FILE IS IMPORTED
  /**
   * CSV file input change
   * @param  
   */
  fileChangeListener($event): void {
    var text = [];
    var files = $event.srcElement.files;
    if(Constants.validateHeaderAndRecordLengthFlag){
      if(typeof files[0] != 'undefined'){
        if(!this._fileUtil.isCSVFile(files[0])){
          // alert("Please import valid .csv file.");
          this.showError("Please import valid .csv file");
          this.fileReset();
        }
      }else{
        this.fileReset();
      }
    }
    if(typeof files[0] != 'undefined'){
      var input = $event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = (data) => {
        let csvData = reader.result;
        let csvRecordsArray = csvData.split(/\r\n|\n/);
        var headerLength = -1;
        if(Constants.isHeaderPresentFlag){
          let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
          headerLength = headersRow.length; 
        }
        this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
            headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
        if(this.csvRecords == null){
          //If control reached here it means csv file contains error, reset file.
          this.fileReset();
        }else{
          this.csvImport();
        }   
      }
      reader.onerror =  () => {
        // alert('Unable to read ' + input.files[0]);
        this.showError('Unable to read ' + input.files[0]);
      };
    }
  };
 
  /**
   * Reset file input
   */
  fileReset(){
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

  /**
   * Import CSV
   */
  csvImport() {
    if(this.csvRecords.length > 1){
      let csvEmails:any = [];
      if(this.userEmails != ''){
        csvEmails = this.userEmails.split(',');
      }
      this.csvRecords.splice(0, 1);
      for(let i=0; i<this.csvRecords.length; i++){
        if(typeof this.csvRecords[i][0].length != 'undefined'){
          if(this.validateEmail(this.csvRecords[i][0])){
            csvEmails.push(this.csvRecords[i][0]);
          }
        }
      }
      let uniqueEmails = csvEmails.filter( this.onlyUnique );
      this.userEmails = uniqueEmails.join();
      this.fileReset();
    }
  }

  /**
   * Get unique values
   * @param value 
   * @param index 
   * @param self 
   */
  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }

  /**
   * Validate email address
   * @param email 
   */
  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
}
