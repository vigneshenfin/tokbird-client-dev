import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ForgotService } from 'app/forgot/forgot.service';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
   providers: [ ForgotService ]
})
export class ForgotComponent implements OnInit {
  errorClass    = 'error-hide';
  successClass  = 'success-hide';
  errorMsg      = 'Something went wrong';
  successMsg    = '';
  constructor(private router:Router,private forgotService : ForgotService) { }
  ngOnInit() {
  }

  onSubmit(event,mailInfo:NgForm){
    event.preventDefault();
    this.errorClass   = 'error-hide';
    this.successClass = 'error-hide';
    var re            = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(mailInfo.valid){
      if(!re.test(mailInfo.value.email)){
          this.errorClass = 'error-show';
          this.errorMsg   = 'Enter a valid email Id';
      }else{
        // To send reset password link
        this.forgotService.sendResetPwdLink(mailInfo).subscribe(
            (response) => this.processRegisteredData(response,mailInfo),
            (error) => this.processErrorData(error)
          ) 
      }
    }
  }

   processRegisteredData(response,registerInfo){
    response = JSON.parse(response['_body']); 
    if(response.success == '1'){ 
       this.successClass = 'success-show';
       this.successMsg   = response.message;
       registerInfo.resetForm();
    }
  }

  processErrorData(response){
    response = JSON.parse(response['_body']); 
    this.errorClass = 'error-show';
    this.errorMsg   = response.message.replace(/<\/?[^>]+(>|$)/g, "");
  }
}
