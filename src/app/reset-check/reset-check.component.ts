import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ResetCheckService } from 'app/reset-check/reset-check.service';
@Component({
  selector: 'app-reset-check',
  templateUrl: './reset-check.component.html',
  styleUrls: ['./reset-check.component.css'],
  providers: [ ResetCheckService]
})
export class ResetCheckComponent implements OnInit {
  errorClass    = 'error-hide';
  successClass  = 'success-hide';
  errorMsg      = 'Something went wrong';
  successShow   = false;
  token_value   = '';
  email         = '';
  constructor(private router:Router,private resetCheckService : ResetCheckService,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
         this.token_value = params['id'];
         this.email       = params['email'];
        console.log(this.token_value);
      });
  }
  onSubmit(event,resetInfo:NgForm){ console.log(this.token_value)
    event.preventDefault();
    this.errorClass = 'error-hide';
    if(resetInfo.valid){
      var resetData = resetInfo.value;
      if(resetData.npassword == resetData.cpassword){
          this.resetCheckService.resetPassword(resetInfo,this.token_value)
          .subscribe(
            (response) => this.processSuccess(response),
            (error) => this.processErrorData(error)
          );
      }else{
        this.errorClass = 'error-show';
        this.errorMsg   = 'New Password field and Confirm Password field must be same';
      }
      
    }
      
  }

  processSuccess(response){
    response = JSON.parse(response['_body']); 
     console.log(response);
    if(response.success == '1'){ 
        this.successClass = 'success-show';
        //this.successMsg   = "Password reset succesfully. Click <a href='https://tokbird.ofabee.com'>HERE</a> to Login";
        this.successShow = true;
        setTimeout((router: Router) => {
            this.router.navigateByUrl('');
        }, 2000);  //5s
        
    }else{
      
    }
  }

  processErrorData(response){
    response = JSON.parse(response['_body']); 
    this.errorClass = 'error-show';
    this.errorMsg   = response.message;
  }
}
