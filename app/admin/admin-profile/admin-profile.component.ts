import { Component, OnInit,Output,ViewContainerRef,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { User } from "app/shared/user";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ProfileService} from 'app/profile/profile.service';
import { StaticService } from 'app/shared/staticdata';
declare var $:any;

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
  providers:[ProfileService,StaticService,DatePipe]
})
export class AdminProfileComponent implements OnInit {

  @ViewChild('j') change_pwd_form;
  public userDetails;
  public token;
  public user_email;
  public userId;
  public us_provider;
  public timeZones;
  public timezone = "-05:00 US/Central";
  public userData;
  files : FileList; 
  public profile_image;
  public fileExtension;
  public prof_pic_error;
  public profile_img;
  public upload_image_name;
  public us_name;
  public email;
  public errorMsg;
  public correctPwd = false;
  public SuccessMsg = "";
  public details:any = {};
  public emailErrorMsg="";
  public timezoneErrorMsg="";
  public nameErrorMsg ="";
  public subscription_plan="";
  public subscription:any ="";
  public successClass= 'success-hide';
  public successMsg = "";
  constructor(private router:Router, private activatedRoute:ActivatedRoute,private profileService:ProfileService,private user:User, public toastr: ToastsManager, vcr: ViewContainerRef,private staticService:StaticService,private datePipe :DatePipe) {
    this.userDetails   = user.getUser();
    this.token         = this.userDetails.token;
    this.userId        = this.userDetails.id;
    this.user_email    = this.userDetails.us_email;
    this.us_provider   = this.userDetails.us_provider;
    this.toastr.setRootViewContainerRef(vcr);
    this.timeZones     = this.staticService.getTimezones();
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  ngOnInit() {
    
    var params = { 'token':this.token } ;
    this.profileService.getUserDetails(params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.userData     = response.body;
              this.us_name      = this.userData.us_name;
              this.email        = this.userData.us_email;
              this.timezone     = this.userData.us_timezone;
              this.profile_img  = this.userData.us_image;
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


  changeTimezone(value){
    if(value != ""){
      this.timezoneErrorMsg = "";
    }
  }

  // To read the files and performs file validation
  getFiles(event){
    if(event.target.files) {
      this.files                = event.target.files; 
      this.profile_image        = this.files;
      let upload_file_name      = this.profile_image[0].name;
      var allowedImgExtensions  = ["jpg","jpeg","png","JPG","JPEG"];
      this.fileExtension        = upload_file_name.split('.').pop();
      let check                 = allowedImgExtensions.filter(x => x == this.fileExtension);
      if(check.length !== 0){
          this.prof_pic_error = '';
          var reader = new FileReader();
          reader.onload       = (event) => {
          this.profile_img    = event.target['result'];
          this.user.proPicUpdateEvent(this.profile_img);
          
        }
          
          reader.readAsDataURL(event.target.files[0]);
          this.upload_image_name        = upload_file_name;
          let formData:FormData         = new FormData();
          this.details.token            = this.token;
          formData.append('details', JSON.stringify(this.details));
          if(this.profile_image){
              formData.append('profile_image', this.profile_image[0]); 
          }
          this.profileService.UploadProfileImage(formData)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.showSuccess('Profile image updated successfully');
              this.userDetails.us_image = response.body.profile_image_path;
              this.user.putUser(this.userDetails);
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
          
      }else{
          this.prof_pic_error = "Allowed image types are jpg | png | jpeg";
          this.profile_img       = "";
          this.upload_image_name = "";
      } 
         
    }
      
  }

  changePassword(){
    this.errorMsg   = "";
    this.SuccessMsg = "";
    this.change_pwd_form.resetForm();
  }

  updatePassword(event,pwdInfo:NgForm){
   
    if(pwdInfo.valid){
      var current_pwd         = pwdInfo.value.current_pwd;
      let params:any          = {};
      params.token            = this.token;
      params.current_password = current_pwd;
      this.profileService.checkCurrentPassword(params)
          .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.correctPwd = true;
                this.errorMsg   = "";
                this.SuccessMsg = "";
                if(this.correctPwd){
                var resetData         =  pwdInfo.value;
                if(resetData.new_pwd  == resetData.confirm_pwd){
                    this.errorMsg     = "";
                    let  params       = {'token': this.token,'new_password':resetData.new_pwd };
                    this.profileService.resetPassword(params)
                    .subscribe(
                      (response:any) => {
                        response   = JSON.parse(response['_body']);
                        if(response.success == 1){
                          this.SuccessMsg = 'Password reset successfully';
                          setTimeout(()=>{    //<<<---    using ()=> syntax
                                $("#chng_pwd").modal('hide');
                          },2000);
                          
                        }
                      },
                      (error) => {
                        error = JSON.parse(error['_body']);
                        if(error.message == "Login failed"){
                          this.user.logOut();
                          this.router.navigateByUrl('/');
                          this.showError(error.message);
                        }else{
                          this.errorMsg   = error.message;
                        }
                      }
                    );
                }else{
                  this.errorMsg   = 'New Password field and Confirm Password field must be same';
                }
              }
              }
            },
            (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }else{
                this.correctPwd = false;
                this.errorMsg   = 'Current Password is incorrect';
              }
            }
          );
    }
  }

 
  saveProfile(){
    let errorCount = 0;
    var re          = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(this.email ==""){
        this.emailErrorMsg   = 'Please enter email Id';
        errorCount++
    }else if(!re.test(this.email)){
        this.emailErrorMsg   = 'Enter a valid email Id';
        errorCount++
    }
    if(this.us_name == ""){
      this.nameErrorMsg   = 'Please enter name';
    }
    if(this.timezone == ""){
      this.timezoneErrorMsg   = 'Please select timezone';
      errorCount++;
    }
    if(errorCount == 0){
      let params:any      =  {};
      params.token        = this.token;
      params.name         = this.us_name;
      params.email        = this.email;
      params.timezone     = this.timezone;
      this.profileService.saveProfileData(params)
            .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.showSuccess(response.message);
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
