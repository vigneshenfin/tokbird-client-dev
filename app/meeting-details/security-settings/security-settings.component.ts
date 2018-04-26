import { Component, OnInit, Output, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Config } from 'app/config/config';
import { NgForm } from '@angular/forms';
import { User } from "app/shared/user";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SecuritySettingsService } from 'app/meeting-details/security-settings/security-settings.service';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { MESSAGE } from "app/shared/message";

declare var $:any;

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.css'],
  providers : [SecuritySettingsService, MeetingDetailsService]
})
export class SecuritySettingsComponent implements OnInit {

  public meetingId = '';
  public userDetails:any;
  public token:any;
  public uploadPath = '';
  public securityDetails:any;
  public security_type;
  public blacklist:any = '';
  public whitelist:any = '';
  public securityInfoParmas:any;
  public errorMsg:any;
  public errorblacklist="";
  public errorwhitelist="";
  public repeated_domain_err ="";
  blacklist_duplicate_domain_err = "";
  whitelist_duplicate_domain_err="";
  public meetingStatus;
  public roleId;
  public urlPrefix = '';
  public accessCode = '';
  public accessDenied:boolean = false;
  public allDataFetched:boolean = false;
  public accessMessage = '';
  public disableRadio = '';
  public disableSubmit:boolean = false;
  public isRescheduled:boolean = false;

  @ViewChild('blackFileImportInput') blackFileImportInput;
  @ViewChild('whiteFileImportInput') whiteFileImportInput;
  // blackFileImportInput: any;
  // whiteFileImportInput: any;

  constructor(private router:Router, private activatedRoute:ActivatedRoute,private securitySettingsService:SecuritySettingsService,private user:User, public toastr: ToastsManager, vcr: ViewContainerRef, private meetingDetailsService: MeetingDetailsService) {
    this.userDetails   = user.getUser();
    this.token         = this.userDetails.token;
    this.toastr.setRootViewContainerRef(vcr);
    this.uploadPath = Config.UPLOADS_PATH;
    // Added - 14/11/2017
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    this.getMeetingStatus();
    this.security_type  = 1;
    var params ={'token':this.token,'meeting_id':this.meetingId };
    // To get the details of security settings of a meeting
    this.securitySettingsService.getSecurityInfo(params)
    .subscribe(
      (response:any) => {
        this.allDataFetched = true;
        response   = JSON.parse(response['_body']);
        if(response.body.access_code){
          this.accessCode = response.body.access_code;
        }
        if(response.body.access_denied == 1){
          this.accessDenied = true;
          this.accessMessage = MESSAGE.EDIT_PERMISSION_DENIED;
        }
        if(response.success == 1){
          this.securityDetails = response.body.meeting_security;
          if(this.securityDetails !== {}){
            this.security_type  = parseInt(this.securityDetails.security_type);
            this.blacklist      = this.securityDetails.blacklist;
            this.whitelist      = this.securityDetails.whitelist;
          }
        }
      },
      (error) => {
        this.allDataFetched = true;
        error = JSON.parse(error['_body']);
        if(error.body.access_code){
          this.accessCode = error.body.access_code;
        }
        if(error.body.access_denied == 1){
          this.accessDenied = true;
          this.accessMessage = MESSAGE.EDIT_PERMISSION_DENIED;
          this.disableRadio = "disabled";
        }
        if(error.message == "Login failed"){
          this.user.logOut();
          // this.router.navigateByUrl('/');
          if(this.roleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else{
            this.router.navigateByUrl('/');
          }
          this.showError(error.message);
        }
        // this.showError(error.message);
      }
    );
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
   */
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  /**
   * Save security settings of a meeting
   * @param event 
   * @param securityInfo 
   */
  onSubmit(event,securityInfo:NgForm){
    this.errorwhitelist           = "";
    this.errorblacklist           = "";
    securityInfo.value.token      = this.token;
    securityInfo.value.meeting_id = this.meetingId;
    this.securityInfoParmas       = JSON.stringify(securityInfo.value);
    let whiltelist_string         = "";
    let blacklist_string          = "";
    if(securityInfo.value.blacklist){
       blacklist_string          = securityInfo.value.blacklist.replace(/\s/g, '');
    }
    if(securityInfo.value.whitelist){
       whiltelist_string         = securityInfo.value.whitelist.replace(/\s/g, '');
    }
    this.errorMsg                 = 0;
    // Changed - 08/03/2018 - For domain and email addresses in whitelist and blacklist
    // var re                        = /^\s*(?:(?:\w+(?:-+\w+)*\.)+[a-z]+)\s*(?:,\s*(?:(?:\w+(?:-+\w+)*\.)+[a-z]+)\s*)*$/;
    // if(blacklist_string){
    //   // console.log(blacklist_string)
    //   if(!re.test(blacklist_string)){
    //       this.errorblacklist  = 'blacklist';
    //       this.errorMsg++;
    //   }
    // }
    // if(whiltelist_string){
    //   // console.log(blacklist_string)
    //   if(!re.test(whiltelist_string)){
    //       this.errorwhitelist  = 'whitelist';
    //       this.errorMsg++;
    //   }
    // }
    // Added - 08/03/2018 - For domain and email addresses in whitelist and blacklist
    if(blacklist_string){
      if(blacklist_string != ''){
        let blacklistArray = blacklist_string.split(',');
        for(let i=0; i<blacklistArray.length; i++){
          if((!this.validateEmail(blacklistArray[i])) && (!this.isValidDomain(blacklistArray[i]))){
            this.errorblacklist = 'blacklist';
            this.errorMsg++;
          }
        }
      }
    }
    if(whiltelist_string != ''){
      if(whiltelist_string != ''){
        let whitelistArray = whiltelist_string.split(',');
        for(let i=0; i<whitelistArray.length; i++){
          if((!this.validateEmail(whitelistArray[i])) && (!this.isValidDomain(whitelistArray[i]))){
            this.errorwhitelist = 'whitelist';
            this.errorMsg++;
          }
        }
      }
    }
    if(blacklist_string && whiltelist_string){
        let blacklist_array  = blacklist_string.split(',');
        let whiltelist_array = whiltelist_string.split(',');
        var res = blacklist_array.filter(function(v) { // iterate over the array
          // check element present in the second array
          return whiltelist_array.indexOf(v) > -1;
          // or array2.includes(v)
        })
        if(res.length != 0){
          this.repeated_domain_err ='You cannot set same domain name in both blacklist and whitelist';
          this.errorMsg++;
        }else{
          this.repeated_domain_err ="";
        }
        let sorted_blacklist_array = blacklist_array.slice().sort();
        var blacklist_results                = [];
        for (var i = 0; i < blacklist_array.length - 1; i++) {
            if (sorted_blacklist_array[i + 1] == sorted_blacklist_array[i]) {
                blacklist_results.push(sorted_blacklist_array[i]);
            }
        }
        let sorted_whitelist_array = whiltelist_array.slice().sort();
        var whitelist_results                = [];
        for (var i = 0; i < whiltelist_array.length - 1; i++) {
            if (sorted_whitelist_array[i + 1] == sorted_whitelist_array[i]) {
                whitelist_results.push(sorted_whitelist_array[i]);
            }
        }
        if(blacklist_results.length != 0){
          this.blacklist_duplicate_domain_err ='Please remove duplicate domain names';
          this.errorMsg++;
        }else{
           this.blacklist_duplicate_domain_err ="";
        }
        if(whitelist_results.length != 0){
          this.whitelist_duplicate_domain_err ='Please remove duplicate domain names';
          this.errorMsg++;
        }else{
           this.whitelist_duplicate_domain_err ="";
        }
    }
    // save the security setting if there is no validation error
    if(this.errorMsg == 0){
      this.disableSubmit = true;
        this.securitySettingsService.saveSecurityInfo(this.securityInfoParmas).subscribe(
            (response:any) => {
              this.disableSubmit = false;
              response = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess(response.message);
                this.repeated_domain_err ="";
                this.errorwhitelist  = "";
                this.errorblacklist  = "";
              }
            },
            (error) => { 
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }
            }
        ); 
    }
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
            this.router.navigateByUrl('/meetings-list');
          }
        }else{
          this.router.navigateByUrl('/meetings-list');
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          // this.router.navigateByUrl('/');
          if(this.roleId == '1') {
            this.router.navigateByUrl('/admin/login');
          }else{
            this.router.navigateByUrl('/');
          }
        }else{
          // this.router.navigateByUrl('/meetings-list');
          if(this.roleId == '3'){
            // Registered user
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
   * Upload blacklist CSV
   * @param files 
   */
  public blackFileChangeListener(files: FileList){
    if(files && files.length > 0) {
       let file : File = files.item(0); 
        if((file.type != "application/vnd.ms-excel") && (file.type != "text/csv") && (file.type != "application/csv") && (file.type != "text/comma-separated-values")){
          this.showError('Invalid file');
        }else{
           let reader: FileReader = new FileReader();
           reader.readAsText(file);
           reader.onload = (e) => {
              let csv: string = reader.result;
              var delimiter = ',';
              var allTextLines = csv.split(/\r\n|\n/);
              var result = allTextLines.map(function(line) {
              	return line.split(delimiter);
              });
              this.processBlackList(result);
           }
        }
      }
  }

  /**
   * Upload whitelist CSV
   * @param files 
   */
  public whiteFileChangeListener(files: FileList){
    if(files && files.length > 0) {
       let file : File = files.item(0); 
        if((file.type != "application/vnd.ms-excel") && (file.type != "text/csv") && (file.type != "application/csv") && (file.type != "text/comma-separated-values")){
          this.showError('Invalid file');
        }else{
           let reader: FileReader = new FileReader();
           reader.readAsText(file);
           reader.onload = (e) => {
              let csv: string = reader.result;
              var delimiter = ',';
              var allTextLines = csv.split(/\r\n|\n/);
              var result = allTextLines.map(function(line) {
              	return line.split(delimiter);
              });
              this.processWhiteList(result);
           }
        }
      }
  }
 
  /**
   * Reset file input
   */
  blackFileReset(){
    this.blackFileImportInput.nativeElement.value = "";
  }

  /**
   * Reset whitelist file input
   */
  whiteFileReset(){
    this.whiteFileImportInput.nativeElement.value = "";
  }

  /**
   * Process blacklist email addresses or domain names
   * @param results 
   */
  processBlackList(results) {
    results.shift(); // Remove first element - header
    let blackListCsv:any = [];
    if(this.blacklist != ''){
        blackListCsv = this.blacklist.split(',');
      }
    for(let i=0; i<results.length; i++){
      // Validate email or domain name
      let isValid = 0;
      let fieldValue = results[i][0];
      if(this.isValidDomain(fieldValue)){
        isValid = 1;
      }else if(this.validateEmail(fieldValue)){
        isValid = 1;
      }
      if(isValid == 1){
        blackListCsv.push(fieldValue);
      }
    }
    // console.log(blackListCsv);
    let uniqueValues = blackListCsv.filter( this.onlyUnique );
    this.blacklist = uniqueValues.join();
    // console.log(this.blackFileImportInput.nativeElement.files);
    this.blackFileReset();
    // console.log(this.blackFileImportInput.nativeElement.files);
  }

  /**
   * Process whitelist email addresses and domain names
   * @param results 
   */
  processWhiteList(results) {
    results.shift(); // Remove first element - header
    let whiteListCsv:any = [];
    if(this.whitelist != ''){
      whiteListCsv = this.whitelist.split(',');
    }
    for(let i=0; i<results.length; i++){
      // Validate email or domain name
      let isValid = 0;
      let fieldValue = results[i][0];
      if(this.isValidDomain(fieldValue)){
        isValid = 1;
      }else if(this.validateEmail(fieldValue)){
        isValid = 1;
      }
      if(isValid == 1){
        whiteListCsv.push(fieldValue);
      }
    }
    let uniqueValues = whiteListCsv.filter( this.onlyUnique );
    this.whitelist = uniqueValues.join();
    this.whiteFileReset();
  }

  /**
   * Validate domain name
   * @param v 
   */
  isValidDomain(v) {
    if (!v) return false;
    var re = /^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/gi;
    return re.test(v);
  }

  /**
   * Validate email address
   * @param email 
   */
  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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

}
