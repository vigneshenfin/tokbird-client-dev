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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:[ProfileService,StaticService,DatePipe]
})
export class ProfileComponent implements OnInit {
  @ViewChild('f') subscription_form;
  @ViewChild('g') payment_form;
  @ViewChild('i') contact_form;
  @ViewChild('j') change_pwd_form;
  @ViewChild('k') set_pwd_form;
  public userDetails;
  public token;
  public user_email;
  public userId;
  public us_provider;
  public timeZones;
  public timezone             = "-05:00 US/Central";
  public current_plan:number  = 1;
  public planDetails;
  public paymentOptions;
  public userData;
  public charge_text           ="";
  public payment_option;
  public payment_amount        = 0;
  files : FileList; 
  public profile_image;
  public fileExtension;
  public prof_pic_error;
  public profile_img;
  public upload_image_name;
  public us_name;
  public email;
  public errorMsg;
  public correctPwd               = false;
  public SuccessMsg               = "";
  public details:any              = {};
  public emailErrorMsg            = "";
  public timezoneErrorMsg         = "";
  public nameErrorMsg             = "";
  public subscription_plan        = "";
  public subscription:any         = "";
  public successClass             = 'success-hide';
  public successMsg               = "";
  public plan_error               = "";
  public timeperiod_error         = "";
  public expiry_date              = "";
  public current_plan_period      = "";
  public current_plan_charge:any  = "";
  public first_code:number;
  public second_code:number;
  public third_code:number;
  public fourth_code:number;
  public card_number:any;
  public month:any;
  public year:any;
  public cvv:number;
  public address:any              = "";
  public city:any                 = "";
  public state:any                = "";
  public country:any              = "";
  public zipcode:number;
  public phone_number:any         = "";
  public subscription_message:any = "";
  public payment_status:any       = "";
  public month_err:any            = "";
  public year_err:any             = "";
  public card_num_err:any         = "";
  public isBillingAddress:boolean = false;
  public loader_class:any         = "";
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
    $(document).ready(function(){
      let tabClicked = 0;
      var type = window.location.hash.substr(1);
      $('a[data-toggle="pill"]').on('show.bs.tab', function(e) {
          tabClicked = 1;
          localStorage.setItem('activeTab', $(e.target).attr('href'));
      });
      if(type == "subscription" && tabClicked == 0){
        var activeTab = "#my-subscription";
      }else{
        var activeTab = localStorage.getItem('activeTab');
      }
      

      if(activeTab){
          $('a[href="' + activeTab + '"]').tab('show');
      }

      if (typeof($.fn.inputmask) === 'undefined') {
            return;
      }
      $(":input").inputmask();
    });

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
              if(this.userData.us_address == ""){
                this.isBillingAddress = true;
              }
              console.log(this.profile_img)
              let plan_id       = this.userData.us_subscribed_plan_id;
              this.expiry_date  = this.datePipe.transform(this.userData.us_subscription_expiry, 'd MMM y');
              
              if(plan_id != '0'){
                this.current_plan         = plan_id;
                this.current_plan_period  = this.userData.current_plan_period;
                this.current_plan_charge  = this.userData.current_plan_charge;
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
          }
    );   

    this.profileService.getSubscriptionPlans(params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.planDetails = response.body.plans;
              
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

    var payment_params = { 'token':this.token ,'plan_id':1 };
    this.profileService.getPaymentOptions(payment_params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.paymentOptions = response.body;
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

  changePlan(){
    this.payment_status       = "";
    this.subscription_message = "";
    this.month_err            = "";
    this.year_err             = "";
    this.card_num_err         = "";
    this.payment_form.resetForm();
    let errorCount            = 0;
    if(this.subscription == 1){
      if(this.subscription == ""){
        this.plan_error = "Please choose a plan";
        errorCount++;
      }
      if(errorCount == 0){
        $(".change-sub-wrap").hide();
        $(".subscription-updated-wrap").fadeIn();
        this.current_plan = this.subscription;
        this.updateUserPlanDetails();
      }
      
    }else{
      if(this.subscription == ""){
        this.plan_error = "Please choose a plan";
        errorCount++;
      }
      if(this.subscription_plan == ""){
        this.timeperiod_error = "Please choose payment option";
        errorCount++;
      }
      if(errorCount == 0){
        $(".change-sub-wrap").hide();
        $(".sub-wrap-updated").fadeIn();
        this.paymentOptions.forEach(element => {
          if(element['id'] == this.subscription_plan){
            this.current_plan_period = element.time_period;
            this.current_plan_charge = this.payment_amount;
          }
        });
        
        
      }
      
    }
    
  }

  receivePayment(event,paymentInfo:NgForm){
    this.month_err    = "";
    this.year_err     = "";
    this.card_num_err = "";
    let card_text     = $('.cards-digits-enter').val();
    this.card_number  = card_text.replace(/[^0-9]+/g,"");
    if(paymentInfo.valid && this.card_number != ""){
      this.loader_class = "payment-overly";
      this.updateUserPlanDetails();
    }else{
      if(!paymentInfo.value.month){
        this.month_err = "Please choose month of expiry";
      }
      if(!paymentInfo.value.year){
        this.year_err = "Please choose year of expiry";
      }
      if(!paymentInfo.value.card_number && this.card_number == ""){
        $('#chng_plan').scrollTop(0);
        this.card_num_err = "card_num_err";
      }
    }
    
  }

  updateUserPlanDetails(){
    let planData:any                = {};
    planData.token                  = this.token;
    planData.plan_id                = this.subscription;
    planData.payment_option_id      = this.subscription_plan;
    if(this.subscription != 1){
      planData.card_number            = this.card_number;
      planData.card_expiry            = this.month+this.year.slice(-2);
      planData.cvv_number             = this.cvv;
      planData.amount                 = this.payment_amount;
      if(this.isBillingAddress){
        planData.address                = this.address;
        planData.city                   = this.city;
        planData.state                  = this.state;
        planData.zipcode                = this.zipcode;
        planData.country                = this.country;
        planData.phone_number           = this.phone_number;
      }
      
    }
    this.profileService.updatePlanDetails(planData)
          .subscribe(
          (response:any) => {
            this.loader_class = "";
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.paymentOptions       = response.body;
              this.current_plan         = this.subscription;
              $(".sub-wrap-updated").hide();
              $(".subscription-updated-wrap").fadeIn();
     
            }
          },
          (error) => {
             $('#chng_plan').scrollTop(0);
              this.loader_class = "";
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }else{
                this.payment_status       = "Error";
                this.subscription_message = "Payment Status : "+error.status+"<br>Message : "+error.message;
                
              }
          }
    );
  }

  reset_subcription_modal(){
    $(".subscription-updated-wrap").hide();
    $(".sub-wrap-updated").hide();
    $(".change-sub-wrap").fadeIn();
    this.charge_text = "";
  }
  corporatePlan(){
    this.contact_form.resetForm();
    this.successClass = 'success-hide';
    this.successMsg   = "";
  }

  openChangePlanModal(plan_id){
    //this.subscription_form.resetForm();
    this.reset_subcription_modal();
    this.plan_error         = "";
    this.timeperiod_error   = "";
    this.payment_amount     = 0
    this.charge_text        = "";
    this.subscription_plan  = "";
    this.subscription       = plan_id;
    this.onPlanChange(plan_id);
  }
  onPlanChange(value){
    if(this.subscription != ""){
      this.plan_error = "";
    }
    this.charge_text   = "";
    var payment_params = { 'token':this.token ,'plan_id':value };
    this.profileService.getPaymentOptions(payment_params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.paymentOptions = response.body;
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

  getCharge(value,payment){
    if(this.subscription_plan != ""){
      this.timeperiod_error = "";
    }else{
      this.charge_text = "";
    }
    for(let i=0; i<this.paymentOptions.length;i++){
      if(this.paymentOptions[i]['id'] == value){
        this.charge_text         = this.paymentOptions[i].charge+' '+this.paymentOptions[i].time_period;
        this.payment_amount      = this.paymentOptions[i].charge;
      }     
    }
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
    this.set_pwd_form.resetForm();
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
                        error = JSON.parse(error['_bregisteredody']);
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

  setPassword(event,pwdInfo:NgForm){
      if(pwdInfo.valid){
      let params:any          = {};
      params.token            = this.token;
      var resetData         =  pwdInfo.value;
      if(resetData.new_pwd  == resetData.confirm_pwd){
          this.errorMsg     = "";
          let  params       = {'token': this.token,'new_password':resetData.new_pwd };
          this.profileService.resetPassword(params)
          .subscribe(
            (response:any) => {
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                this.SuccessMsg = 'Password saved successfully';
                setTimeout(()=>{    //<<<---    using ()=> syntax
                      $("#set_pwd").modal('hide');
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

  onSubmit(event,paymentInfo:NgForm){

  }

  contactUsSubmit(event,contactInfo:NgForm){
    
    if(contactInfo.valid){
      let params:any      = {};
      params.token        = this.token;
      params.name         = contactInfo.value.name;
      params.message      = contactInfo.value.message;
      params.email        = this.user_email;
      this.profileService.requestCorporatePlan(params)
        .subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          var body   = response.body;
          if(response.success == 1){
            this.successClass = 'success-show';
            this.successMsg   = body.message;
            contactInfo.resetForm();
            setTimeout(()=>{    //<<<---    using ()=> syntax
                  //$("#contactUs").modal('hide');
            },3000);
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

  cancelSubscription(){
    this.current_plan = 1;
    this.updateUserPlanDetails();
    $("#cancel_corporate_plan").modal('hide');
  }

  restrictNumeric = function (e) {
     var input;
     if (e.metaKey || e.ctrlKey) {
        return true;
     }
     if (e.which === 32) {
        return false;
     }
     if (e.which === 0) {
        return true;
     }
     if (e.which < 33) {
        return true;
     }
     input = String.fromCharCode(e.which);
     return !!/[\d\s]/.test(input);
 }

 changeExpiryYear(value){
    if(value != ""){
      this.year_err = "";
    }
 }

 changeExpiryMonth(value){
    if(value != ""){
      this.month_err = "";
    }
 }

 onCardClicked(){
   this.payment_status        = "";
   this.subscription_message  = ""
 }
  
}
