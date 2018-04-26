import { Component, OnInit,Output,ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from "app/shared/user";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { MeetingSecuritySettingsService } from 'app/meeting-security-settings/meeting-security-settings.service';

declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'app-meeting-security-settings',
  templateUrl: './meeting-security-settings.component.html',
  styleUrls: ['./meeting-security-settings.component.css'],
  providers : [MeetingSecuritySettingsService]
})
export class MeetingSecuritySettingsComponent implements OnInit {
  
  public meetingId = '';
  public userDetails:any;
  public token:any;
  public securityDetails:any;
  public security_type;
  public blacklist:any;
  public whitelist:any;
  public securityInfoParmas:any;
  public errorMsg:any;
  public errorblacklist="";
  public errorwhitelist="";
  public repeated_domain_err ="";
  blacklist_duplicate_domain_err = "";
  whitelist_duplicate_domain_err="";
  constructor(private router:Router, private activatedRoute:ActivatedRoute,private meetingSecuritySettingsService:MeetingSecuritySettingsService,private user:User, public toastr: ToastsManager, vcr: ViewContainerRef) {
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

    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    this.security_type  = 1;
    var params ={'token':this.token,'meeting_id':this.meetingId };
    // To get the details of security settings of a meeting
    this.meetingSecuritySettingsService.getSecurityInfo(params)
          .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
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
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }
             // this.showError(error.message);
            }
          );
  }


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
    var re                        = /^\s*(?:(?:\w+(?:-+\w+)*\.)+[a-z]+)\s*(?:,\s*(?:(?:\w+(?:-+\w+)*\.)+[a-z]+)\s*)*$/;
    
    if(blacklist_string){
      console.log(blacklist_string)
      if(!re.test(blacklist_string)){
          this.errorblacklist  = 'blacklist';
          this.errorMsg++;
      }
    }
    if(whiltelist_string){
      console.log(blacklist_string)
      if(!re.test(whiltelist_string)){
          this.errorwhitelist  = 'whitelist';
          this.errorMsg++;
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
        this.meetingSecuritySettingsService.saveSecurityInfo(this.securityInfoParmas).subscribe(
            (response:any) => {
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

}
